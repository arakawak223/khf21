'use client';

import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/lib/game/GameContext';
import { useAudio } from '@/lib/game/useAudio';
import { EVENT_BGM_MAP, SCREEN_BGM_MAP } from '@/lib/game/bgmManager';
import GameSetup from '@/components/game/GameSetup';
import Dice3D from '@/components/game/Dice3D';
import DestinationRoulette from '@/components/game/DestinationRoulette';
import DestinationChoice from '@/components/game/DestinationChoice';
import DestinationIntro from '@/components/game/DestinationIntro';
import ArrivalSelection from '@/components/game/ArrivalSelection';
import WorldMap from '@/components/game/WorldMap';
import ResizableMapContainer from '@/components/game/ResizableMapContainer';
import ResizablePanels from '@/components/game/ResizablePanels';
import CardHand from '@/components/game/CardHand';
import MissionPanel from '@/components/game/MissionPanel';
import CardTargetSelector from '@/components/game/CardTargetSelector';
import CardEffectNotification from '@/components/game/CardEffectNotification';
import CardObtainedAnimation from '@/components/game/CardObtainedAnimation';
import MultiplayerFlow from '@/components/game/multiplayer/MultiplayerFlow';
import PointsDisplay from '@/components/game/PointsDisplay';
import GameProgress from '@/components/game/GameProgress';
import {
  AttractionEvent,
  StarEvent,
  ArtEvent,
  GourmetEvent,
  TroubleEvent,
  GiverEvent,
  EncouragementGratitudeEvent,
} from '@/components/game/events';
import ArrivalPointsBreakdown from '@/components/game/ArrivalPointsBreakdown';
import FreemanDestinationAnnouncement from '@/components/game/FreemanDestinationAnnouncement';
import { Button } from '@/components/ui/button';
import {
  getAirports,
  createGameSession,
  getUserActiveGameSession,
  getAttractionsByCountry,
  getAttractionsByCity,
  getArtsByCity,
  getGourmetByCountry,
  getGourmetByCity,
} from '@/lib/game/api';
import {
  generateArrivalEvents,
  generateTravelEvents,
  calculateEventPoints,
  type GameEvent,
} from '@/lib/game/eventManager';
import {
  calculateDistance,
  calculateStayDays,
  calculateRouteSpaces,
} from '@/lib/game/movement';
import { createClient } from '@/lib/supabase/client';
import type { Airport, Attraction, Star, Art, Gourmet, Trouble, GiverScenario, EncouragementGratitudeScenario } from '@/types/database.types';
import type { GamePlayer } from '@/types/multiplayer.types';
import { TurnIndicator } from '@/components/game/TurnIndicator';
import { PlayerList } from '@/components/game/PlayerList';
import { FreemanAI } from '@/lib/game/freemanAI';
import { initializeAllPlayersStrategy } from '@/lib/game/playerInitializer';
import { generateDestinationCandidates, selectRandomChooser, generateRandomGroups } from '@/lib/game/destinationSelector';
import { updateCityOccupation, detectOvertake, executeCardEffect, decreaseActiveEffectsDuration, isFrozen, hasDoubleMove, hasDoublePoints, removeActiveEffect, updateMissionProgress } from '@/lib/game/strategyLogic';
import { getCardById, drawRandomPlayerCards } from '@/lib/game/strategyData';
import type { DestinationCandidate, CityOccupation, AirportGroup, GroupColor } from '@/types/strategy.types';
import GroupSelector from '@/components/game/GroupSelector';

// フリーマンのポイントバランス調整用倍率
const FREEMAN_POINT_MULTIPLIER = 1.2; // フリーマンの基本ポイントを1.2倍（人助けイベントと合わせてバランス調整）

