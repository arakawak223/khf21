// 戦略的ゲーム要素のロジック実装

import type { GamePlayer } from '@/types/multiplayer.types';
import type {
  PlayerMission,
  PlayerStatistics,
  CityOccupation,
  CardEffect,
  OvertakeEvent,
} from '@/types/strategy.types';
import { getMissionById } from './strategyData';

// ===============================
// ミッション進捗更新
// ===============================

// ミッション進捗を更新
export function updateMissionProgress(
  missions: PlayerMission[],
  statistics: PlayerStatistics,
  totalPoints: number
): { missions: PlayerMission[]; completedMissions: string[] } {
  const completedMissions: string[] = [];
  const updatedMissions = missions.map((playerMission) => {
    if (playerMission.completed) return playerMission;

    const mission = getMissionById(playerMission.missionId);
    if (!mission) return playerMission;

    let newProgress = playerMission.progress;

    switch (mission.type) {
      case 'visit_continents':
        // 訪問大陸数
        newProgress = statistics.continentsVisited.length;
        break;

      case 'visit_count':
        // 訪問都市数
        newProgress = statistics.citiesVisited.length;
        break;

      case 'collect_type':
        // 特定タイプの選択回数（統計から取得）
        // 実装: mission.nameJa に含まれるキーワードで判定
        if (mission.nameJa.includes('アート')) {
          // アート選択回数を統計から取得（仮実装）
          newProgress = playerMission.progress;
        } else if (mission.nameJa.includes('グルメ')) {
          newProgress = playerMission.progress;
        } else if (mission.nameJa.includes('名所')) {
          newProgress = playerMission.progress;
        }
        break;

      case 'point_target':
        // ポイント目標
        newProgress = totalPoints;
        break;

      case 'distance_travel':
        // 総移動距離
        newProgress = Math.floor(statistics.totalDistance);
        break;

      case 'speed_challenge':
        // スピードチャレンジ（別途管理が必要）
        newProgress = playerMission.progress;
        break;
    }

    const isNowCompleted = newProgress >= mission.targetValue && !playerMission.completed;

    if (isNowCompleted) {
      completedMissions.push(mission.id);
    }

    return {
      ...playerMission,
      progress: newProgress,
      completed: newProgress >= mission.targetValue,
      completedAt: isNowCompleted ? new Date().toISOString() : playerMission.completedAt,
    };
  });

  return { missions: updatedMissions, completedMissions };
}

// 特定タイプの選択時にミッション進捗を増やす
export function incrementMissionProgressByType(
  missions: PlayerMission[],
  selectionType: 'attraction' | 'art' | 'gourmet'
): PlayerMission[] {
  return missions.map((playerMission) => {
    if (playerMission.completed) return playerMission;

    const mission = getMissionById(playerMission.missionId);
    if (!mission || mission.type !== 'collect_type') return playerMission;

    // ミッション名から対象タイプを判定
    const isMatch =
      (selectionType === 'art' && mission.nameJa.includes('アート')) ||
      (selectionType === 'gourmet' && mission.nameJa.includes('グルメ')) ||
      (selectionType === 'attraction' && mission.nameJa.includes('名所'));

    if (!isMatch) return playerMission;

    const newProgress = playerMission.progress + 1;
    const isNowCompleted = newProgress >= mission.targetValue;

    return {
      ...playerMission,
      progress: newProgress,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : playerMission.completedAt,
    };
  });
}

// ===============================
// 先着ボーナス・占有システム
// ===============================

// 先着ボーナスを計算
export function calculateArrivalBonus(
  cityId: string,
  distance: number,
  occupations: Map<string, CityOccupation>,
  playerId: string
): {
  bonus: number;
  rank: number;
  isFirstArrival: boolean; // 後方互換性のため残す（非推奨）
  tollFee: number;
} {
  const occupation = occupations.get(cityId);

  if (!occupation) {
    // 先着
    const baseBonus = Math.floor(distance / 100); // 距離に応じた基本ボーナス（調整済み）
    const firstArrivalBonus = 100; // 先着ボーナス（調整済み）
    return {
      bonus: baseBonus + firstArrivalBonus,
      rank: 1,
      isFirstArrival: true,
      tollFee: 0,
    };
  }

  if (occupation.occupiedBy === playerId) {
    // 自分が占有している都市に再訪問
    const baseBonus = Math.floor(distance / 100); // 調整済み
    return {
      bonus: baseBonus + 30, // 小さなボーナス（調整済み）
      rank: 1,
      isFirstArrival: false,
      tollFee: 0,
    };
  }

  // 他プレイヤーが占有している都市
  const baseBonus = Math.floor(distance / 100); // 調整済み
  const lateArrivalBonus = 30; // 遅れて到着したボーナス（調整済み）
  const tollFee = occupation.tollFee; // 通行料

  // 通行料を引いても、最低0ポイントは保証する
  const finalBonus = Math.max(0, baseBonus + lateArrivalBonus - tollFee);

  return {
    bonus: finalBonus,
    rank: 2,
    isFirstArrival: false,
    tollFee,
  };
}

