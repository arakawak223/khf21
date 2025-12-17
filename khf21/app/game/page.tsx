'use client';

import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/lib/game/GameContext';
import { useAudio } from '@/lib/game/useAudio';
import { EVENT_BGM_MAP, SCREEN_BGM_MAP } from '@/lib/game/bgmManager';
import GameSetup from '@/components/game/GameSetup';
import Dice3D from '@/components/game/Dice3D';
import DestinationRoulette from '@/components/game/DestinationRoulette';
import DestinationIntro from '@/components/game/DestinationIntro';
import ArrivalSelection from '@/components/game/ArrivalSelection';
import WorldMap from '@/components/game/WorldMap';
import PointsDisplay from '@/components/game/PointsDisplay';
import GameProgress from '@/components/game/GameProgress';
import AudioControls from '@/components/game/AudioControls';
import AudioInitializer from '@/components/game/AudioInitializer';
import {
  AttractionEvent,
  StarEvent,
  ArtEvent,
  GourmetEvent,
  TroubleEvent,
  GiverEvent,
  EncouragementGratitudeEvent,
} from '@/components/game/events';
import { Button } from '@/components/ui/button';
import {
  getAirports,
  createGameSession,
  getUserActiveGameSession,
  getAttractionsByCountry,
  getArtsByCity,
  getGourmetByCountry,
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
  } = useGame();

  const { playBGM, stopBGM, playDiceSteps, playFanfare } = useAudio();

  const [airports, setAirports] = useState<Airport[]>([]);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [screenState, setScreenState] = useState<
    'map' | 'destination_roulette' | 'destination_intro' | 'movement_roulette' | 'arrival_selection' | 'events'
  >('map');
  const [pendingEvents, setPendingEvents] = useState<GameEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedGiverPoints, setSelectedGiverPoints] = useState(0);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [travelDistance, setTravelDistance] = useState<number>(0);
  const [stayDays, setStayDays] = useState<number>(0);
  const [routeSpaces, setRouteSpaces] = useState<Array<{ lat: number; lng: number; spaceNumber: number }>>([]);
  const [currentSpaceNumber, setCurrentSpaceNumber] = useState<number>(0);
  const [arrivalAttraction, setArrivalAttraction] = useState<Attraction | null>(null);
  const [arrivalArt, setArrivalArt] = useState<Art | null>(null);
  const [arrivalGourmet, setArrivalGourmet] = useState<Gourmet | null>(null);
  const [visitedAirportIds, setVisitedAirportIds] = useState<string[]>([]);
  const [startingAirportId, setStartingAirportId] = useState<string | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);

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
    periodDays: number,
    periodName: string,
    startingAirportId: string,
    nickname?: string
  ) => {
    try {
      setLoading(true);
      console.log('=== Game Start Debug ===');
      console.log('1. Starting game with:', { periodDays, periodName, startingAirportId });
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

      // 開発中は常にゲストセッションを使用
      // ゲストセッションを作成（DBに保存しない）
      const guestSession: any = {
        id: 'guest-session-' + Date.now(),
        user_id: userId,
        period_setting_id: '',
        start_date: new Date().toISOString(),
        total_days: periodDays,
        elapsed_days: 0,
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
      };

      setCurrentAirport(airport);
      setGameSession(guestSession);
      setGameState('playing');
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
  const performMove = (destination: Airport, _distance: number, days: number) => {
    console.log(`Arriving at ${destination.city}, staying for ${days} days`);

    // 現在地を更新
    setCurrentAirport(destination);

    // 訪問済み空港に追加
    setVisitedAirportIds(prev => [...prev, destination.id]);

    // 経過日数を加算
    updateElapsedDays(days);

    // 期間超過チェック（到着時に期間を超えている場合はゲーム終了）
    if (gameSession) {
      const newElapsedDays = gameSession.elapsed_days + days;
      console.log(`期間チェック: ${newElapsedDays}日 / ${gameSession.total_days}日`);

      if (newElapsedDays >= gameSession.total_days) {
        console.log('🎉 期間終了！ゲームを終了します');
        setGameState('completed');
        return;
      }
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
  };

  // 目的地紹介から出発（移動ルーレット画面へ）
  const handleDepartToDestination = () => {
    if (!destinationAirport) return;

    // 移動ルーレット画面へ遷移
    console.log(`Departing to destination. Total spaces: ${routeSpaces.length}`);
    setScreenState('movement_roulette');
  };

  // 目的地ルーレット完了時（ランダムに目的地を決定）
  const handleDestinationSelected = (destination: Airport) => {
    if (!currentAirport) return;

    const distance = calculateDistance(currentAirport, destination);
    const days = calculateStayDays(distance);

    console.log(`Selected destination: ${destination.city}, distance: ${distance}km, stay: ${days} days`);

    setDestinationAirport(destination);
    setTravelDistance(distance);
    setStayDays(days);

    // 経路上のマス目を計算
    const spaces = calculateRouteSpaces(currentAirport, destination, 500);
    setRouteSpaces(spaces);
    setCurrentSpaceNumber(0); // 移動開始時は0マス目（出発地）

    console.log(`Route has ${spaces.length} spaces (500km each)`);

    // 目的地紹介画面へ遷移
    setScreenState('destination_intro');
  };

  // 移動ルーレット完了時（マス数を進める）
  const handleMovementRouletteComplete = async (result: number) => {
    console.log('Movement roulette result:', result, 'spaces');

    if (!destinationAirport || routeSpaces.length === 0) {
      console.error('No destination or route spaces');
      return;
    }

    // マス進行音を再生（カチッカチッカチッ）
    playDiceSteps(result);

    // マス数を進める
    const newSpaceNumber = currentSpaceNumber + result;
    console.log(`Moving from space ${currentSpaceNumber} to ${newSpaceNumber} (total spaces: ${routeSpaces.length})`);

    // 目的地到達チェック
    if (newSpaceNumber >= routeSpaces.length) {
      // 到達！最終マスに設定
      setCurrentSpaceNumber(routeSpaces.length);
      console.log(`Arrived at destination!`);

      // 到着ファンファーレを再生
      playFanfare();

      // 到着地の名所・アート・グルメをフェッチ
      try {
        setLoading(true);
        console.log('=== 到着地データ取得 ===');
        console.log(`目的地: ${destinationAirport.city}, ${destinationAirport.country}`);

        const [attractions, arts, gourmets] = await Promise.all([
          getAttractionsByCountry(destinationAirport.country),
          getArtsByCity(destinationAirport.city),
          getGourmetByCountry(destinationAirport.country),
        ]);

        console.log(`名所データ: ${attractions.length}件`);
        console.log(`アートデータ: ${arts.length}件`);
        console.log(`グルメデータ: ${gourmets.length}件`);

        // データ不足の警告
        if (attractions.length === 0) {
          console.warn(`⚠️ ${destinationAirport.country}の名所データがありません`);
        }
        if (arts.length === 0) {
          console.warn(`⚠️ ${destinationAirport.city}のアートデータがありません`);
        }
        if (gourmets.length === 0) {
          console.warn(`⚠️ ${destinationAirport.country}のグルメデータがありません`);
        }

        // 各カテゴリから選択
        // データがない場合は、この地域用の仮データを生成
        let randomAttraction = attractions.length > 0
          ? attractions[Math.floor(Math.random() * attractions.length)]
          : {
              id: 'temp-attraction',
              name: `${destinationAirport.city}の名所`,
              name_ja: `${destinationAirport.city}の名所`,
              country: destinationAirport.country,
              impressed_points: 20,
              description: `${destinationAirport.city}を代表する素晴らしい観光地です。`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as Attraction;

        let randomArt = arts.length > 0
          ? arts[Math.floor(Math.random() * arts.length)]
          : {
              id: 'temp-art',
              name: `${destinationAirport.city}の芸術作品`,
              name_ja: `${destinationAirport.city}の芸術作品`,
              city: destinationAirport.city,
              impressed_points: 15,
              description: `${destinationAirport.city}で鑑賞できる美しい芸術作品です。`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as Art;

        let randomGourmet = gourmets.length > 0
          ? gourmets[Math.floor(Math.random() * gourmets.length)]
          : {
              id: 'temp-gourmet',
              name: `${destinationAirport.city}の郷土料理`,
              name_ja: `${destinationAirport.city}の郷土料理`,
              country: destinationAirport.country,
              impressed_points: 18,
              description: `${destinationAirport.city}で味わえる美味しい料理です。`,
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
          performMove(destinationAirport, travelDistance, stayDays);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // まだ到達していない - マス数を更新して移動中イベントを生成
      setCurrentSpaceNumber(newSpaceNumber);
      console.log(`Not yet arrived. Current space: ${newSpaceNumber}/${routeSpaces.length}`);

      // 移動中のイベントを生成
      const travelEvents = await generateTravelEvents();

      if (travelEvents.length > 0) {
        setPendingEvents(travelEvents);
        setCurrentEventIndex(0);
        setScreenState('events');
      } else {
        // イベントがない場合は移動ルーレットに戻る
        setScreenState('movement_roulette');
      }
    }
  };

  // 到着選択ハンドラー
  const handleArrivalSelection = async (option: { type: 'attraction' | 'art' | 'gourmet'; data: any }) => {
    console.log('Selected arrival option:', option.type);

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
    setScreenState('events');
  };

  // イベント完了時
  const handleEventClose = () => {
    const currentEvent = pendingEvents[currentEventIndex];

    // ポイント計算
    let giverPoints = 0;
    if (currentEvent.type === 'giver') {
      giverPoints = selectedGiverPoints;
      setSelectedGiverPoints(0);
    }

    const points = calculateEventPoints(currentEvent, giverPoints);

    // ポイント更新
    if (points.impressed !== 0 || points.giver !== 0) {
      updatePoints(points.impressed, points.giver);
    }

    // 次のイベントへ
    if (currentEventIndex < pendingEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      // すべてのイベント完了
      setPendingEvents([]);
      setCurrentEventIndex(0);

      // 目的地に到達しているかチェック
      if (destinationAirport && currentSpaceNumber >= routeSpaces.length) {
        // 到達済み - 移動完了
        performMove(destinationAirport, travelDistance, stayDays);
      } else if (destinationAirport) {
        // まだ到達していない - 移動ルーレットに戻る
        console.log(`Returning to movement roulette. Current: ${currentSpaceNumber}/${routeSpaces.length}`);
        setScreenState('movement_roulette');
      } else {
        setScreenState('map');
      }
    }
  };

  // Giverイベント完了時（選択されたポイントを保存）
  const handleGiverEventClose = (points: number) => {
    setSelectedGiverPoints(points);
    handleEventClose();
  };

  // ゲーム終了チェック
  useEffect(() => {
    if (gameSession && gameSession.elapsed_days >= gameSession.total_days) {
      setGameState('completed');
    }
  }, [gameSession]);

  // BGM管理 - 画面状態に応じてBGMを切り替え
  useEffect(() => {
    if (gameState !== 'playing') {
      stopBGM();
      return;
    }

    // イベント画面の場合は、イベントタイプに応じたBGMを再生
    if (screenState === 'events' && pendingEvents.length > 0) {
      const currentEvent = pendingEvents[currentEventIndex];
      const bgmType = EVENT_BGM_MAP[currentEvent.type] || 'cheerful';
      playBGM(bgmType);
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

  if (!gameSession || !currentAirport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="mobile-container py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">旅が終了しました</h1>
          <PointsDisplay
            impressedPoints={gameSession.impressed_points}
            giverPoints={gameSession.giver_points}
            showDetails={true}
          />
          <Button
            onClick={() => {
              setGameState('setup');
              setGameSession(null);
              setCurrentAirport(null);
            }}
            className="mt-6"
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
    <div className="game-screen safe-area">
      {/* オーディオ初期化プロンプト */}
      {!audioInitialized && <AudioInitializer onInitialized={() => setAudioInitialized(true)} />}

      {/* ヘッダー: ポイントと進行状況 */}
      <div className="p-4 bg-white dark:bg-gray-900 shadow-md">
        <div className="mobile-container">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <PointsDisplay
                  impressedPoints={gameSession.impressed_points}
                  giverPoints={gameSession.giver_points}
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
              elapsedDays={gameSession.elapsed_days}
              totalDays={gameSession.total_days}
              currentLocation={currentAirport.name_ja || currentAirport.name}
            />
            <AudioControls />
          </div>
        </div>
      </div>

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

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mobile-container">
          <div className="flex flex-col gap-6">
            {/* 世界地図 */}
            <WorldMap
              currentAirport={currentAirport}
              destinationAirport={destinationAirport || undefined}
              showRoute={!!destinationAirport}
              playerNickname={gameSession.player_nickname || 'プレイヤー1'}
              playerColor={gameSession.player_color || 'red'}
              routeSpaces={routeSpaces}
              currentSpace={currentSpaceNumber}
            />

            {/* 画面状態に応じた表示 */}
            {screenState === 'map' && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setScreenState('destination_roulette')}
                  size="lg"
                  className="touch-target text-xl font-bold py-6 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  ✈️ 次の目的地へ
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  ルーレットで次の目的地を決めよう
                </p>
              </div>
            )}

            {screenState === 'destination_roulette' && (() => {
              // 利用可能な空港をフィルタ（現在地と訪問済みを除外）
              let availableAirports = airports.filter(a =>
                a.id !== currentAirport.id &&
                !visitedAirportIds.includes(a.id)
              );

              // 選択肢がない場合は訪問済みも含める（ただし現在地は除く）
              if (availableAirports.length === 0) {
                availableAirports = airports.filter(a => a.id !== currentAirport.id);
              }

              return (
                <DestinationRoulette
                  availableAirports={availableAirports}
                  onDestinationSelected={handleDestinationSelected}
                />
              );
            })()}

            {screenState === 'movement_roulette' && (
              <div className="flex flex-col gap-3">
                <Dice3D
                  key={`dice-${currentSpaceNumber}`}
                  onRollComplete={handleMovementRouletteComplete}
                  disabled={false}
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
                    現在位置: {currentSpaceNumber} / {routeSpaces.length} マス
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    目的地まで残り {routeSpaces.length - currentSpaceNumber} マス
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 目的地紹介画面 */}
      {screenState === 'destination_intro' && destinationAirport && (
        <DestinationIntro
          airport={destinationAirport}
          distance={travelDistance}
          stayDays={stayDays}
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
          onSelect={handleArrivalSelection}
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
              location="airport"
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