function GameContent() {
  const {
    gameSession,
    currentAirport,
    setGameSession,
    setCurrentAirport,
    updateElapsedDays,
    updatePoints,
    setLoading,
    setError,
    // 複数プレイヤー対応
    players,
    currentTurnPlayer,
    setPlayers,
    setCurrentTurnPlayer,
    startTurn,
    endTurn,
  } = useGame();

  const { playBGM, stopBGM, playDiceSteps, playFanfare } = useAudio();

  const [airports, setAirports] = useState<Airport[]>([]);
  const [gameState, setGameState] = useState<'setup' | 'online_multiplayer' | 'playing' | 'completed'>('setup');
  const [screenState, setScreenState] = useState<
    'map' | 'destination_roulette' | 'destination_intro' | 'movement_roulette' | 'arrival_selection' | 'events'
  >('map');
  const [pendingEvents, setPendingEvents] = useState<GameEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedGiverPoints, setSelectedGiverPoints] = useState(0);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [destinationCount, setDestinationCount] = useState<number>(1); // 目的地の順番カウンター（1から開始）
  const [maxDestinations, setMaxDestinations] = useState<number>(5); // 最大目的地数（デフォルト5箇所）
  const [destinationLabel, setDestinationLabel] = useState<string>('5箇所'); // 目的地ラベル
  const [travelDistance, setTravelDistance] = useState<number>(0);
  const [stayDays, setStayDays] = useState<number>(0);
  const [routeSpaces, setRouteSpaces] = useState<Array<{ lat: number; lng: number; spaceNumber: number }>>([]);
  const [currentSpaceNumber, setCurrentSpaceNumber] = useState<number>(0);
  const [arrivalAttraction, setArrivalAttraction] = useState<Attraction | null>(null);
  const [arrivalArt, setArrivalArt] = useState<Art | null>(null);
  const [arrivalGourmet, setArrivalGourmet] = useState<Gourmet | null>(null);
  const [visitedAirportIds, setVisitedAirportIds] = useState<string[]>([]);

  // 目的地ごとの選択済みアイテムと到着済みプレイヤー
  const [destinationSelections, setDestinationSelections] = useState<Record<string, {
    selectedAttraction?: string;
    selectedArt?: string;
    selectedGourmet?: string;
    arrivedPlayers: string[];
  }>>({});

  // 目的地番号ごとの先着プレイヤーID（目的地1、目的地2...）
  const [firstArrivalByDestinationNumber, setFirstArrivalByDestinationNumber] = useState<Record<number, string>>({});
  const [startingAirportId, setStartingAirportId] = useState<string | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [freemanActionMessage, setFreemanActionMessage] = useState<string>('');
  const [freemanRollingDice, setFreemanRollingDice] = useState(false);
  const [freemanDiceProcessing, setFreemanDiceProcessing] = useState(false);
  const [selectedDiceType, setSelectedDiceType] = useState<6 | 12>(6); // ルーレットタイプ（6 or 12）

  // 訪問履歴記録用: 到着前のポイント
  const [arrivalStartPoints, setArrivalStartPoints] = useState<number>(0);

  // グループ選択システム用
  const [airportGroups, setAirportGroups] = useState<AirportGroup[]>([]);
  const [selectedGroupColor, setSelectedGroupColor] = useState<GroupColor | null>(null);
  const [groupSelectionMode, setGroupSelectionMode] = useState<boolean>(false);

  // 都市占有システム用
  const [cityOccupations, setCityOccupations] = useState<Map<string, CityOccupation>>(new Map());

  // 到着ポイント内訳表示用
  const [showArrivalBreakdown, setShowArrivalBreakdown] = useState(false);
  const [arrivalBreakdown, setArrivalBreakdown] = useState<{
    arrivalBonus: number;
    isFirstToArrive: boolean;
    attractionPoints?: number;
    artPoints?: number;
    gourmetPoints?: number;
    attractionName?: string;
    artName?: string;
    gourmetName?: string;
    playerName?: string;
    destinationNumber?: number;
  } | null>(null);

  // フリーマン目的地発表用
  const [showFreemanDestination, setShowFreemanDestination] = useState(false);
  const [freemanSelectedDestination, setFreemanSelectedDestination] = useState<Airport | null>(null);
  const [freemanName, setFreemanName] = useState<string>('');

  // カード使用関連
  const [showCardTargetSelector, setShowCardTargetSelector] = useState(false);
  const [selectedCardToUse, setSelectedCardToUse] = useState<string | null>(null);
  const [cardEffectMessage, setCardEffectMessage] = useState<string>('');
  const [showCardEffect, setShowCardEffect] = useState(false);
  const [showCardObtained, setShowCardObtained] = useState(false);
  const [obtainedCards, setObtainedCards] = useState<import('@/types/strategy.types').PlayerCard[]>([]);
  const [needsTeleportSelection, setNeedsTeleportSelection] = useState(false);
  const [firstDiceResult, setFirstDiceResult] = useState<number | null>(null);
  const [needsSecondDice, setNeedsSecondDice] = useState(false);

  // 空港データ取得
  useEffect(() => {
    const loadAirports = async () => {
      try {
        setLoading(true);
        console.log('Loading airports from database...');
        const data = await getAirports();
        console.log('Airports loaded successfully:', data.length, 'airports');
        if (data.length > 0) {
          console.log('First airport:', data[0]);
        }
        setAirports(data);
      } catch (err) {
        console.error('=== Failed to load airports ===');
        console.error('Error:', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
        }
        setError('空港データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadAirports();
  }, [setLoading, setError]);

  // 既存のアクティブなゲームセッションをチェック
  // 開発中は無効化してGameSetup画面を常に表示
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        // TODO: 開発中は無効化
        return;

        /*
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const activeSession = await getUserActiveGameSession(user.id);
        if (activeSession) {
          setGameSession(activeSession as any);
          setGameState('playing');

          // 現在地の空港情報を取得
          if (activeSession.current_airport) {
            setCurrentAirport(activeSession.current_airport as Airport);
          }
        }
        */
      } catch (err) {
        console.error('Failed to check active session:', err);
      }
    };

    checkActiveSession();
  }, [setGameSession, setCurrentAirport]);

  // ゲーム開始
  const handleStartGame = async (
    destinationCount: number,
    destinationLabel: string,
    startingAirportId: string,
    nickname?: string,
    isMultiplayer?: boolean,
    includeFreeman?: boolean,
    isOnlineMultiplayer?: boolean
  ) => {
    // オンラインマルチプレイヤーの場合は専用フローへ
    if (isOnlineMultiplayer) {
      setGameState('online_multiplayer');
      return;
    }
    try {
      setLoading(true);
      console.log('=== Game Start Debug ===');
      console.log('1. Starting game with:', { destinationCount, destinationLabel, startingAirportId });
      console.log('2. Airports loaded:', airports.length);
      console.log('3. Airports data:', airports.slice(0, 2)); // Show first 2 airports

      // 空港データが読み込まれていない場合のチェック
      if (!airports || airports.length === 0) {
        const errorMsg = '空港データが読み込まれていません。ページを再読み込みしてください。';
        console.error(errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log('4. User:', user ? 'logged in' : 'guest');

      // ゲストユーザーの場合は一時的なIDを使用
      const userId = user?.id || 'guest-' + Date.now();

      // 開始空港を取得
      const airport = airports.find((a) => a.id === startingAirportId);
      console.log('5. Selected airport:', airport);
      console.log('6. Looking for ID:', startingAirportId);

      if (!airport) {
        console.error('Airport not found. Available IDs:', airports.map(a => a.id).slice(0, 5));
        setError('空港が見つかりません');
        setLoading(false);
        return;
      }

      // ニックネームのデフォルト値を設定（未入力の場合は「プレイヤー1」）
      const playerNickname = nickname || 'プレイヤー1';

      // 出発地を記録
      setStartingAirportId(startingAirportId);
      setVisitedAirportIds([startingAirportId]);

      // ゲストセッションを作成（DBに保存しない）
      const sessionId = 'guest-session-' + Date.now();

      // マルチプレイヤーモードの判定（デフォルトはtrue）
      const multiplayerMode = isMultiplayer !== false;
      const withFreeman = includeFreeman !== false && multiplayerMode;

      console.log('Game mode:', multiplayerMode ? 'Multiplayer' : 'Single player');
      console.log('Include Freeman:', withFreeman);

      // 目的地数とラベルを保存
      setMaxDestinations(destinationCount);
      setDestinationLabel(destinationLabel);

      const guestSession: any = {
        id: sessionId,
        user_id: userId,
        period_setting_id: '',
        start_date: new Date().toISOString(),
        max_destinations: destinationCount,
        current_destinations: 0,
        current_location_type: 'airport',
        current_airport_id: startingAirportId,
        current_port_id: null,
        impressed_points: 0,
        giver_points: 0,
        total_points: 0,
        status: 'active',
        completed_at: null,
        player_nickname: playerNickname,
        player_color: 'red',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // 複数プレイヤー対応
        is_multiplayer: multiplayerMode,
        total_players: withFreeman ? 2 : 1,
        current_turn_order: 1,
      };

      // プレイヤー作成
      const allPlayers: any[] = [];

      // プレイヤー1: 人間
      const humanPlayer: any = {
        id: 'player-human-' + Date.now(),
        game_session_id: sessionId,
        player_type: 'human',
        player_order: 1,
        player_nickname: playerNickname,
        player_color: '#3b82f6', // 青
        nationality: 'Japan', // デフォルトの国籍
        current_location_type: 'airport',
        current_airport_id: startingAirportId,
        current_port_id: null,
        current_space_number: 0,
        destination_airport_id: null,
        route_spaces: null,
        impressed_points: 0,
        giver_points: 0,
        total_points: 0,
        arrival_points: 0, // 到着ポイント（別途トラッキング）
        resource_points: 1000, // 初期資源ポイント
        total_spent_points: 0,
        current_flight_class: 'economy',
        current_hotel_grade: 'standard',
        star_encounter_bonus: 0,
        character_trait: 'balanced',
        trait_long_distance_bonus: 0,
        trait_event_rate_modifier: 0,
        is_skipping_turn: false,
        freeman_type: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      allPlayers.push(humanPlayer);

      // マルチプレイヤーモードでフリーマンを含める場合
      if (withFreeman) {
        console.log('Creating D-Freeman opponent...');
        const freemanPlayer: any = {
          id: 'player-freeman-' + Date.now(),
          game_session_id: sessionId,
          player_type: 'freeman_d',
          player_order: 2,
          player_nickname: 'Dフリーマン',
          player_color: '#ef4444', // 赤
          nationality: 'AI', // AI国籍
          current_location_type: 'airport',
          current_airport_id: startingAirportId,
          current_port_id: null,
          current_space_number: 0,
          destination_airport_id: null,
          route_spaces: null,
          impressed_points: 0,
          giver_points: 0,
          total_points: 0,
          arrival_points: 0, // 到着ポイント（別途トラッキング）
          resource_points: 1000,
          total_spent_points: 0,
          current_flight_class: 'economy',
          current_hotel_grade: 'standard',
          star_encounter_bonus: 0,
          character_trait: 'balanced',
          trait_long_distance_bonus: 0,
          trait_event_rate_modifier: 0,
          is_skipping_turn: false,
          freeman_type: 'defense',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        allPlayers.push(freemanPlayer);
      }

      console.log('Players created:', allPlayers);

      // プレイヤーにカードとミッションを初期化（マルチプレイヤー時のみ）
      let finalPlayers = allPlayers;
      if (multiplayerMode) {
        finalPlayers = initializeAllPlayersStrategy(allPlayers);
        console.log('Players initialized with cards and missions:', finalPlayers);
      }

      // GameContextに設定
      setPlayers(finalPlayers);
      setCurrentTurnPlayer(finalPlayers[0]); // 最初は人間のターン

      setCurrentAirport(airport);
      setGameSession(guestSession);
      setGameState('playing');

      console.log(`Game started in ${multiplayerMode ? 'multiplayer' : 'single player'} mode`);
      console.log('Total players:', finalPlayers.length);
      console.log('Current turn player:', finalPlayers[0].player_nickname);
    } catch (err) {
      console.error('=== Game Start Error ===');
      console.error('Error object:', err);
      console.error('Error type:', typeof err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      } else {
        console.error('Error details:', JSON.stringify(err, null, 2));
      }
      setError('ゲームの開始に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // 移動を実行
  const performMove = async (destination: Airport, _distance: number, days: number) => {
    console.log(`Arriving at ${destination.city}, staying for ${days} days`);

    // 現在地を更新
    setCurrentAirport(destination);

    // 訪問済み空港に追加（新しい配列を作成）
    const newVisitedIds = [...visitedAirportIds, destination.id];
    setVisitedAirportIds(newVisitedIds);

    // 経過日数を加算（滞在日数のトラッキングは残す）
    updateElapsedDays(days);

    // ゲーム終了チェックはuseEffectで各プレイヤーのvisit_historyをチェックして行う

    // Multiplayer: 現在のターンプレイヤーの状態を更新（目的地到達）
    if ((gameSession as any).is_multiplayer && currentTurnPlayer) {
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((p) =>
          p.id === currentTurnPlayer.id
            ? {
                ...p,
                current_airport_id: destination.id,
                route_spaces: null, // ルートをクリア
                current_space_number: 0, // マス数をリセット
              }
            : p
        );
        setCurrentTurnPlayer(updatedPlayers.find(p => p.id === currentTurnPlayer.id) || currentTurnPlayer);
        console.log(`プレイヤー ${currentTurnPlayer.player_nickname} が ${destination.city} に到着`);
        return updatedPlayers;
      });
    }

    // 目的地をクリア
    setDestinationAirport(null);
    setTravelDistance(0);
    setStayDays(0);

    // ルートをクリア
    setRouteSpaces([]);
    setCurrentSpaceNumber(0);

    // 到着選択データをクリア
    setArrivalAttraction(null);
    setArrivalArt(null);
    setArrivalGourmet(null);

    // マップ画面に戻る
    setScreenState('map');

    // ターン切り替えは明示的に呼ばれた時のみ行う（自動では行わない）
    console.log('目的地到着完了。マップ画面に戻りました。');
  };

  // 目的地紹介から出発（移動ルーレット画面へ）
  const handleDepartToDestination = () => {
    if (!destinationAirport) return;

    // 移動ルーレット画面へ遷移
    console.log(`Departing to destination. Total spaces: ${routeSpaces.length}`);
    setScreenState('movement_roulette');
  };

  // 目的地選択を開始（3択システム）
  const handleStartDestinationSelection = () => {
    if (!currentAirport || players.length === 0) return;

    console.log('目的地選択を開始: 3グループシステム');

    // 占有都市マップを作成
    const occupiedCitiesMap = new Map<string, { playerId: string; level: number }>();
    players.forEach(p => {
      const occupied = p.occupied_cities || [];
      occupied.forEach((cityId: string) => {
        occupiedCitiesMap.set(cityId, { playerId: p.id, level: 1 });
      });
    });

    // 3つのランダムグループを生成
    const groups = generateRandomGroups(
      airports,
      currentAirport.id,
      visitedAirportIds,
      players,
      currentTurnPlayer?.id || '',
      occupiedCitiesMap
    );

    console.log('グループ生成:', groups.map(g => `${g.emoji} ${g.count}空港`));

    setAirportGroups(groups);
    setGroupSelectionMode(true);
    setSelectedGroupColor(null);
    setScreenState('destination_roulette');
  };

  // グループ選択完了時
  const handleGroupSelected = (color: GroupColor) => {
    console.log(`グループ選択: ${color}`);

    setSelectedGroupColor(color);
    setGroupSelectionMode(false);

    // ルーレット画面に移行（groupSelectionMode=falseになると自動的にルーレットが表示される）
  };

  // 目的地ルーレット完了時（ランダムに目的地を決定）
  const handleDestinationSelected = (destination: Airport) => {
    if (!currentAirport || !currentTurnPlayer) return;

    const distance = calculateDistance(currentAirport, destination);
    const days = calculateStayDays(distance);

    // 次の目的地番号を計算（開始空港 + 訪問済み目的地 + 1）
    const nextDestinationNumber = visitedAirportIds.length + 1;

    // 現在のプレイヤーの訪問履歴から目的地番号を判定
    const visitedCount = currentTurnPlayer.visit_history?.length || 0;
    const isSharedDestination = visitedCount === 0; // 目的地1のみ共通

    console.log(`Selected destination: ${destination.city}, distance: ${distance}km, stay: ${days} days (目的地${nextDestinationNumber}), 共通目的地: ${isSharedDestination}`);

    setDestinationAirport(destination);
    setTravelDistance(distance);
    setStayDays(days);

    // 新しい目的地の選択済みリストを初期化（目的地1のみ）
    if (isSharedDestination) {
      setDestinationSelections({
        ...destinationSelections,
        [destination.id]: { arrivedPlayers: [] },
      });
      console.log(`新しい目的地の選択リストを初期化: ${destination.city}`);
    }

    let currentPlayerRoute: Array<{ lat: number; lng: number; spaceNumber: number }> | null = null;

    const updatedPlayers = players.map((p) => {
      // 目的地1の場合: 全プレイヤーにルートを設定
      if (isSharedDestination) {
        // route_spacesがnullまたは目的地に到達済みの場合は新しいルートを設定
        if (p.route_spaces === null || p.current_space_number >= (p.route_spaces?.length || 0)) {
          // 各プレイヤーの現在地を取得
          const playerCurrentAirport = airports.find(a => a.id === p.current_airport_id);
          if (playerCurrentAirport) {
            // プレイヤーの現在地から新しい目的地へのルートを計算
            const playerSpaces = calculateRouteSpaces(playerCurrentAirport, destination, 500);
            console.log(`[共通] ${p.player_nickname}: ${playerCurrentAirport.city} → ${destination.city} (${playerSpaces.length}マス)`);

            // 現在のプレイヤーの場合は保存
            if (p.id === currentTurnPlayer?.id) {
              currentPlayerRoute = playerSpaces;
            }

            return {
              ...p,
              destination_airport_id: destination.id,
              route_spaces: playerSpaces,
              current_space_number: 0,
            };
          }
        }
      } else {
        // 目的地2以降の場合: 現在のプレイヤーのみにルートを設定
        if (p.id === currentTurnPlayer.id) {
          const playerCurrentAirport = airports.find(a => a.id === p.current_airport_id);
          if (playerCurrentAirport) {
            const playerSpaces = calculateRouteSpaces(playerCurrentAirport, destination, 500);
            console.log(`[個別] ${p.player_nickname}: ${playerCurrentAirport.city} → ${destination.city} (${playerSpaces.length}マス)`);
            currentPlayerRoute = playerSpaces;

            return {
              ...p,
              destination_airport_id: destination.id,
              route_spaces: playerSpaces,
              current_space_number: 0,
            };
          }
        }
      }
      return p;
    });

    setPlayers(updatedPlayers);

    // 現在のプレイヤーの状態を更新
    if (currentTurnPlayer) {
      const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentTurnPlayer.id);
      if (updatedCurrentPlayer) {
        setCurrentTurnPlayer(updatedCurrentPlayer);
      }
    }

    // グローバル状態を更新
    if (currentPlayerRoute) {
      setRouteSpaces(currentPlayerRoute);
      setCurrentSpaceNumber(0);
    }

    if (isSharedDestination) {
      console.log(`共通目的地を設定: ${destination.city}`);
    } else {
      console.log(`個別目的地を設定: ${destination.city} (${currentTurnPlayer.player_nickname})`);
    }

    // 目的地紹介画面へ遷移
    setScreenState('destination_intro');
  };

  // 移動ルーレット完了時（マス数を進める）
  const handleMovementRouletteComplete = async (result: number) => {
    console.log('Movement roulette result:', result, 'spaces');

    // プレイヤー状態から情報を取得（プレイヤー状態が唯一の真実）
    if (!destinationAirport || !currentTurnPlayer?.route_spaces) {
      console.error('No destination or route in current player state');
      return;
    }

    // double_move 効果のチェック
    if (currentTurnPlayer && hasDoubleMove(currentTurnPlayer) && !needsSecondDice) {
      // 1回目のサイコロの結果を保存
      setFirstDiceResult(result);
      setNeedsSecondDice(true);
      console.log(`double_move 効果発動！1回目: ${result}、2回目のサイコロを振ります`);
      // double_move 効果を削除
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === currentTurnPlayer.id) {
            return removeActiveEffect(p, 'double_move');
          }
          return p;
        });
      });
      // ルーレットタイプをリセットせず、2回目のサイコロを待つ
      return;
    }

    // 2回目のサイコロの場合、結果を合算
    let finalResult = result;
    if (needsSecondDice && firstDiceResult !== null) {
      finalResult = firstDiceResult + result;
      console.log(`double_move 効果: 1回目${firstDiceResult} + 2回目${result} = ${finalResult}`);
      // リセット
      setFirstDiceResult(null);
      setNeedsSecondDice(false);
    }

    // ルーレットタイプをリセット
    setSelectedDiceType(6);

    // グローバル状態とプレイヤー状態を同期（既に共通目的地を使用しているので同期は不要）
    // ルートとマス数は同期
    if (!routeSpaces || routeSpaces.length === 0) {
      setRouteSpaces(currentTurnPlayer.route_spaces);
    }
    if (currentSpaceNumber !== currentTurnPlayer.current_space_number) {
      setCurrentSpaceNumber(currentTurnPlayer.current_space_number);
    }

    // マス進行音を再生（カチッカチッカチッ）
    playDiceSteps(finalResult);

    // マス数を進める
    const newSpaceNumber = currentTurnPlayer.current_space_number + finalResult;
    const totalSpaces = currentTurnPlayer.route_spaces.length;
    console.log(`Moving from space ${currentTurnPlayer.current_space_number} to ${newSpaceNumber} (total spaces: ${totalSpaces})`);

    // 目的地到達チェック
    if (newSpaceNumber >= totalSpaces) {
      // 到達！最終マスに設定
      setCurrentSpaceNumber(totalSpaces);

      // プレイヤー状態も更新（到達済みにする）
      setPlayers((prevPlayers) => {
        const arrivedPlayers = prevPlayers.map((p) =>
          p.id === currentTurnPlayer.id
            ? {
                ...p,
                current_space_number: totalSpaces,
              }
            : p
        );
        setCurrentTurnPlayer(arrivedPlayers.find(p => p.id === currentTurnPlayer.id) || currentTurnPlayer);
        return arrivedPlayers;
      });

      console.log(`Arrived at destination!`);

      // 到着ファンファーレを再生（人間プレイヤー用の新しいBGM）
      playFanfare(true);

      // プレイヤーのroute_spacesから実際の到着空港を特定
      const finalRouteSpace = currentTurnPlayer.route_spaces[currentTurnPlayer.route_spaces.length - 1];
      const actualDestinationAirport = airports.reduce((nearest, airport) => {
        const distToCurrent = Math.sqrt(
          Math.pow(airport.latitude - finalRouteSpace.lat, 2) +
          Math.pow(airport.longitude - finalRouteSpace.lng, 2)
        );
        const distToNearest = Math.sqrt(
          Math.pow(nearest.latitude - finalRouteSpace.lat, 2) +
          Math.pow(nearest.longitude - finalRouteSpace.lng, 2)
        );
        return distToCurrent < distToNearest ? airport : nearest;
      }, airports[0]);

      console.log(`=== プレイヤー${currentTurnPlayer.player_nickname}の到着地特定 ===`);
      console.log(`route_spaces最終地点: lat=${finalRouteSpace.lat}, lng=${finalRouteSpace.lng}`);
      console.log(`実際の到着空港: ${actualDestinationAirport.city} (${actualDestinationAirport.name})`);

      // 到着地の名所・アート・グルメをフェッチ
      try {
        setLoading(true);
        console.log('=== 到着地データ取得 ===');
        console.log(`目的地: ${actualDestinationAirport.city}, ${actualDestinationAirport.country}`);

        // 先着者かどうかを判定
        const currentDestId = actualDestinationAirport.id;
        const currentSelections = destinationSelections[currentDestId] || { arrivedPlayers: [] };
        const isFirstToArrive = currentSelections.arrivedPlayers.length === 0;

        console.log(`到着判定: ${isFirstToArrive ? '先着者' : '後着者'} (${currentSelections.arrivedPlayers.length + 1}番目)`);

        // 🔥 重要修正: 都市レベルでデータ取得（国レベルだと同じ国の他都市が混ざる）
        const [attractions, arts, gourmets] = await Promise.all([
          getAttractionsByCity(actualDestinationAirport.city),
          getArtsByCity(actualDestinationAirport.city),
          getGourmetByCity(actualDestinationAirport.city),
        ]);

        console.log(`名所データ: ${attractions.length}件`);
        console.log(`アートデータ: ${arts.length}件`);
        console.log(`グルメデータ: ${gourmets.length}件`);

        // データ不足の警告
        if (attractions.length === 0) {
          console.warn(`⚠️ ${actualDestinationAirport.country}の名所データがありません`);
        }
        if (arts.length === 0) {
          console.warn(`⚠️ ${actualDestinationAirport.city}のアートデータがありません`);
        }
        if (gourmets.length === 0) {
          console.warn(`⚠️ ${actualDestinationAirport.country}のグルメデータがありません`);
        }

        // 後続到着者の場合は選択済みアイテムを除外
        // 🔥 重要: 到着した都市に紐づくデータのみを選択
        // まず都市でフィルタリング
        const cityName = actualDestinationAirport.city;
        console.log(`🏙️ 到着都市: ${cityName} - この都市のリソースのみを選択`);

        let availableAttractions = attractions.filter(a => {
          // cityフィールドを持つ場合はそれで比較、なければcountryで比較
          const matchCity = a.city && a.city.toLowerCase() === cityName.toLowerCase();
          return matchCity;
        });

        let availableArts = arts.filter(a => {
          const matchCity = a.city && a.city.toLowerCase() === cityName.toLowerCase();
          return matchCity;
        });

        let availableGourmets = gourmets.filter(g => {
          const matchCity = g.city && g.city.toLowerCase() === cityName.toLowerCase();
          return matchCity;
        });

        console.log(`📍 ${cityName}のリソース数: 名所${availableAttractions.length}件 / アート${availableArts.length}件 / グルメ${availableGourmets.length}件`);

        if (!isFirstToArrive) {
          // 選択済みアイテムを除外
          if (currentSelections.selectedAttraction) {
            const beforeCount = availableAttractions.length;
            availableAttractions = availableAttractions.filter(a => a.id !== currentSelections.selectedAttraction);
            console.log(`名所から選択済みを除外: ${availableAttractions.length}/${beforeCount}件`);
          }
          if (currentSelections.selectedArt) {
            const beforeCount = availableArts.length;
            availableArts = availableArts.filter(a => a.id !== currentSelections.selectedArt);
            console.log(`アートから選択済みを除外: ${availableArts.length}/${beforeCount}件`);
          }
          if (currentSelections.selectedGourmet) {
            const beforeCount = availableGourmets.length;
            availableGourmets = availableGourmets.filter(g => g.id !== currentSelections.selectedGourmet);
            console.log(`グルメから選択済みを除外: ${availableGourmets.length}/${beforeCount}件`);
          }
        }

        // 各カテゴリから選択
        // 🏆 世界遺産を優先的に選択（70%の確率）
        let randomAttraction: Attraction;
        if (availableAttractions.length > 0) {
          const worldHeritages = availableAttractions.filter(a => a.category === 'world_heritage');
          const shouldSelectWorldHeritage = worldHeritages.length > 0 && Math.random() < 0.7;

          if (shouldSelectWorldHeritage) {
            // 世界遺産から選択
            randomAttraction = worldHeritages[Math.floor(Math.random() * worldHeritages.length)];
            console.log('🏆 世界遺産を選択:', randomAttraction.name_ja);
          } else {
            // 通常の名所から選択
            randomAttraction = availableAttractions[Math.floor(Math.random() * availableAttractions.length)];
          }
        } else {
          // データがない場合は、この地域用の仮データを生成
          randomAttraction = {
            id: 'temp-attraction',
            name: `${actualDestinationAirport.city}の名所`,
            name_ja: `${actualDestinationAirport.city}の名所`,
            country: actualDestinationAirport.country,
            impressed_points: 50,
            description: `${actualDestinationAirport.city}を代表する素晴らしい観光地です。`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Attraction;
        }

        let randomArt = availableArts.length > 0
          ? availableArts[Math.floor(Math.random() * availableArts.length)]
          : {
              id: 'temp-art',
              name: `${actualDestinationAirport.city}の芸術作品`,
              name_ja: `${actualDestinationAirport.city}の芸術作品`,
              city: actualDestinationAirport.city,
              impressed_points: 50,
              description: `${actualDestinationAirport.city}で鑑賞できる美しい芸術作品です。`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as Art;

        let randomGourmet = availableGourmets.length > 0
          ? availableGourmets[Math.floor(Math.random() * availableGourmets.length)]
          : {
              id: 'temp-gourmet',
              name: `${actualDestinationAirport.city}の郷土料理`,
              name_ja: `${actualDestinationAirport.city}の郷土料理`,
              country: actualDestinationAirport.country,
              impressed_points: 50,
              description: `${actualDestinationAirport.city}で味わえる美味しい料理です。`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as Gourmet;

        console.log('選択された名所:', randomAttraction?.name_ja || randomAttraction?.name, `(${randomAttraction?.country})`);
        console.log('選択されたアート:', randomArt?.name_ja || randomArt?.name, `(${randomArt?.city})`);
        console.log('選択されたグルメ:', randomGourmet?.name_ja || randomGourmet?.name, `(${randomGourmet?.country})`);

        setArrivalAttraction(randomAttraction);
        setArrivalArt(randomArt);
        setArrivalGourmet(randomGourmet);

        console.log('Loaded arrival options:', {
          attraction: randomAttraction?.name_ja || randomAttraction?.name,
          art: randomArt?.name_ja || randomArt?.name,
          gourmet: randomGourmet?.name_ja || randomGourmet?.name,
        });

        // 到着選択画面へ
        setScreenState('arrival_selection');
      } catch (err) {
        console.error('Failed to load arrival options:', err);
        // エラーが発生した場合は通常の到着イベントを表示
        const arrivalEvents = await generateArrivalEvents();
        if (arrivalEvents.length > 0) {
          setPendingEvents(arrivalEvents);
          setCurrentEventIndex(0);
          setScreenState('events');
        } else {
          const distance = calculateDistance(currentAirport!, actualDestinationAirport);
          const days = calculateStayDays(distance);
          performMove(actualDestinationAirport, distance, days);
        }
      } finally {
        setLoading(false);
      }

      // 実際の到着空港をグローバル状態に設定（ArrivalSelection画面で使用）
      setDestinationAirport(actualDestinationAirport);
    } else {
      // まだ到達していない - マス数を更新して移動中イベントを生成
      setCurrentSpaceNumber(newSpaceNumber);
      console.log(`Not yet arrived. Current space: ${newSpaceNumber}/${totalSpaces}`);

      // Multiplayer: 現在のプレイヤーの位置を更新
      if ((gameSession as any).is_multiplayer && currentTurnPlayer) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = prevPlayers.map((p) =>
            p.id === currentTurnPlayer.id
              ? {
                  ...p,
                  current_space_number: newSpaceNumber,
                }
              : p
          );

          // currentTurnPlayerも更新
          const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentTurnPlayer.id);
          if (updatedCurrentPlayer) {
            setCurrentTurnPlayer(updatedCurrentPlayer);

            // 追い抜きイベント検出
            const otherPlayers = updatedPlayers.filter(p => p.id !== updatedCurrentPlayer.id);
            const overtakeEvent = detectOvertake(updatedCurrentPlayer, otherPlayers);

            if (overtakeEvent) {
              const overtakenPlayer = otherPlayers.find(p => p.id === overtakeEvent.overtaken);

              // フリーマンの場合はポイントを倍増
              const isFreeman = updatedCurrentPlayer.player_type === 'freeman_d' || updatedCurrentPlayer.player_type === 'freeman_s';
              const multiplier = isFreeman ? FREEMAN_POINT_MULTIPLIER : 1.0;
              const adjustedBonus = Math.floor(overtakeEvent.bonusPoints * multiplier);

              console.log(`🏃 追い抜きイベント発生！`);
              console.log(`  追い抜いた: ${updatedCurrentPlayer.player_nickname}`);
              console.log(`  追い抜かれた: ${overtakenPlayer?.player_nickname}`);
              console.log(`  ボーナスポイント: +${adjustedBonus}pt${isFreeman ? ` (フリーマンボーナス: ${multiplier}x)` : ''}`);

              // ボーナスポイントを付与
              const playersWithBonus = updatedPlayers.map(p =>
                p.id === updatedCurrentPlayer.id
                  ? {
                      ...p,
                      total_points: p.total_points + adjustedBonus,
                      impressed_points: p.impressed_points + adjustedBonus,
                    }
                  : p
              );

              // 統計情報を更新
              const finalPlayers = playersWithBonus.map(p => {
                if (p.id === updatedCurrentPlayer.id) {
                  return {
                    ...p,
                    statistics: {
                      ...p.statistics,
                      overtakeCount: (p.statistics?.overtakeCount || 0) + 1,
                    } as any,
                  };
                } else if (p.id === overtakenPlayer?.id) {
                  return {
                    ...p,
                    statistics: {
                      ...p.statistics,
                      overtakenCount: (p.statistics?.overtakenCount || 0) + 1,
                    } as any,
                  };
                }
                return p;
              });

              return finalPlayers;
            }
          }
          return updatedPlayers;
        });
      }

      // 移動中のイベントを生成
      const travelEvents = await generateTravelEvents();

      if (travelEvents.length > 0) {
        setPendingEvents(travelEvents);
        setCurrentEventIndex(0);
        setScreenState('events');
      } else {
        // Multiplayer: イベントがない場合は即座にターン交代
        if ((gameSession as any).is_multiplayer && currentTurnPlayer) {
          console.log('マス移動完了: 自動的に次のプレイヤーへ');
          setScreenState('map');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await switchToNextTurn();
        } else {
          // シングルプレイヤー: 移動ルーレットに戻る
          setScreenState('movement_roulette');
        }
      }
    }
  };

  // 到着選択ハンドラー
  const handleArrivalSelection = async (option: { type: 'attraction' | 'art' | 'gourmet'; data: any }) => {
    console.log('Selected arrival option:', option.type);

    // 訪問履歴記録用: 到着前のポイントを記録
    if (currentTurnPlayer) {
      setArrivalStartPoints(currentTurnPlayer.total_points);
    }

    // 先着ボーナス・都市占有システム
    let arrivalBonus = 0;
    let tollFee = 0;
    let isFirstToArrive = false;
    let rank = 1;

    if (currentTurnPlayer && currentTurnPlayer.route_spaces && currentTurnPlayer.route_spaces.length > 0) {
      // プレイヤーのroute_spacesから実際の到着空港を特定
      const finalRouteSpace = currentTurnPlayer.route_spaces[currentTurnPlayer.route_spaces.length - 1];
      const actualDestinationAirport = airports.reduce((nearest, airport) => {
        const distToCurrent = Math.sqrt(
          Math.pow(airport.latitude - finalRouteSpace.lat, 2) +
          Math.pow(airport.longitude - finalRouteSpace.lng, 2)
        );
        const distToNearest = Math.sqrt(
          Math.pow(nearest.latitude - finalRouteSpace.lat, 2) +
          Math.pow(nearest.longitude - finalRouteSpace.lng, 2)
        );
        return distToCurrent < distToNearest ? airport : nearest;
      }, airports[0]);

      const destId = actualDestinationAirport.id;
      const currentSelections = destinationSelections[destId] || { arrivedPlayers: [] };

      // 現在のプレイヤーの目的地番号（訪問履歴の長さ + 1）
      const currentDestinationNumber = (currentTurnPlayer.visit_history?.length || 0) + 1;

      console.log(`=== handleArrivalSelection: 到着空港特定 ===`);
      console.log(`プレイヤー: ${currentTurnPlayer.player_nickname}`);
      console.log(`実際の到着空港: ${actualDestinationAirport.city} (ID: ${destId})`);
      console.log(`目的地番号: ${currentDestinationNumber}`);
      console.log(`既到着者数: ${currentSelections.arrivedPlayers.length}`);

      // 目的地番号ごとに先着判定（空港ではなく目的地順番で判定）
      isFirstToArrive = !firstArrivalByDestinationNumber[currentDestinationNumber];

      if (isFirstToArrive) {
        // 先着者を記録
        setFirstArrivalByDestinationNumber({
          ...firstArrivalByDestinationNumber,
          [currentDestinationNumber]: currentTurnPlayer.id,
        });
        console.log(`目的地${currentDestinationNumber}の先着者: ${currentTurnPlayer.player_nickname}`);
      } else {
        console.log(`目的地${currentDestinationNumber}の後着者（先着者: ${firstArrivalByDestinationNumber[currentDestinationNumber]}）`);
      }

      rank = currentSelections.arrivedPlayers.length + 1;

      // 先着者のみが到着ボーナスを得る
      if (isFirstToArrive) {
        // 先着ボーナス計算
        const baseBonus = Math.floor(travelDistance / 100);
        const firstArrivalBonus = 100;
        arrivalBonus = baseBonus + firstArrivalBonus;
        tollFee = 0;
        console.log(`先着ボーナス: ${arrivalBonus}pt (基本: ${baseBonus}pt + 先着: ${firstArrivalBonus}pt)`);
      } else {
        // 後着者はボーナスなし（通行料のみ）
        arrivalBonus = 0;

        // 都市占有者がいる場合は通行料を計算
        const occupation = cityOccupations.get(destId);
        if (occupation && occupation.occupiedBy !== currentTurnPlayer.id) {
          tollFee = occupation.tollFee;
          console.log(`後着者: ボーナスなし、通行料: ${tollFee}pt`);
        } else {
          tollFee = 0;
          console.log(`後着者: ボーナスなし、通行料なし`);
        }
      }

      console.log(`到着判定: 順位${rank}番目, 先着: ${isFirstToArrive}, ボーナス: ${arrivalBonus}pt, 通行料: ${tollFee}pt`);

      // 都市占有を更新
      const newOccupations = updateCityOccupation(
        destId,
        actualDestinationAirport.city,
        currentTurnPlayer.id,
        cityOccupations
      );
      setCityOccupations(newOccupations);

      // プレイヤーの占有都市リストも更新
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === currentTurnPlayer.id) {
            const occupation = newOccupations.get(destId);
            const occupiedCities = p.occupied_cities || [];
            if (occupation && occupation.occupiedBy === p.id && !occupiedCities.includes(destId)) {
              return {
                ...p,
                occupied_cities: [...occupiedCities, destId],
              };
            }
          }
          return p;
        });
      });

      // 選択済みアイテムを更新
      const updatedSelections = {
        ...currentSelections,
        arrivedPlayers: [...currentSelections.arrivedPlayers, currentTurnPlayer.id],
      };

      // 選択されたアイテムのIDを記録
      if (option.type === 'attraction') {
        updatedSelections.selectedAttraction = option.data.id;
      } else if (option.type === 'art') {
        updatedSelections.selectedArt = option.data.id;
      } else if (option.type === 'gourmet') {
        updatedSelections.selectedGourmet = option.data.id;
      }

      setDestinationSelections({
        ...destinationSelections,
        [destId]: updatedSelections,
      });

      console.log(`選択を記録: ${option.type} = ${option.data.id} (到着者数: ${updatedSelections.arrivedPlayers.length})`);

      // 到着ボーナス（通行料を含む）をプレイヤーに即座に加算
      if (arrivalBonus !== 0) {
        // フリーマンの場合はポイントを倍増
        const isFreeman = currentTurnPlayer.player_type === 'freeman_d' || currentTurnPlayer.player_type === 'freeman_s';
        let multiplier = isFreeman ? FREEMAN_POINT_MULTIPLIER : 1.0;

        // double_points 効果のチェック
        const hasDoublePointsEffect = hasDoublePoints(currentTurnPlayer);
        if (hasDoublePointsEffect) {
          multiplier *= 2;
          console.log('double_points 効果発動！ポイント2倍');
        }

        const adjustedBonus = Math.floor(arrivalBonus * multiplier);

        setPlayers((prevPlayers) => {
          let updatedPlayers = prevPlayers.map((p) =>
            p.id === currentTurnPlayer.id
              ? {
                  ...p,
                  impressed_points: Math.max(0, p.impressed_points + adjustedBonus),
                  arrival_points: (p.arrival_points || 0) + adjustedBonus, // 到着ポイントを別途記録
                  total_points: Math.max(0, p.total_points + adjustedBonus),
                }
              : p
          );

          // double_points 効果を削除
          if (hasDoublePointsEffect) {
            updatedPlayers = updatedPlayers.map((p) =>
              p.id === currentTurnPlayer.id ? removeActiveEffect(p, 'double_points') : p
            );
          }

          // currentTurnPlayerも更新
          const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentTurnPlayer.id);
          if (updatedCurrentPlayer) {
            setCurrentTurnPlayer(updatedCurrentPlayer);
          }

          const bonusType = isFirstToArrive ? '先着ボーナス' : tollFee > 0 ? `到着ポイント（通行料-${tollFee}）` : '到着ポイント';
          const logSuffix = isFreeman ? ` (フリーマンボーナス: ${multiplier}x)` : hasDoublePointsEffect ? ' (double_points: 2x)' : '';
          console.log(`プレイヤー ${currentTurnPlayer.player_nickname} に${bonusType} ${adjustedBonus}pt を付与${logSuffix}`);
          return updatedPlayers;
        });
      }

      // カード獲得イベント（目的地到着時、一定確率で）
      if (currentTurnPlayer.player_type === 'human') {
        const cardDropRate = 0.3; // 30%の確率でカードを獲得
        if (Math.random() < cardDropRate) {
          const newCards = drawRandomPlayerCards(1);
          setPlayers((prevPlayers) => {
            return prevPlayers.map((p) => {
              if (p.id === currentTurnPlayer.id) {
                return {
                  ...p,
                  cards: [...(p.cards || []), ...newCards],
                };
              }
              return p;
            });
          });
          // カード獲得アニメーション表示
          setObtainedCards(newCards);
          setShowCardObtained(true);
          console.log(`カード獲得: ${newCards.map(c => getCardById(c.cardId)?.nameJa).join(', ')}`);
        }
      }
    }

    // 選択したイベントを作成
    const selectedEvent: GameEvent = {
      type: option.type,
      data: option.data,
    };

    // その他の到着イベントを生成
    const otherArrivalEvents = await generateArrivalEvents();

    // 選択したイベントを最初に、その後に他のイベントを追加
    const allEvents = [selectedEvent, ...otherArrivalEvents];

    setPendingEvents(allEvents);
    setCurrentEventIndex(0);

    // イベント画面に遷移してから、ポイント内訳モーダルを表示
    setScreenState('events');

    // ポイント内訳を設定
    const breakdown = {
      arrivalBonus: arrivalBonus || 0,
      isFirstToArrive: isFirstToArrive,
      attractionPoints: option.type === 'attraction' ? (option.data as Attraction).impressed_points : undefined,
      artPoints: option.type === 'art' ? (option.data as Art).impressed_points : undefined,
      gourmetPoints: option.type === 'gourmet' ? (option.data as Gourmet).impressed_points : undefined,
      attractionName: option.type === 'attraction' ? (option.data as Attraction).name : undefined,
      artName: option.type === 'art' ? (option.data as Art).name : undefined,
      gourmetName: option.type === 'gourmet' ? (option.data as Gourmet).name : undefined,
      destinationNumber: currentTurnPlayer ? (currentTurnPlayer.visit_history?.length || 0) + 1 : 1,
      playerName: currentTurnPlayer?.player_nickname,
    };
    console.log('到着ポイント内訳を設定:', breakdown);
    console.log('イベント数:', allEvents.length);
    setArrivalBreakdown(breakdown);

    // 少し遅延してモーダルを表示（画面遷移が完了してから）
    setTimeout(() => {
      setShowArrivalBreakdown(true);
      console.log('到着ポイント内訳モーダルを表示');
    }, 100);
  };

  // イベント完了時
  const handleEventClose = async () => {
    const currentEvent = pendingEvents[currentEventIndex];

    // イベントマスに色を記録
    if (currentTurnPlayer && currentEvent) {
      const eventType = currentEvent.type;
      const spaceNumber = currentTurnPlayer.current_space_number;

      // イベントタイプをマッピング
      let mappedEventType: 'star' | 'trouble' | 'giver' | 'encouragement_gratitude' | null = null;
      switch (eventType) {
        case 'star':
        case 'attraction':
        case 'art':
        case 'gourmet':
          mappedEventType = 'star';
          break;
        case 'trouble':
          mappedEventType = 'trouble';
          break;
        case 'giver':
          mappedEventType = 'giver';
          break;
        case 'encouragement_gratitude':
          mappedEventType = 'encouragement_gratitude';
          break;
      }

      // 該当マスにeventTypeを記録
      if (mappedEventType) {
        setPlayers((prevPlayers) => {
          return prevPlayers.map((p) => {
            if (p.id === currentTurnPlayer.id && p.route_spaces) {
              const updatedRouteSpaces = p.route_spaces.map((space) => {
                if (space.spaceNumber === spaceNumber) {
                  return {
                    ...space,
                    eventType: mappedEventType,
                  };
                }
                return space;
              });

              return {
                ...p,
                route_spaces: updatedRouteSpaces,
              };
            }
            return p;
          });
        });
        console.log(`[イベント記録] ${currentTurnPlayer.player_nickname}のマス${spaceNumber}に${mappedEventType}イベントを記録`);
      }
    }

    // トラブルイベントの場合: 重大性に応じてマス後退
    if (currentEvent.type === 'trouble' && currentTurnPlayer) {
      const trouble = currentEvent.data as Trouble;
      const retreatSpaces = trouble.severity; // severity 1-5 に応じて 1-5マス後退

      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((p) => {
          if (p.id === currentTurnPlayer.id) {
            // 現在のマス位置から後退（0未満にはならない）
            const newSpaceNumber = Math.max(0, p.current_space_number - retreatSpaces);
            console.log(`[トラブル後退] ${p.player_nickname}: マス${p.current_space_number} → マス${newSpaceNumber} (${retreatSpaces}マス後退, 重大度: ${trouble.severity})`);

            return {
              ...p,
              current_space_number: newSpaceNumber,
            };
          }
          return p;
        });

        // currentTurnPlayerも更新
        const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentTurnPlayer.id);
        if (updatedCurrentPlayer) {
          setCurrentTurnPlayer(updatedCurrentPlayer);
          // グローバル状態も更新
          setCurrentSpaceNumber(updatedCurrentPlayer.current_space_number);
        }

        return updatedPlayers;
      });
    }

    // ポイント計算
    let giverPoints = 0;
    if (currentEvent.type === 'giver') {
      giverPoints = selectedGiverPoints;
      setSelectedGiverPoints(0);
    }

    const points = calculateEventPoints(currentEvent, giverPoints);

    // ポイント更新
    if (points.impressed !== 0 || points.giver !== 0) {
      // フリーマンの場合はポイントを倍増
      const isFreeman = currentTurnPlayer?.player_type === 'freeman_d' || currentTurnPlayer?.player_type === 'freeman_s';
      const multiplier = isFreeman ? FREEMAN_POINT_MULTIPLIER : 1.0;
      const adjustedImpressed = Math.floor(points.impressed * multiplier);
      const adjustedGiver = Math.floor(points.giver * multiplier);

      updatePoints(adjustedImpressed, adjustedGiver);

      // Multiplayer: 現在のターンプレイヤーのポイントを更新
      if ((gameSession as any).is_multiplayer && currentTurnPlayer) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = prevPlayers.map((p) =>
            p.id === currentTurnPlayer.id
              ? {
                  ...p,
                  impressed_points: p.impressed_points + adjustedImpressed,
                  giver_points: p.giver_points + adjustedGiver,
                  total_points: p.total_points + adjustedImpressed + adjustedGiver,
                }
              : p
          );

          // currentTurnPlayerも更新
          const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentTurnPlayer.id);
          if (updatedCurrentPlayer) {
            setCurrentTurnPlayer(updatedCurrentPlayer);
          }

          const logSuffix = isFreeman ? ` (フリーマンボーナス: ${multiplier}x)` : '';
          console.log(`${currentTurnPlayer.player_nickname} にポイント追加: +${adjustedImpressed + adjustedGiver}ポイント (感銘: ${adjustedImpressed}, 感謝: ${adjustedGiver})${logSuffix}`);
          return updatedPlayers;
        });
      }
    }

    // 次のイベントへ
    if (currentEventIndex < pendingEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      // すべてのイベント完了
      setPendingEvents([]);
      setCurrentEventIndex(0);

      // ミッション進捗を更新（マルチプレイヤーモードのみ）
      if ((gameSession as any).is_multiplayer && currentTurnPlayer && currentTurnPlayer.missions && currentTurnPlayer.statistics) {
        const missionResult = updateMissionProgress(
          currentTurnPlayer.missions,
          currentTurnPlayer.statistics,
          currentTurnPlayer.total_points
        );

        // ミッション達成時の処理
        if (missionResult.completedMissions.length > 0) {
          console.log(`ミッション達成: ${missionResult.completedMissions.length}個`);

          // プレイヤーにミッション更新、ポイント追加、カード追加
          setPlayers((prevPlayers) => {
            return prevPlayers.map((p) => {
              if (p.id === currentTurnPlayer.id) {
                const updatedPlayer = {
                  ...p,
                  missions: missionResult.missions,
                  total_points: p.total_points + missionResult.rewardPoints,
                  cards: [...(p.cards || []), ...missionResult.rewardCards],
                  statistics: {
                    ...p.statistics,
                    missionsCompleted: (p.statistics?.missionsCompleted || 0) + missionResult.completedMissions.length,
                  } as any,
                };

                // currentTurnPlayerも更新
                setCurrentTurnPlayer(updatedPlayer);

                return updatedPlayer;
              }
              return p;
            });
          });

          // カード報酬がある場合、アニメーション表示
          if (missionResult.rewardCards.length > 0) {
            setObtainedCards(missionResult.rewardCards);
            setShowCardObtained(true);
          }

          // ポイント報酬があれば通知
          if (missionResult.rewardPoints > 0) {
            console.log(`ミッション報酬: +${missionResult.rewardPoints}pt, +${missionResult.rewardCards.length}カード`);
          }
        }
      }

      // 目的地に到達しているかチェック（プレイヤー状態から判定）
      // 重要: currentTurnPlayerではなくplayers配列から最新の状態を取得
      const latestPlayer = players.find(p => p.id === currentTurnPlayer?.id);
      console.log('handleEventClose: 到着チェック', {
        latestPlayer: latestPlayer?.player_nickname,
        current_space_number: latestPlayer?.current_space_number,
        route_length: latestPlayer?.route_spaces?.length,
        destination: destinationAirport?.city,
      });

      if (destinationAirport &&
          latestPlayer &&
          latestPlayer.route_spaces &&
          latestPlayer.current_space_number >= latestPlayer.route_spaces.length) {
        // 到達済み - 移動完了
        const destination = destinationAirport;
        if (destination && currentAirport) {
          // フリーマンの場合は、既に到着処理で visit_history に記録済みなのでスキップ
          const isFreeman = latestPlayer.player_type !== 'human';

          if (!isFreeman) {
            // 人間プレイヤーのみ訪問履歴を記録
            // 目的地番号: 現在の訪問履歴の長さ + 1（次の目的地番号）
            const currentDestinationNumber = (latestPlayer.visit_history?.length || 0) + 1;
            const pointsEarned = latestPlayer.total_points - arrivalStartPoints;
            const visit = {
              destinationNumber: currentDestinationNumber,
              airportId: destination.id,
              airportName: destination.name_ja || destination.name,
              city: destination.city,
              pointsEarned: pointsEarned,
              visitedAt: new Date().toISOString(),
            };

            // プレイヤーの visit_history に追加
            setPlayers((prevPlayers) => {
              return prevPlayers.map((p) =>
                p.id === latestPlayer.id
                  ? {
                      ...p,
                      visit_history: [...(p.visit_history || []), visit],
                    }
                  : p
              );
            });

            console.log(`訪問履歴を記録: ${destination.city} (目的地${currentDestinationNumber}) - ${pointsEarned}pt獲得`);
          } else {
            console.log(`フリーマンの訪問履歴は既に記録済みのためスキップ`);
          }

          const distance = calculateDistance(currentAirport, destination);
          const days = calculateStayDays(distance);
          await performMove(destination, distance, days);

          // マルチプレイヤー: 目的地到着後、次のターンへ切り替え
          if ((gameSession as any).is_multiplayer) {
            console.log('目的地到着完了: 次のプレイヤーのターンへ');
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await switchToNextTurn();
          }
        }
      } else if (destinationAirport &&
                 latestPlayer &&
                 latestPlayer.route_spaces &&
                 latestPlayer.current_space_number < latestPlayer.route_spaces.length) {
        // まだ目的地に到達していない場合
        if ((gameSession as any).is_multiplayer) {
          // マルチプレイヤー: 次のターンへ切り替え
          console.log('イベント完了（未到達）: 次のプレイヤーのターンへ');
          setScreenState('map');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await switchToNextTurn();
        } else {
          // シングルプレイヤー: 移動ルーレットに戻る
          console.log(`Returning to movement roulette. Current: ${latestPlayer?.current_space_number}/${latestPlayer?.route_spaces?.length}`);
          setScreenState('movement_roulette');
        }
      } else {
        // 目的地がない、または予期しない状態
        console.log('イベント完了: マップに戻る');
        setScreenState('map');
      }
    }
  };

  // Giverイベント完了時（選択されたポイントを保存）
  const handleGiverEventClose = (points: number) => {
    setSelectedGiverPoints(points);
    handleEventClose();
  };

  // 到着ポイント内訳表示から続ける
  const handleArrivalBreakdownContinue = () => {
    console.log('到着ポイント内訳「続ける」ボタンがクリックされました');
    console.log('イベントを表示します。イベント数:', pendingEvents.length);
    setShowArrivalBreakdown(false);
    setArrivalBreakdown(null);
    // screenState は既に 'events' なので変更不要
    console.log('モーダルを閉じました。イベントが表示されます。');
  };

  // フリーマンの目的地発表から続ける
  const handleFreemanDestinationContinue = async () => {
    console.log('========================================');
    console.log('🎯 handleFreemanDestinationContinue 呼び出し');
    console.log('フリーマンの目的地発表を閉じて、ルーレットに進みます');
    console.log('========================================');

    setShowFreemanDestination(false);
    setFreemanSelectedDestination(null);
    setFreemanName('');

    // 少し待機してから次の処理へ（状態更新の完了を待つ）
    await new Promise((resolve) => setTimeout(resolve, 300));

    // フリーマンのターンを継続（ルーレットを回す処理に戻る）
    await continueFreemanTurn();
  };

  // ターン切り替え処理（シンプル版）
  const switchToNextTurn = async () => {
    if (!currentTurnPlayer || players.length === 0) {
      console.log('Cannot switch turn: missing data');
      return;
    }

    console.log(`${currentTurnPlayer.player_nickname} のターン終了`);

    // 次のプレイヤーへ切り替え
    const currentIndex = players.findIndex((p) => p.id === currentTurnPlayer.id);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    console.log(`次のターン: ${nextPlayer.player_nickname} (${nextPlayer.player_type})`);

    // ターンプレイヤーを更新
    setCurrentTurnPlayer(nextPlayer);

    // ゲームセッションのターン番号を更新
    const updatedSession = {
      ...gameSession,
      current_turn_order: nextPlayer.player_order,
    } as any;
    setGameSession(updatedSession);

    // フリーマンのターンの場合は自動実行
    if (nextPlayer.player_type !== 'human') {
      console.log(`フリーマンの自動ターン開始: ${nextPlayer.player_nickname}`);
      await executeFreemanTurn(nextPlayer);
    }
  };

  // カード使用ハンドラ
  const handleUseCard = (cardId: string) => {
    if (!currentTurnPlayer) {
      console.error('No current turn player');
      return;
    }

    const card = getCardById(cardId);
    if (!card) {
      console.error('Card not found:', cardId);
      return;
    }

    console.log(`カード使用: ${card.nameJa} (${cardId})`);

    // 攻撃カードの場合は対戦相手を選択する必要がある
    if (card.effect.target === 'opponent') {
      setSelectedCardToUse(cardId);
      setShowCardTargetSelector(true);
    } else {
      // 自分対象のカードはすぐに実行
      executeCardOnPlayer(cardId, null);
    }
  };

  // カードを実際に使用する
  const executeCardOnPlayer = (cardId: string, targetPlayerId: string | null) => {
    if (!currentTurnPlayer) return;

    const card = getCardById(cardId);
    if (!card) return;

    console.log(`カード効果実行: ${card.nameJa}`, targetPlayerId ? `対象: ${targetPlayerId}` : '');

    // executeCardEffect関数を呼び出して効果を適用
    const result = executeCardEffect(
      card.effect,
      currentTurnPlayer.id,
      targetPlayerId,
      players
    );

    // プレイヤー状態を更新
    setPlayers(result.updatedPlayers);

    // カードを使用済みにマーク
    let updatedCurrentPlayer: GamePlayer | null = null;
    setPlayers((prevPlayers) => {
      return prevPlayers.map((p) => {
        if (p.id === currentTurnPlayer.id && p.cards) {
          const updated = {
            ...p,
            cards: p.cards.map((pc) =>
              pc.cardId === cardId && !pc.used
                ? { ...pc, used: true, usedAt: new Date().toISOString() }
                : pc
            ),
          };
          updatedCurrentPlayer = updated;
          return updated;
        }
        return p;
      });
    });

    // currentTurnPlayerも更新
    if (updatedCurrentPlayer) {
      setCurrentTurnPlayer(updatedCurrentPlayer);
    }

    // 効果メッセージを表示
    setCardEffectMessage(result.message);
    setShowCardEffect(true);

    // extra_card 効果の処理
    if (result.needsExtraCards && result.needsExtraCards > 0) {
      const newCards = drawRandomPlayerCards(result.needsExtraCards);
      // プレイヤーにカードを追加
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === currentTurnPlayer.id) {
            return {
              ...p,
              cards: [...(p.cards || []), ...newCards],
            };
          }
          return p;
        });
      });
      // カード獲得アニメーション表示
      setObtainedCards(newCards);
      setShowCardObtained(true);
    }

    // teleport 効果の処理
    if (result.needsTeleport) {
      setNeedsTeleportSelection(true);
    }

    // モーダルを閉じる
    setShowCardTargetSelector(false);
    setSelectedCardToUse(null);

    console.log(`カード効果適用完了: ${result.message}`);
  };

  // カード効果メッセージを閉じる
  const handleCloseCardEffect = () => {
    setShowCardEffect(false);
    setCardEffectMessage('');
  };

  // ターン終了処理
  const handleEndTurn = async () => {
    console.log('=== handleEndTurn called ===');
    console.log('gameSession:', gameSession);
    console.log('currentTurnPlayer:', currentTurnPlayer);
    console.log('players:', players);

    if (!gameSession || !currentTurnPlayer || players.length === 0) {
      console.log('Missing required data, returning');
      return;
    }

    console.log(`${currentTurnPlayer.player_nickname} のターン終了`);

    // 現在のプレイヤーの active_effects の duration を減らす
    setPlayers((prevPlayers) => {
      return prevPlayers.map((p) => {
        if (p.id === currentTurnPlayer.id) {
          return decreaseActiveEffectsDuration(p);
        }
        return p;
      });
    });

    // 次のプレイヤーへ切り替え
    const currentIndex = players.findIndex((p) => p.id === currentTurnPlayer.id);
    const nextIndex = (currentIndex + 1) % players.length;
    let nextPlayer = players[nextIndex];

    // 次のプレイヤーが freeze 状態の場合、スキップ
    if (isFrozen(nextPlayer)) {
      console.log(`${nextPlayer.player_nickname} は凍結状態のためターンをスキップします`);
      // freeze 効果を削除
      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.id === nextPlayer.id) {
            return removeActiveEffect(p, 'freeze');
          }
          return p;
        });
      });
      // 次の次のプレイヤーに進む
      const nextNextIndex = (nextIndex + 1) % players.length;
      nextPlayer = players[nextNextIndex];
    }

    console.log(`次のターン: ${nextPlayer.player_nickname} (${nextPlayer.player_type})`);

    // ターンプレイヤーを更新
    setCurrentTurnPlayer(nextPlayer);

    // ゲームセッションのターン番号を更新
    const updatedSession = {
      ...gameSession,
      current_turn_order: nextPlayer.player_order,
    };
    setGameSession(updatedSession);

    // フリーマンのターンの場合は自動実行
    if (nextPlayer.player_type !== 'human') {
      console.log(`フリーマンの自動ターン開始: ${nextPlayer.player_nickname}`);
      await executeFreemanTurn(nextPlayer);
    }
  };

  // フリーマンのサイコロ完了ハンドラー
  const handleFreemanDiceComplete = async (diceResult: number) => {
    console.log(`========================================`);
    console.log(`🎲 handleFreemanDiceComplete 呼び出し`);
    console.log(`ルーレットの結果: ${diceResult}`);
    console.log(`========================================`);

    // 二重実行防止
    if (freemanDiceProcessing) {
      console.log('フリーマンAI: ルーレット処理中のため、二重実行をスキップ');
      return;
    }

    console.log(`フリーマンAI: ルーレット完了 - ${diceResult}`);
    setFreemanDiceProcessing(true);

    // 即座にルーレット表示を停止
    setFreemanRollingDice(false);

    setFreemanActionMessage(`🎲 ルーレットの結果: ${diceResult}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // フリーマンプレイヤーを取得
    const freemanPlayer = players.find((p) => p.player_type !== 'human');
    console.log(`フリーマンプレイヤー検索結果:`, freemanPlayer ? `ID: ${freemanPlayer.id}, タイプ: ${freemanPlayer.player_type}` : 'null');
    if (!freemanPlayer) {
      console.error(`❌ フリーマンプレイヤーが見つかりません！`);
      setFreemanDiceProcessing(false);
      return;
    }

    console.log(`フリーマンの route_spaces:`, freemanPlayer.route_spaces ? `${freemanPlayer.route_spaces.length}マス` : 'null');
    console.log(`フリーマンの現在位置: ${freemanPlayer.current_space_number}`);

    // マス数を進める
    if (freemanPlayer.route_spaces && freemanPlayer.route_spaces.length > 0) {
      const newSpaceNumber = Math.min(
        freemanPlayer.current_space_number + diceResult,
        freemanPlayer.route_spaces.length
      );

      setFreemanActionMessage(`✈️ ${diceResult}マス進みます (${freemanPlayer.current_space_number} → ${newSpaceNumber})`);

      // フリーマンの位置を更新（ポイントはイベント時に加算）
      const updatedPlayers = players.map((p) =>
        p.id === freemanPlayer.id
          ? {
              ...p,
              current_space_number: newSpaceNumber,
            }
          : p
      );
      setPlayers(updatedPlayers);

      // currentTurnPlayerも更新
      const updatedFreeman = updatedPlayers.find(p => p.id === freemanPlayer.id);
      if (updatedFreeman) {
        setCurrentTurnPlayer(updatedFreeman);
      }

      console.log(`フリーマンAI: ${diceResult}マス進行 → 位置${newSpaceNumber}/${freemanPlayer.route_spaces.length}`);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 目的地到達チェック
      console.log(`========================================`);
      console.log(`🎯 フリーマンAI: 到達チェック`);
      console.log(`現在位置: ${newSpaceNumber}, 総マス数: ${freemanPlayer.route_spaces.length}`);
      console.log(`到達判定: ${newSpaceNumber >= freemanPlayer.route_spaces.length ? '✅ 到達' : '❌ 未到達'}`);
      console.log(`========================================`);

      if (newSpaceNumber >= freemanPlayer.route_spaces.length) {
        console.log(`✅ フリーマンAI: 目的地到達確認！`);
        // フリーマンのroute_spacesの最終地点から到着した空港を特定
        const finalRouteSpace = freemanPlayer.route_spaces[freemanPlayer.route_spaces.length - 1];

        // 最終地点に最も近い空港を見つける（これがフリーマンの到着地）
        const arrivedAirport = airports.reduce((nearest, airport) => {
          const distToCurrent = Math.sqrt(
            Math.pow(airport.latitude - finalRouteSpace.lat, 2) +
            Math.pow(airport.longitude - finalRouteSpace.lng, 2)
          );
          const distToNearest = Math.sqrt(
            Math.pow(nearest.latitude - finalRouteSpace.lat, 2) +
            Math.pow(nearest.longitude - finalRouteSpace.lng, 2)
          );
          return distToCurrent < distToNearest ? airport : nearest;
        }, airports[0]);

        if (arrivedAirport) {
          console.log(`=== フリーマンAI: 目的地到着処理開始 ===`);
          console.log(`フリーマンAI: 到着地 - ${arrivedAirport.name} (${arrivedAirport.city})`);

          // 到着ファンファーレをバックグラウンドで再生（待機しない）
          // フリーマン用の古いファンファーレ（Web Audio API）を使用
          playFanfare(false).catch(fanfareError => {
            console.error(`フリーマンAI: ファンファーレ再生エラー:`, fanfareError);
          });
          console.log(`フリーマンAI: ファンファーレを非同期再生`);

          setFreemanActionMessage(`🎉 ${arrivedAirport.city} に到着しました!`);

          // 到着選択処理
          try {
            console.log(`フリーマンAI: 到着選択処理開始`);
            setFreemanActionMessage('📋 到着体験を選択中...');

            // フリーマンの目的地番号（訪問履歴の長さ + 1）
            const freemanDestinationNumber = (freemanPlayer.visit_history?.length || 0) + 1;

            // 先着者かどうかを判定（目的地番号ごとに判定）
            const currentDestId = arrivedAirport.id;
            const currentSelections = destinationSelections[currentDestId] || { arrivedPlayers: [] };
            const isFirstToArrive = !firstArrivalByDestinationNumber[freemanDestinationNumber];

            if (isFirstToArrive) {
              // 先着者を記録
              setFirstArrivalByDestinationNumber({
                ...firstArrivalByDestinationNumber,
                [freemanDestinationNumber]: freemanPlayer.id,
              });
              console.log(`フリーマンAI: 目的地${freemanDestinationNumber}の先着者`);
            } else {
              console.log(`フリーマンAI: 目的地${freemanDestinationNumber}の後着者（先着者: ${firstArrivalByDestinationNumber[freemanDestinationNumber]}）`);
            }

            console.log(`フリーマンAI到着判定: ${isFirstToArrive ? '先着者' : '後着者'} at ${arrivedAirport.city} (目的地${freemanDestinationNumber})`);

            // 到着オプションを取得（都市レベル）
            const [attractions, arts, gourmets] = await Promise.all([
              getAttractionsByCity(arrivedAirport.city),
              getArtsByCity(arrivedAirport.city),
              getGourmetByCity(arrivedAirport.city),
            ]);

            console.log(`フリーマンAI: 名所${attractions.length}件, アート${arts.length}件, グルメ${gourmets.length}件`);

            // 後続到着者の場合は選択済みアイテムを除外
            let availableAttractions = attractions;
            let availableArts = arts;
            let availableGourmets = gourmets;

            if (!isFirstToArrive) {
              if (currentSelections.selectedAttraction) {
                availableAttractions = attractions.filter(a => a.id !== currentSelections.selectedAttraction);
                console.log(`フリーマンAI: 名所から選択済みを除外: ${availableAttractions.length}/${attractions.length}件`);
              }
              if (currentSelections.selectedArt) {
                availableArts = arts.filter(a => a.id !== currentSelections.selectedArt);
                console.log(`フリーマンAI: アートから選択済みを除外: ${availableArts.length}/${arts.length}件`);
              }
              if (currentSelections.selectedGourmet) {
                availableGourmets = gourmets.filter(g => g.id !== currentSelections.selectedGourmet);
                console.log(`フリーマンAI: グルメから選択済みを除外: ${availableGourmets.length}/${gourmets.length}件`);
              }
            }

            // ランダムに1つずつ選択（フォールバック用の仮データも生成）
            const selectedAttraction = availableAttractions.length > 0
              ? availableAttractions[Math.floor(Math.random() * availableAttractions.length)]
              : {
                  id: 'temp-attraction',
                  name: `${arrivedAirport.city}の名所`,
                  name_ja: `${arrivedAirport.city}の名所`,
                  country: arrivedAirport.country,
                  impressed_points: 50,
                  description: `${arrivedAirport.city}を代表する素晴らしい観光地です。`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as Attraction;

            const selectedArt = availableArts.length > 0
              ? availableArts[Math.floor(Math.random() * availableArts.length)]
              : {
                  id: 'temp-art',
                  name: `${arrivedAirport.city}の芸術作品`,
                  name_ja: `${arrivedAirport.city}の芸術作品`,
                  city: arrivedAirport.city,
                  impressed_points: 50,
                  description: `${arrivedAirport.city}で鑑賞できる美しい芸術作品です。`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as Art;

            const selectedGourmet = availableGourmets.length > 0
              ? availableGourmets[Math.floor(Math.random() * availableGourmets.length)]
              : {
                  id: 'temp-gourmet',
                  name: `${arrivedAirport.city}の郷土料理`,
                  name_ja: `${arrivedAirport.city}の郷土料理`,
                  country: arrivedAirport.country,
                  impressed_points: 50,
                  description: `${arrivedAirport.city}で味わえる美味しい料理です。`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as Gourmet;

            // FreemanAIを使って最適な体験を選択
            console.log(`フリーマンAI: AI選択開始`);
            const freemanAI = new FreemanAI();
            const selectedType = await freemanAI.selectExperience(
              selectedAttraction,
              selectedArt,
              selectedGourmet
            );
            console.log(`フリーマンAI: AI選択完了 - タイプ: ${selectedType}`);

            // 選択された体験を取得
            let selectedExperience: Attraction | Art | Gourmet;
            let selectedId: string;
            let points: number;

            if (selectedType === 'attraction') {
              selectedExperience = selectedAttraction;
              selectedId = selectedAttraction.id;
              // フリーマンはイベントがないため、到着ポイントを倍増
              points = Math.round(selectedAttraction.impressed_points * FREEMAN_POINT_MULTIPLIER);
              console.log(`フリーマンAI: 名所選択 - ${selectedAttraction.name_ja || selectedAttraction.name} (+${points}pt [${FREEMAN_POINT_MULTIPLIER}倍])`);
              setFreemanActionMessage(`✨ ${selectedAttraction.name_ja || selectedAttraction.name} を体験 (+${points}pt)`);
            } else if (selectedType === 'art') {
              selectedExperience = selectedArt;
              selectedId = selectedArt.id;
              // フリーマンはイベントがないため、到着ポイントを倍増
              points = Math.round(selectedArt.impressed_points * FREEMAN_POINT_MULTIPLIER);
              console.log(`フリーマンAI: アート選択 - ${selectedArt.name_ja || selectedArt.name} (+${points}pt [${FREEMAN_POINT_MULTIPLIER}倍])`);
              setFreemanActionMessage(`🎨 ${selectedArt.name_ja || selectedArt.name} を鑑賞 (+${points}pt)`);
            } else {
              selectedExperience = selectedGourmet;
              selectedId = selectedGourmet.id;
              // フリーマンはイベントがないため、到着ポイントを倍増
              points = Math.round(selectedGourmet.impressed_points * FREEMAN_POINT_MULTIPLIER);
              console.log(`フリーマンAI: グルメ選択 - ${selectedGourmet.name_ja || selectedGourmet.name} (+${points}pt [${FREEMAN_POINT_MULTIPLIER}倍])`);
              setFreemanActionMessage(`🍴 ${selectedGourmet.name_ja || selectedGourmet.name} を堪能 (+${points}pt)`);
            }

            // 🤖 AI特有の人助けイベント（60%の確率で発生）
            if (Math.random() < 0.6) {
              const aiHelpEvents = [
                { emoji: '🌍', action: '困っている旅行者を多言語翻訳で助けた', points: 45 },
                { emoji: '🗺️', action: '効率的な観光ルートをデータ分析で提案した', points: 50 },
                { emoji: '📍', action: '現地の穴場情報を収集してシェアした', points: 40 },
                { emoji: '👨‍👩‍👧', action: '迷子の子供を見つけるのを手伝った', points: 60 },
                { emoji: '🏥', action: '緊急医療情報を素早く翻訳して助けた', points: 70 },
                { emoji: '🤝', action: '文化的誤解を解消する通訳をした', points: 50 },
                { emoji: '📱', action: '観光情報をリアルタイムで更新・共有した', points: 40 },
                { emoji: '🧳', action: 'お年寄りの重い荷物を運ぶ手伝いをした', points: 55 },
                { emoji: '🍽️', action: 'アレルギー情報を正確に翻訳して安全を確保した', points: 65 },
                { emoji: '🎭', action: '言葉の壁を超えてチケット購入を手伝った', points: 45 },
                { emoji: '🚕', action: 'タクシー運転手とのコミュニケーションを仲介した', points: 40 },
                { emoji: '📸', action: '観光客に最適な撮影スポットとタイミングを案内した', points: 50 },
              ];

              const selectedEvent = aiHelpEvents[Math.floor(Math.random() * aiHelpEvents.length)];
              points += selectedEvent.points;
              console.log(`フリーマンAI人助けイベント: ${selectedEvent.action} (+${selectedEvent.points}pt)`);

              // メッセージを1.5秒表示してから次のメッセージに移行
              setFreemanActionMessage(`${selectedEvent.emoji} ${selectedEvent.action} (+${selectedEvent.points}pt)`);
              await new Promise(resolve => setTimeout(resolve, 1500));
            }

            console.log(`フリーマンAI選択完了: ${selectedType} - ${selectedExperience.name_ja || selectedExperience.name} (+${points}pt)`);

            // 先着ボーナスポイントを計算（移動距離はroute_spacesから推定）
            let arrivalBonus = 0;
            if (isFirstToArrive) {
              const travelDistanceEstimate = freemanPlayer.route_spaces.length * 500; // 500km/マス
              if (travelDistanceEstimate < 500) {
                arrivalBonus = 100;
              } else if (travelDistanceEstimate < 1000) {
                arrivalBonus = 150;
              } else {
                arrivalBonus = 200;
              }
              console.log(`フリーマンAI先着ボーナス: ${arrivalBonus}pt (推定距離: ${travelDistanceEstimate}km)`);
              points += arrivalBonus; // 選択ポイントに加算
              setFreemanActionMessage(`🎉 先着! +${arrivalBonus}pt ボーナス`);
            }

            // 選択を記録
            const updatedSelections = {
              ...currentSelections,
              arrivedPlayers: [...currentSelections.arrivedPlayers, freemanPlayer.id],
            };

            if (selectedType === 'attraction') {
              updatedSelections.selectedAttraction = selectedId;
            } else if (selectedType === 'art') {
              updatedSelections.selectedArt = selectedId;
            } else if (selectedType === 'gourmet') {
              updatedSelections.selectedGourmet = selectedId;
            }

            setDestinationSelections({
              ...destinationSelections,
              [currentDestId]: updatedSelections,
            });

            console.log(`フリーマンAI選択記録: ${selectedType} = ${selectedId} (到着者数: ${updatedSelections.arrivedPlayers.length})`);

            // 経過日数の更新（フリーマンも滞在日数をカウント）
            const startingAirport = airports.find(a => a.id === freemanPlayer.current_airport_id);
            if (startingAirport) {
              const distance = calculateDistance(startingAirport, arrivedAirport);
              const stayDays = calculateStayDays(distance);
              console.log(`フリーマンAI経過日数更新: ${distance.toFixed(0)}km → ${stayDays}日滞在`);
              updateElapsedDays(stayDays);
            }

            // 先行プレイヤーが既に新しい目的地を選択したかチェック
            const humanPlayer = updatedPlayers.find((p) => p.player_type === 'human');
            let newRouteForFreeman: Array<{ lat: number; lng: number; spaceNumber: number }> | null = null;

            // 人間プレイヤーが到着済みで、かつフリーマンと異なる目的地に向かっている場合のみ追跡
            const humanHasArrived = humanPlayer &&
              humanPlayer.route_spaces &&
              humanPlayer.route_spaces.length > 0 &&
              humanPlayer.current_space_number >= humanPlayer.route_spaces.length;

            if (humanHasArrived && humanPlayer.route_spaces) {
              // 人間プレイヤーが到着済みで新しい目的地を選択している
              const humanDestination = humanPlayer.route_spaces[humanPlayer.route_spaces.length - 1];

              // フリーマンの到着地から人間プレイヤーの目的地への経路を計算
              const freemanStartAirport = arrivedAirport;

              if (freemanStartAirport) {
                // 人間プレイヤーの目的地座標から最も近い空港を見つける
                const targetAirport = airports.reduce((nearest, airport) => {
                  const distToCurrent = Math.sqrt(
                    Math.pow(airport.latitude - humanDestination.lat, 2) +
                    Math.pow(airport.longitude - humanDestination.lng, 2)
                  );
                  const distToNearest = Math.sqrt(
                    Math.pow(nearest.latitude - humanDestination.lat, 2) +
                    Math.pow(nearest.longitude - humanDestination.lng, 2)
                  );
                  return distToCurrent < distToNearest ? airport : nearest;
                }, airports[0]);

                if (targetAirport && targetAirport.id !== arrivedAirport.id) {
                  // フリーマンの到着地から人間プレイヤーの目的地への経路を計算
                  newRouteForFreeman = calculateRouteSpaces(freemanStartAirport, targetAirport, 500);
                  console.log(`フリーマンAI: 先行プレイヤーを追跡 ${arrivedAirport.city} → ${targetAirport.city} (${newRouteForFreeman.length}マス)`);
                  setFreemanActionMessage(`🎯 次の目的地: ${targetAirport.city} を追跡中`);
                } else {
                  console.log(`フリーマンAI: 人間プレイヤーと同じ目的地のため、待機`);
                }
              }
            } else {
              console.log(`フリーマンAI: 人間プレイヤーが未到着のため、次の目的地選択を待機`);
            }

            // ポイント加算と到着処理: 現在地を更新、必要に応じて新しいルートを設定
            // visit_historyを更新するための訪問記録を作成
            // freemanDestinationNumber は既に定義済み（line 1581）
            const freemanVisit = {
              destinationNumber: freemanDestinationNumber,
              airportId: arrivedAirport.id,
              airportName: arrivedAirport.name_ja || arrivedAirport.name,
              city: arrivedAirport.city,
              pointsEarned: points,
              visitedAt: new Date().toISOString(),
            };

            setPlayers((prevPlayers) => {
              const finalPlayers = prevPlayers.map((p) =>
                p.id === freemanPlayer.id
                  ? {
                      ...p,
                      current_airport_id: arrivedAirport.id,
                      route_spaces: newRouteForFreeman,
                      current_space_number: 0,
                      impressed_points: p.impressed_points + (points - arrivalBonus), // 体験ポイントのみ
                      arrival_points: (p.arrival_points || 0) + arrivalBonus, // 到着ボーナスを記録
                      total_points: p.total_points + points,
                      visit_history: [...(p.visit_history || []), freemanVisit],
                    }
                  : p
              );

              // currentTurnPlayerも更新
              const updatedFreemanPlayer = finalPlayers.find(p => p.id === freemanPlayer.id);
              if (updatedFreemanPlayer) {
                setCurrentTurnPlayer(updatedFreemanPlayer);
              }
              return finalPlayers;
            });

            console.log(`フリーマンAI訪問履歴を記録: ${arrivedAirport.city} (目的地${freemanDestinationNumber}) - ${points}pt獲得`);

            // 選択した体験をイベントとして作成
            const selectedExperienceEvent: GameEvent = {
              type: selectedType,
              data: selectedExperience,
            };

            // その他の到着イベントを生成（フリーマンにもイベントを発生させる）
            console.log('フリーマンAI: 到着イベントを生成中...');
            const otherArrivalEvents = await generateArrivalEvents();
            console.log(`フリーマンAI: 到着イベント生成完了 (${otherArrivalEvents.length}件)`);

            // 選択したイベントを最初に、その後に他のイベントを追加
            const allEvents = [selectedExperienceEvent, ...otherArrivalEvents];
            setPendingEvents(allEvents);
            setCurrentEventIndex(0);

            // イベント画面に遷移
            setScreenState('events');

            // 到着ポイント内訳を設定
            // 注意: experiencePoints は既に調整後のポイント（points から arrivalBonus を引いた値）
            const experiencePointsAdjusted = points - arrivalBonus;

            const breakdown = {
              arrivalBonus: arrivalBonus,
              isFirstToArrive: isFirstToArrive,
              attractionPoints: selectedType === 'attraction' ? experiencePointsAdjusted : undefined,
              artPoints: selectedType === 'art' ? experiencePointsAdjusted : undefined,
              gourmetPoints: selectedType === 'gourmet' ? experiencePointsAdjusted : undefined,
              attractionName: selectedType === 'attraction' ? (selectedAttraction.name_ja || selectedAttraction.name) : undefined,
              artName: selectedType === 'art' ? (selectedArt.name_ja || selectedArt.name) : undefined,
              gourmetName: selectedType === 'gourmet' ? (selectedGourmet.name_ja || selectedGourmet.name) : undefined,
              playerName: freemanPlayer.player_nickname,
              destinationNumber: freemanDestinationNumber,
            };

            console.log('フリーマンAI: 到着ポイント内訳を設定:', breakdown);
            setArrivalBreakdown(breakdown);

            // 少し遅延してモーダルを表示
            await new Promise((resolve) => setTimeout(resolve, 100));
            setShowArrivalBreakdown(true);
            console.log('フリーマンAI: 到着ポイント内訳モーダルを表示（イベント数: ' + allEvents.length + '件）');
          } catch (err) {
            console.error('========================================');
            console.error('❌ フリーマンAI到着選択エラー:', err);
            console.error('エラー詳細:', err instanceof Error ? err.message : String(err));
            console.error('スタックトレース:', err instanceof Error ? err.stack : 'なし');
            console.error('========================================');

            // エラー時も先行プレイヤーが到着済みなら追跡
            const humanPlayer = updatedPlayers.find((p) => p.player_type === 'human');
            let newRouteForFreeman: Array<{ lat: number; lng: number; spaceNumber: number }> | null = null;

            const humanHasArrivedError = humanPlayer &&
              humanPlayer.route_spaces &&
              humanPlayer.route_spaces.length > 0 &&
              humanPlayer.current_space_number >= humanPlayer.route_spaces.length;

            if (humanHasArrivedError && humanPlayer.route_spaces) {
              const humanDestination = humanPlayer.route_spaces[humanPlayer.route_spaces.length - 1];
              const freemanStartAirport = arrivedAirport;

              if (freemanStartAirport) {
                const targetAirport = airports.reduce((nearest, airport) => {
                  const distToCurrent = Math.sqrt(
                    Math.pow(airport.latitude - humanDestination.lat, 2) +
                    Math.pow(airport.longitude - humanDestination.lng, 2)
                  );
                  const distToNearest = Math.sqrt(
                    Math.pow(nearest.latitude - humanDestination.lat, 2) +
                    Math.pow(nearest.longitude - humanDestination.lng, 2)
                  );
                  return distToCurrent < distToNearest ? airport : nearest;
                }, airports[0]);

                if (targetAirport && targetAirport.id !== arrivedAirport.id) {
                  newRouteForFreeman = calculateRouteSpaces(freemanStartAirport, targetAirport, 500);
                  console.log(`フリーマンAI(エラー時): 先行プレイヤーを追跡 ${arrivedAirport.city} → ${targetAirport.city}`);
                } else {
                  console.log(`フリーマンAI(エラー時): 人間プレイヤーと同じ目的地のため、待機`);
                }
              }
            } else {
              console.log(`フリーマンAI(エラー時): 人間プレイヤーが未到着のため、次の目的地選択を待機`);
            }

            // 経過日数の更新（エラー時も到着は到着なので滞在日数をカウント）
            const startingAirportError = airports.find(a => a.id === freemanPlayer.current_airport_id);
            if (startingAirportError) {
              const distance = calculateDistance(startingAirportError, arrivedAirport);
              const stayDays = calculateStayDays(distance);
              console.log(`フリーマンAI経過日数更新(エラー時): ${distance.toFixed(0)}km → ${stayDays}日滞在`);
              updateElapsedDays(stayDays);
            }

            // エラー時も位置は更新し、必要に応じて新しいルートを設定
            setPlayers((prevPlayers) => {
              const finalPlayers = prevPlayers.map((p) =>
                p.id === freemanPlayer.id
                  ? {
                      ...p,
                      current_airport_id: arrivedAirport.id,
                      route_spaces: newRouteForFreeman,
                      current_space_number: 0,
                    }
                  : p
              );

              // currentTurnPlayerも更新
              const updatedFreemanPlayer = finalPlayers.find(p => p.id === freemanPlayer.id);
              if (updatedFreemanPlayer) {
                setCurrentTurnPlayer(updatedFreemanPlayer);
              }
              return finalPlayers;
            });
          }
        }
      } else {
        console.log(`ℹ️ フリーマンAI: まだ目的地に到達していません (${newSpaceNumber}/${freemanPlayer.route_spaces.length}マス)`);
      }
    } else {
      console.error(`❌ フリーマンAI: route_spacesが無効です - route_spaces:`, freemanPlayer.route_spaces);
    }

    // 自動的に人間プレイヤーのターンへ戻る
    setFreemanActionMessage('✅ フリーマンのターンが完了しました');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 人間プレイヤーを見つけて設定
    const humanPlayer = players.find((p) => p.player_type === 'human');
    if (humanPlayer) {
      console.log('人間プレイヤーのターンに戻ります:', humanPlayer.player_nickname);
      setFreemanActionMessage('');
      setCurrentTurnPlayer(humanPlayer);

      // ゲームセッションのターン番号を更新
      const updatedSession = {
        ...gameSession,
        current_turn_order: humanPlayer.player_order,
      } as any;
      setGameSession(updatedSession);
    }

    // 処理完了フラグをリセット
    setFreemanDiceProcessing(false);
  };

  // フリーマンの自動ターン実行
  const executeFreemanTurn = async (freemanPlayer: any) => {
    const freemanAI = new FreemanAI();

    // 状態をリセット
    setFreemanRollingDice(false);
    setFreemanDiceProcessing(false);
    setFreemanActionMessage('');
    setScreenState('map'); // 画面をマップに戻す

    // 少し待機（演出）
    setFreemanActionMessage('🤖 フリーマンが行動を準備しています...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // フリーマンの現在地を取得
    const freemanCurrentAirport = airports.find((a) => a.id === freemanPlayer.current_airport_id) || currentAirport;

    // 目的地が未設定、またはフリーマンがルートを持っていない場合は選択
    const needsNewRoute = !destinationAirport ||
                          freemanPlayer.route_spaces === null ||
                          freemanPlayer.current_space_number >= (freemanPlayer.route_spaces?.length || 0);

    if (needsNewRoute) {
      console.log('フリーマンAI: 目的地を選択中...');
      setFreemanActionMessage('🎯 フリーマンが目的地を選んでいます...');

      // 現在地がない場合はスキップ
      if (!freemanCurrentAirport && !currentAirport) {
        console.error('現在地が不明です');
        return;
      }

      // 占有都市マップを作成
      const occupiedCitiesMap = new Map<string, { playerId: string; level: number }>();
      players.forEach(p => {
        const occupied = p.occupied_cities || [];
        occupied.forEach((cityId: string) => {
          occupiedCitiesMap.set(cityId, { playerId: p.id, level: 1 });
        });
      });

      // 3つのランダムグループを生成
      const groups = generateRandomGroups(
        airports,
        freemanCurrentAirport?.id || currentAirport!.id,
        visitedAirportIds,
        players,
        freemanPlayer?.id || '',
        occupiedCitiesMap
      );

      // フリーマンが最も空港数が多いグループを選択
      const selectedColor = freemanAI.selectGroup(groups);
      const selectedGroup = groups.find(g => g.color === selectedColor);

      if (selectedGroup && selectedGroup.airports.length > 0) {
        // 選択したグループからランダムに目的地を選択
        const destination = await freemanAI.selectDestination(
          freemanPlayer,
          selectedGroup.airports,
          visitedAirportIds
        );

        // フリーマンの訪問履歴から目的地番号を判定
        const visitedCount = freemanPlayer.visit_history?.length || 0;
        const isSharedDestination = visitedCount === 0; // 目的地1のみ共通

        const groupInfo = selectedGroup.emoji + ' ' + selectedGroup.colorName;
        if (isSharedDestination) {
          console.log(`フリーマンAI: ${groupInfo}グループから共通目的地を選択 - ${destination.name}`);
        } else {
          console.log(`フリーマンAI: ${groupInfo}グループから個別目的地を選択 - ${destination.name}`);
        }

        // フリーマンの目的地選択を発表
        setFreemanSelectedDestination(destination);
        setFreemanName(freemanPlayer.player_nickname);
        setShowFreemanDestination(true);

        // 目的地を設定
        setDestinationAirport(destination);

        // 新しい目的地の選択済みリストを初期化（目的地1のみ）
        if (isSharedDestination) {
          setDestinationSelections({
            ...destinationSelections,
            [destination.id]: { arrivedPlayers: [] },
          });
          console.log(`新しい目的地の選択リストを初期化: ${destination.city}`);
        }

        // ルートを計算
        setPlayers((prevPlayers: any[]) => {
          const updatedPlayers = prevPlayers.map((p: any) => {
            // 目的地1の場合: 全プレイヤーにルートを設定
            if (isSharedDestination) {
              // ルートがnullまたは到達済みの場合のみ新しいルートを設定
              if (p.route_spaces === null || p.current_space_number >= (p.route_spaces?.length || 0)) {
                // 各プレイヤーの現在地を取得
                const playerCurrentAirport = airports.find(a => a.id === p.current_airport_id);
                if (playerCurrentAirport) {
                  // プレイヤーの現在地から新しい目的地へのルートを計算
                  const playerSpaces = calculateRouteSpaces(playerCurrentAirport, destination);
                  console.log(`[共通] ${p.player_nickname}: ${playerCurrentAirport.city} → ${destination.city} (${playerSpaces.length}マス)`);
                  return {
                    ...p,
                    destination_airport_id: destination.id,
                    route_spaces: playerSpaces,
                    current_space_number: 0,
                  };
                }
              }
            } else {
              // 目的地2以降の場合: フリーマンのみにルートを設定
              if (p.id === freemanPlayer.id) {
                const playerCurrentAirport = airports.find(a => a.id === p.current_airport_id);
                if (playerCurrentAirport) {
                  const playerSpaces = calculateRouteSpaces(playerCurrentAirport, destination);
                  console.log(`[個別] ${p.player_nickname}: ${playerCurrentAirport.city} → ${destination.city} (${playerSpaces.length}マス)`);
                  return {
                    ...p,
                    destination_airport_id: destination.id,
                    route_spaces: playerSpaces,
                    current_space_number: 0,
                  };
                }
              }
            }
            return p;
          });
          freemanPlayer = updatedPlayers.find((p: any) => p.id === freemanPlayer.id) || freemanPlayer;
          return updatedPlayers;
        });

        // 発表画面を2秒表示してから自動的に閉じる
        console.log('フリーマンAI: 目的地発表画面を2秒表示します...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('フリーマンAI: 目的地発表画面を自動的に閉じます');
        setShowFreemanDestination(false);
        setFreemanSelectedDestination(null);
        setFreemanName('');

        // 少し待機してから次の処理へ
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // 目的地が既に設定されている場合、またはフリーマンがルートを持っている場合はルーレットを回す
    // ルーレットを回すアニメーションを開始
    setFreemanActionMessage('🎲 ルーレットを回します...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ルーレット表示
    console.log('フリーマンAI: ルーレット表示開始');
    setFreemanRollingDice(true);
  };

  // フリーマンのルーレットを回す処理（目的地発表後に呼ばれる）
  const continueFreemanTurn = async () => {
    console.log('========================================');
    console.log('🎲 continueFreemanTurn 呼び出し');
    console.log('現在のターンプレイヤー:', currentTurnPlayer?.player_nickname, currentTurnPlayer?.player_type);
    console.log('フリーマンのルート:', currentTurnPlayer?.route_spaces?.length, 'マス');
    console.log('========================================');

    // ルーレットを回すアニメーションを開始
    setFreemanActionMessage('🎲 ルーレットを回します...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ルーレット表示
    console.log('フリーマンAI: ルーレット表示開始 (setFreemanRollingDice(true))');
    setFreemanRollingDice(true);

    console.log('フリーマンAI: ルーレット表示フラグを設定完了');
  };

  // ターン情報のデバッグログ
  useEffect(() => {
    if (gameSession && (gameSession as any).is_multiplayer) {
      console.log('=== Turn Debug Info ===');
      console.log('Current turn player:', currentTurnPlayer?.player_nickname, currentTurnPlayer?.player_type);
      console.log('Screen state:', screenState);
      console.log('Players count:', players.length);
      console.log('Should show turn button:', screenState === 'map' && currentTurnPlayer?.player_type === 'human');
    }
  }, [gameSession, currentTurnPlayer, screenState, players]);

  // ゲーム終了チェック（いずれかのプレイヤーが最終目的地に到達したら終了）
  useEffect(() => {
    if (maxDestinations <= 0 || players.length === 0) return;

    // 各プレイヤーの訪問履歴をチェック
    for (const player of players) {
      const visitedCount = player.visit_history?.length || 0;
      if (visitedCount >= maxDestinations) {
        console.log(`🎉 ${player.player_nickname} が${maxDestinations}か所の目的地を訪問完了！ゲーム終了`);
        setGameState('completed');
        break;
      }
    }
  }, [players, maxDestinations]);

  // BGM管理 - 画面状態に応じてBGMを切り替え
  useEffect(() => {
    // ゲーム終了時はエンディングBGMを再生
    if (gameState === 'completed') {
      console.log('[BGM] Playing ending BGM');
      playBGM('ending');
      return;
    }

    if (gameState !== 'playing') {
      stopBGM();
      return;
    }

    // イベント画面の場合は、イベントタイプに応じたBGMを再生
    if (screenState === 'events' && pendingEvents.length > 0 && currentEventIndex < pendingEvents.length) {
      const currentEvent = pendingEvents[currentEventIndex];
      if (currentEvent) {
        const bgmType = EVENT_BGM_MAP[currentEvent.type] || 'calm';
        console.log(`[BGM] Playing event BGM: ${bgmType} for event type: ${currentEvent.type}`);
        playBGM(bgmType);
      }
    } else {
      // その他の画面状態に応じたBGMを再生
      const bgmType = SCREEN_BGM_MAP[screenState] || 'none';
      if (bgmType === 'none') {
        stopBGM();
      } else {
        playBGM(bgmType);
      }
    }
  }, [screenState, gameState, pendingEvents, currentEventIndex, playBGM, stopBGM]);

  if (gameState === 'setup') {
    return <GameSetup airports={airports} onStart={handleStartGame} />;
  }

  // オンラインマルチプレイヤーフロー
  if (gameState === 'online_multiplayer') {
    return (
      <MultiplayerFlow
        airports={airports}
        onGameStart={(settings) => {
          // オンラインマルチプレイヤーゲームを開始
          handleStartGame(
            settings.destinationCount,
            settings.destinationLabel,
            settings.startingAirportId,
            undefined,
            true,
            false,
            false // これは通常のゲーム開始として処理
          );
        }}
        onBack={() => setGameState('setup')}
      />
    );
  }

  if (!gameSession || !currentAirport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (gameState === 'completed') {
    // プレイヤーを順位順にソート
    const sortedPlayers = [...players].sort((a, b) => b.total_points - a.total_points);

    return (
      <div className="mobile-container py-6 space-y-6">
        {/* タイトル */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎉 素敵な旅でした！ 🎉</h1>
          <p className="text-lg text-gray-600">全{maxDestinations}箇所の目的地を巡りました</p>
        </div>

        {/* 最終順位 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">最終順位</h2>

          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}位`;

            return (
              <div
                key={player.id}
                className={`
                  p-6 rounded-xl shadow-lg border-4
                  ${rank === 1 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400' :
                    rank === 2 ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400' :
                    rank === 3 ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400' :
                    'bg-white border-gray-300'}
                `}
              >
                <div className="space-y-4">
                  {/* プレイヤー名と順位 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{rankBadge}</div>
                      <div>
                        <h3 className="text-2xl font-bold">{player.player_nickname}</h3>
                        <p className="text-sm text-gray-600">
                          {player.player_type === 'human' ? '人間プレイヤー' : 'AIプレイヤー（フリーマン）'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {player.total_points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">総合ポイント</div>
                    </div>
                  </div>

                  {/* ポイント内訳 */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-white/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">✈️ 到着</div>
                      <div className="text-lg font-bold text-blue-600">
                        {(player.arrival_points || 0).toLocaleString()}pt
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">✨ 感動</div>
                      <div className="text-lg font-bold text-purple-600">
                        {Math.max(0, player.impressed_points - (player.arrival_points || 0)).toLocaleString()}pt
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">🎁 喜び</div>
                      <div className="text-lg font-bold text-green-600">
                        {player.giver_points.toLocaleString()}pt
                      </div>
                    </div>
                  </div>

                  {/* 訪問履歴 */}
                  {player.visit_history && player.visit_history.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-700">📍 訪問した目的地</h4>
                      <div className="flex flex-wrap gap-2">
                        {player.visit_history.map((visit, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg max-w-full"
                          >
                            <span className="font-bold text-blue-600 text-sm whitespace-nowrap">目的地{visit.destinationNumber}</span>
                            <span className="text-gray-700 text-sm break-words">{visit.city}</span>
                            <span className="font-bold text-green-600 text-sm whitespace-nowrap">+{visit.pointsEarned}pt</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 新しい旅を始めるボタン */}
        <div className="text-center pt-4">
          <Button
            onClick={() => {
              setGameState('setup');
              setGameSession(null);
              setCurrentAirport(null);
              setPlayers([]);
              setCurrentTurnPlayer(null);
              setVisitedAirportIds([]);
            }}
            className="text-xl font-bold py-6 px-8"
            size="lg"
          >
            新しい旅を始める
          </Button>
        </div>
      </div>
    );
  }

  // 現在のイベントを取得
  const currentEvent = pendingEvents[currentEventIndex];

  return (
    <div className="game-screen safe-area h-screen overflow-hidden">
      <ResizablePanels
        initialTopHeight={30}
        minTopHeight={20}
        maxTopHeight={50}
        topPanel={
          <>
            {/* ヘッダー: ポイントと進行状況 */}
            <div className="p-2 bg-white dark:bg-gray-900 shadow-md">
        <div className="mobile-container">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <PointsDisplay
                  impressedPoints={currentTurnPlayer?.impressed_points || gameSession.impressed_points}
                  giverPoints={currentTurnPlayer?.giver_points || gameSession.giver_points}
                  compact={true}
                />
              </div>
              <Button
                onClick={() => setShowGameMenu(true)}
                variant="outline"
                size="sm"
                className="ml-3"
              >
                ⋮ メニュー
              </Button>
            </div>
            <GameProgress
              currentDestinations={visitedAirportIds.length - 1}
              maxDestinations={maxDestinations}
              destinationLabel={destinationLabel}
              currentLocation={currentAirport.name_ja || currentAirport.name}
            />
          </div>
        </div>
      </div>

            {/* 複数プレイヤーUI */}
            {(gameSession as any).is_multiplayer && players.length > 0 && currentTurnPlayer && (
              <div className="p-2 space-y-2">
                <TurnIndicator
                  currentTurnPlayer={currentTurnPlayer}
                  isHumanTurn={currentTurnPlayer.player_type === 'human'}
                />
                <PlayerList
                  players={players}
                  currentTurnPlayer={currentTurnPlayer}
                  airports={airports}
                  destinationAirport={destinationAirport}
                />
              </div>
            )}
          </>
        }
        bottomPanel={
          <>
      {/* メインコンテンツ */}
      <div className="h-full overflow-y-auto p-2">
        <div className="mobile-container">
          <div className="flex flex-col gap-2">
            {/* 世界地図 - 目的地選択中・到着選択中・イベント表示中・ルーレット表示中・ポイント内訳表示中は非表示 */}
            {screenState !== 'destination_roulette' && screenState !== 'arrival_selection' && screenState !== 'events' && screenState !== 'destination_intro' && screenState !== 'movement_roulette' && !freemanRollingDice && !showArrivalBreakdown && (
              <ResizableMapContainer initialHeight={400} minHeight={200} maxHeight={600}>
                <WorldMap
                  currentAirport={currentAirport}
                  destinationAirport={destinationAirport || undefined}
                  showRoute={!!destinationAirport}
                  playerNickname={gameSession.player_nickname || 'プレイヤー1'}
                  playerColor={gameSession.player_color || 'red'}
                  routeSpaces={currentTurnPlayer?.route_spaces || []}
                  currentSpace={currentTurnPlayer?.current_space_number || 0}
                  players={players}
                  currentPlayer={currentTurnPlayer || undefined}
                  airports={airports}
                  destinationNumber={visitedAirportIds.length}
                />
              </ResizableMapContainer>
            )}

            {/* 画面状態に応じた表示 */}
            {screenState === 'map' && (
              <div className="flex flex-col gap-3">
                {/* 人間プレイヤーのターンの場合 */}
                {currentTurnPlayer && currentTurnPlayer.player_type === 'human' && (
                  <>
                    {/* 目的地未設定または到達済みの場合のみボタンを表示 */}
                    {/* 目的地1のみ先着者が選択、目的地2以降は各自が選択 */}
                    {(() => {
                      // 目的地未設定の場合は常に選択可能
                      if (!currentTurnPlayer.route_spaces || currentTurnPlayer.route_spaces.length === 0) {
                        return true;
                      }

                      // 目的地到達済みの場合
                      if (currentTurnPlayer.current_space_number >= currentTurnPlayer.route_spaces.length) {
                        const visitedCount = currentTurnPlayer.visit_history?.length || 0;

                        // 目的地1（訪問履歴0）の場合は先着者のみが選択可能
                        if (visitedCount === 0) {
                          // プレイヤーのroute_spacesから実際の目的地を特定
                          const finalRouteSpace = currentTurnPlayer.route_spaces[currentTurnPlayer.route_spaces.length - 1];
                          const playerDestination = airports.reduce((nearest, airport) => {
                            const distToCurrent = Math.sqrt(
                              Math.pow(airport.latitude - finalRouteSpace.lat, 2) +
                              Math.pow(airport.longitude - finalRouteSpace.lng, 2)
                            );
                            const distToNearest = Math.sqrt(
                              Math.pow(nearest.latitude - finalRouteSpace.lat, 2) +
                              Math.pow(nearest.longitude - finalRouteSpace.lng, 2)
                            );
                            return distToCurrent < distToNearest ? airport : nearest;
                          }, airports[0]);

                          // プレイヤーの実際の目的地の選択状況を確認
                          const currentDestSelections = destinationSelections[playerDestination.id];
                          if (!currentDestSelections || !currentDestSelections.arrivedPlayers || currentDestSelections.arrivedPlayers.length === 0) {
                            // 選択状況がまだ記録されていない場合（到着処理前）は表示しない
                            return false;
                          }

                          // 先着者（arrivedPlayersの最初）のみが次の目的地を選択可能
                          const isFirstToArrive = currentDestSelections.arrivedPlayers[0] === currentTurnPlayer.id;
                          console.log(`[目的地1選択] プレイヤー: ${currentTurnPlayer.player_nickname}, 目的地: ${playerDestination.city}, 先着者: ${isFirstToArrive}`);
                          return isFirstToArrive;
                        }

                        // 目的地2以降（訪問履歴1以上）の場合は到着済みなら誰でも選択可能
                        console.log(`[目的地${visitedCount + 1}選択] プレイヤー: ${currentTurnPlayer.player_nickname} - 到着済みのため選択可能`);
                        return true;
                      }

                      return false;
                    })() && (
                      <>
                        <Button
                          onClick={handleStartDestinationSelection}
                          size="lg"
                          className="touch-target text-xl font-bold py-6 bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          ✈️ 次の目的地へ
                        </Button>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          3つの候補から次の目的地を選択してください
                        </p>
                      </>
                    )}
                    {/* 移動中の場合は移動ルーレットへ遷移 */}
                    {destinationAirport &&
                      currentTurnPlayer.current_space_number < (currentTurnPlayer.route_spaces?.length || 0) && (
                      <>
                        <Button
                          onClick={() => {
                            // プレイヤーの状態から画面状態を復元
                            const destination = destinationAirport;
                            if (destination && currentTurnPlayer.route_spaces) {
                              setDestinationAirport(destination);
                              setRouteSpaces(currentTurnPlayer.route_spaces);
                              setCurrentSpaceNumber(currentTurnPlayer.current_space_number);
                              setScreenState('movement_roulette');
                            }
                          }}
                          size="lg"
                          className="touch-target text-xl font-bold py-6 bg-gradient-to-r from-orange-500 to-red-600"
                        >
                          🎲 移動を続ける
                        </Button>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-2">
                            📍 移動中: {currentTurnPlayer.current_space_number} / {currentTurnPlayer.route_spaces?.length || 0} マス
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            目的地{(currentTurnPlayer.visit_history?.length || 0) + 1} {destinationAirport?.city || '不明'}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
                {/* フリーマンのターンの場合は自動実行中メッセージ */}
                {currentTurnPlayer && currentTurnPlayer.player_type !== 'human' && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      🤖 {currentTurnPlayer.player_nickname}のターン
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      自動実行中...
                    </p>
                  </div>
                )}
              </div>
            )}

            {screenState === 'destination_roulette' && (() => {
              // Phase 1: グループ選択
              if (groupSelectionMode && airportGroups.length === 3) {
                return (
                  <GroupSelector
                    groups={airportGroups}
                    playerName={currentTurnPlayer?.player_nickname || 'プレイヤー'}
                    isCurrentPlayer={true}
                    onGroupSelected={handleGroupSelected}
                  />
                );
              }

              // Phase 2: 選択したグループのルーレット
              if (selectedGroupColor && airportGroups.length === 3) {
                const selectedGroup = airportGroups.find(g => g.color === selectedGroupColor);
                if (selectedGroup && selectedGroup.airports.length > 0) {
                  return (
                    <DestinationRoulette
                      availableAirports={selectedGroup.airports}
                      selectedGroupColor={selectedGroupColor}
                      onDestinationSelected={handleDestinationSelected}
                      destinationNumber={visitedAirportIds.length + 1}
                    />
                  );
                }
              }

              // Fallback: グループが生成されていない場合
              return null;
            })()}

            {screenState === 'movement_roulette' && currentTurnPlayer && (
              <div className="flex flex-col gap-3">
                {/* 残りマスが13以上の場合、ルーレット選択UI表示 */}
                {((currentTurnPlayer.route_spaces?.length || 0) - currentTurnPlayer.current_space_number) >= 13 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-700">
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3 text-center">
                      ✨ ルーレット選択
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDiceType(6)}
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                          selectedDiceType === 6
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        <div className="text-lg">🎲</div>
                        <div className="text-xs">通常</div>
                        <div className="text-sm">1～6</div>
                      </button>
                      <button
                        onClick={() => setSelectedDiceType(12)}
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                          selectedDiceType === 12
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400'
                        }`}
                      >
                        <div className="text-lg">🎰</div>
                        <div className="text-xs">中長距離</div>
                        <div className="text-sm">1～12</div>
                      </button>
                    </div>
                  </div>
                )}

                <Dice3D
                  key={`dice-${currentTurnPlayer.current_space_number}-${selectedDiceType}`}
                  onRollComplete={handleMovementRouletteComplete}
                  disabled={false}
                  maxNumber={selectedDiceType}
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
                    現在位置: {currentTurnPlayer.current_space_number} / {currentTurnPlayer.route_spaces?.length || 0} マス
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    目的地まで残り {(currentTurnPlayer.route_spaces?.length || 0) - currentTurnPlayer.current_space_number} マス
                  </p>
                </div>
              </div>
            )}

            {/* フリーマンのルーレット */}
            {freemanRollingDice && currentTurnPlayer?.player_type !== 'human' && currentTurnPlayer && (
              <div className="flex flex-col gap-2">
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-center">
                  <p className="text-xs font-semibold">
                    🤖 ルーレット回転中...
                    {((currentTurnPlayer.route_spaces?.length || 0) - currentTurnPlayer.current_space_number) >= 13 && ' (中長距離モード 1-12)'}
                  </p>
                </div>
                <Dice3D
                  key={`freeman-dice-${currentTurnPlayer.id}-${Date.now()}`}
                  onRollComplete={handleFreemanDiceComplete}
                  disabled={false}
                  autoPlay={true}
                  maxNumber={((currentTurnPlayer.route_spaces?.length || 0) - currentTurnPlayer.current_space_number) >= 13 ? 12 : 6}
                />
              </div>
            )}
          </div>
        </div>
      </div>
          </>
        }
      />

      {/* 目的地紹介画面 */}
      {screenState === 'destination_intro' && destinationAirport && (
        <DestinationIntro
          airport={destinationAirport}
          distance={travelDistance}
          stayDays={stayDays}
          destinationNumber={visitedAirportIds.length}
          onContinue={handleDepartToDestination}
        />
      )}

      {/* 到着選択画面 */}
      {screenState === 'arrival_selection' && destinationAirport && (
        <ArrivalSelection
          cityName={destinationAirport.city}
          countryName={destinationAirport.country}
          attraction={arrivalAttraction}
          art={arrivalArt}
          gourmet={arrivalGourmet}
          destinationNumber={visitedAirportIds.length - 1}
          playerName={currentTurnPlayer?.player_nickname || gameSession.player_nickname || 'プレイヤー'}
          onSelect={handleArrivalSelection}
          selectedAttractionId={destinationSelections[destinationAirport.id]?.selectedAttraction}
          selectedArtId={destinationSelections[destinationAirport.id]?.selectedArt}
          selectedGourmetId={destinationSelections[destinationAirport.id]?.selectedGourmet}
        />
      )}

      {/* イベント表示 */}
      {screenState === 'events' && currentEvent && (
        <>
          {currentEvent.type === 'attraction' && (
            <AttractionEvent
              isOpen={true}
              onClose={handleEventClose}
              attraction={currentEvent.data as Attraction}
            />
          )}
          {currentEvent.type === 'star' && (
            <StarEvent
              isOpen={true}
              onClose={handleEventClose}
              star={currentEvent.data as Star}
              location={currentEvent.starLocation || 'airport_lounge'}
            />
          )}
          {currentEvent.type === 'art' && (
            <ArtEvent
              isOpen={true}
              onClose={handleEventClose}
              art={currentEvent.data as Art}
            />
          )}
          {currentEvent.type === 'gourmet' && (
            <GourmetEvent
              isOpen={true}
              onClose={handleEventClose}
              gourmet={currentEvent.data as Gourmet}
            />
          )}
          {currentEvent.type === 'trouble' && (
            <TroubleEvent
              isOpen={true}
              onClose={handleEventClose}
              trouble={currentEvent.data as Trouble}
              resolution={currentEvent.troubleResolution}
            />
          )}
          {currentEvent.type === 'giver' && (
            <GiverEvent
              isOpen={true}
              onClose={handleGiverEventClose}
              scenario={currentEvent.data as GiverScenario}
            />
          )}
          {currentEvent.type === 'encouragement_gratitude' && (
            <EncouragementGratitudeEvent
              isOpen={true}
              onClose={handleEventClose}
              scenario={currentEvent.data as EncouragementGratitudeScenario}
            />
          )}
        </>
      )}

      {/* フリーマンアクションメッセージ */}
      {freemanActionMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-2xl p-8 min-w-[400px] animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">
                {freemanActionMessage.split(' ')[0]}
              </div>
              <div className="text-xl font-bold">
                {freemanActionMessage.substring(freemanActionMessage.indexOf(' ') + 1)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ゲームメニューモーダル */}
      {showGameMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
              ゲームメニュー
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setShowGameMenu(false)}
                size="lg"
                variant="outline"
                className="w-full"
              >
                ↩️ ゲームに戻る
              </Button>
              <Button
                onClick={() => {
                  if (confirm('ゲームを中断しますか？\n進行状況は保存されます。')) {
                    window.location.href = '/';
                  }
                }}
                size="lg"
                variant="outline"
                className="w-full text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                ⏸️ ゲームを中断
              </Button>
              <Button
                onClick={() => {
                  if (confirm('ゲームを終了しますか？\n現在の進行状況は失われます。')) {
                    setGameState('setup');
                    setGameSession(null);
                    setCurrentAirport(null);
                    setShowGameMenu(false);
                  }
                }}
                size="lg"
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🚫 ゲームを終了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* カード手札表示 */}
      {currentTurnPlayer && currentTurnPlayer.cards && (
        <CardHand
          playerCards={currentTurnPlayer.cards}
          isMyTurn={currentTurnPlayer.player_type === 'human'}
          canUseCards={screenState === 'map'} // 地図画面でのみ使用可能
          onUseCard={handleUseCard}
        />
      )}

      {/* ミッション表示 */}
      {currentTurnPlayer && currentTurnPlayer.missions && (
        <MissionPanel playerMissions={currentTurnPlayer.missions} />
      )}

      {/* カード対象選択 */}
      {showCardTargetSelector && selectedCardToUse && (
        <CardTargetSelector
          players={players}
          currentPlayerId={currentTurnPlayer?.id || ''}
          onSelectTarget={(targetId) => executeCardOnPlayer(selectedCardToUse, targetId)}
          onCancel={() => {
            setShowCardTargetSelector(false);
            setSelectedCardToUse(null);
          }}
        />
      )}

      {/* カード効果通知 */}
      {showCardEffect && cardEffectMessage && (
        <CardEffectNotification
          message={cardEffectMessage}
          onClose={handleCloseCardEffect}
        />
      )}

      {/* カード獲得アニメーション */}
      {showCardObtained && obtainedCards.length > 0 && (() => {
        const card = getCardById(obtainedCards[0].cardId);
        return card ? (
          <CardObtainedAnimation
            card={card}
            onClose={() => {
              setShowCardObtained(false);
              setObtainedCards([]);
            }}
          />
        ) : null;
      })()}

      {/* 到着ポイント内訳表示 */}
      {showArrivalBreakdown && arrivalBreakdown && (
        <ArrivalPointsBreakdown
          destinationName={destinationAirport?.city || destinationAirport?.name || '目的地'}
          destinationNumber={arrivalBreakdown.destinationNumber || 1}
          breakdown={arrivalBreakdown}
          onContinue={handleArrivalBreakdownContinue}
          playerName={arrivalBreakdown.playerName || currentTurnPlayer?.player_nickname || gameSession?.player_nickname || 'プレイヤー'}
        />
      )}

      {/* フリーマン目的地発表 */}
      {showFreemanDestination && freemanSelectedDestination && (
        <FreemanDestinationAnnouncement
          destination={freemanSelectedDestination}
          freemanName={freemanName}
          onContinue={handleFreemanDestinationContinue}
        />
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