// 都市占有を更新
export function updateCityOccupation(
  cityId: string,
  cityName: string,
  playerId: string,
  occupations: Map<string, CityOccupation>
): Map<string, CityOccupation> {
  const newOccupations = new Map(occupations);
  const existing = newOccupations.get(cityId);

  if (!existing || existing.occupiedBy !== playerId) {
    // 新規占有または奪取
    newOccupations.set(cityId, {
      cityId,
      cityName,
      occupiedBy: playerId,
      occupiedAt: new Date().toISOString(),
      level: 1,
      tollFee: 50,
    });
  } else {
    // 自分の都市に再訪問 - レベルアップ
    newOccupations.set(cityId, {
      ...existing,
      level: Math.min(existing.level + 1, 3) as 1 | 2 | 3,
      tollFee: existing.tollFee + 25, // 通行料増加
    });
  }

  return newOccupations;
}

// ===============================
// 追い抜きイベント
// ===============================

// 追い抜きを検出
export function detectOvertake(
  currentPlayer: GamePlayer,
  otherPlayers: GamePlayer[]
): OvertakeEvent | null {
  const currentPosition = currentPlayer.current_space_number;
  const currentRoute = currentPlayer.route_spaces || [];

  if (currentPosition <= 0 || currentRoute.length === 0) return null;

  // 同じ目的地に向かっている他プレイヤーを探す
  for (const other of otherPlayers) {
    if (other.id === currentPlayer.id) continue;
    if (!other.route_spaces || other.route_spaces.length === 0) continue;

    // 目的地が同じかチェック（最終マスが近い）
    const currentDestination = currentRoute[currentRoute.length - 1];
    const otherDestination = other.route_spaces[other.route_spaces.length - 1];

    const distance = Math.sqrt(
      Math.pow(currentDestination.lat - otherDestination.lat, 2) +
      Math.pow(currentDestination.lng - otherDestination.lng, 2)
    );

    // 目的地が近い（同じ目的地とみなす）
    if (distance < 0.1) {
      // 追い抜いた（現在のマス数が相手より多い、かつ前回は少なかった）
      const wasBehindbefore = currentPosition - 1 <= other.current_space_number;
      const isAheadNow = currentPosition > other.current_space_number;

      if (wasBehindbefore && isAheadNow) {
        const currentSpace = currentRoute[Math.min(currentPosition - 1, currentRoute.length - 1)];

        return {
          overtaker: currentPlayer.id,
          overtaken: other.id,
          location: { lat: currentSpace.lat, lng: currentSpace.lng },
          bonusPoints: 100,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}

// ===============================
// カード効果の実行
// ===============================

// カード効果を実行（簡易版 - 実際の実装では各効果に応じた処理が必要）
export function executeCardEffect(
  effect: CardEffect,
  userId: string,
  targetUserId: string | null,
  players: GamePlayer[]
): {
  updatedPlayers: GamePlayer[];
  message: string;
} {
  const updatedPlayers = [...players];
  let message = '';

  const userIndex = updatedPlayers.findIndex(p => p.id === userId);
  const targetIndex = targetUserId ? updatedPlayers.findIndex(p => p.id === targetUserId) : -1;

  if (userIndex === -1) {
    return { updatedPlayers, message: 'プレイヤーが見つかりません' };
  }

  switch (effect.type) {
    case 'move_back':
      if (targetIndex !== -1 && effect.value) {
        const target = updatedPlayers[targetIndex];
        const newPosition = Math.max(1, target.current_space_number - effect.value);
        updatedPlayers[targetIndex] = {
          ...target,
          current_space_number: newPosition,
        };
        message = `${target.player_nickname}を${effect.value}マス戻しました！`;
      }
      break;

    case 'steal_points':
      if (targetIndex !== -1 && effect.value) {
        const target = updatedPlayers[targetIndex];
        const stolenPoints = Math.floor(target.total_points * (effect.value / 100));
        updatedPlayers[targetIndex] = {
          ...target,
          total_points: Math.max(0, target.total_points - stolenPoints),
        };
        updatedPlayers[userIndex] = {
          ...updatedPlayers[userIndex],
          total_points: updatedPlayers[userIndex].total_points + stolenPoints,
        };
        message = `${target.player_nickname}から${stolenPoints}ポイント奪いました！`;
      }
      break;

    case 'double_move':
      message = '次のサイコロで2回振れます！';
      break;

    case 'double_points':
      message = '次の到着でポイント2倍！';
      break;

    case 'barrier':
      message = `${effect.duration}ターンの間、攻撃カードを無効化します！`;
      break;

    case 'counter':
      message = '次の攻撃を跳ね返します！';
      break;

    case 'freeze':
      if (targetIndex !== -1) {
        const target = updatedPlayers[targetIndex];
        message = `${target.player_nickname}を${effect.duration}ターン凍結しました！`;
      }
      break;

    case 'extra_card':
      message = `カードを${effect.value}枚追加で引きます！`;
      break;

    case 'teleport':
      message = '任意の都市に瞬間移動します！';
      break;

    default:
      message = 'カード効果を発動しました！';
  }

  return { updatedPlayers, message };
}
