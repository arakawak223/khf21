// 目的地3択システムのロジック

import type { Airport } from '@/types/database.types';
import type { GamePlayer } from '@/types/multiplayer.types';
import type { DestinationCandidate, DestinationSpecialEffect } from '@/types/strategy.types';

// 2点間の距離を計算（Haversine公式）
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 緯度経度を数値として取得
function getCoordinate(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// 報酬レベルを距離に基づいて計算
function calculateRewardLevel(distance: number): 1 | 2 | 3 | 4 | 5 {
  if (distance < 2000) return 1;
  if (distance < 5000) return 2;
  if (distance < 8000) return 3;
  if (distance < 12000) return 4;
  return 5;
}

// 移動日数を推定
function estimateTravelDays(distance: number): number {
  // 500kmごとに1日と仮定
  return Math.ceil(distance / 500);
}

// 特殊効果をランダムに生成（10%の確率）
function generateSpecialEffect(): DestinationSpecialEffect | undefined {
  const roll = Math.random();

  if (roll < 0.1) { // 10%の確率
    const effects: DestinationSpecialEffect[] = [
      {
        type: 'double_points',
        description: '到着時のポイントが2倍！',
        icon: '💎',
      },
      {
        type: 'card_bonus',
        description: 'カードを追加で1枚入手',
        icon: '🎴',
      },
      {
        type: 'mission_boost',
        description: 'ミッション進捗が2倍',
        icon: '⭐',
      },
      {
        type: 'safe_zone',
        description: '攻撃カード無効エリア',
        icon: '🛡️',
      },
      {
        type: 'danger_zone',
        description: 'トラブル発生率UP、でもポイント1.5倍',
        icon: '⚠️',
      },
    ];

    return effects[Math.floor(Math.random() * effects.length)];
  }

  return undefined;
}

// 他プレイヤーとの競合度を計算
function calculateCompetitionLevel(
  targetAirport: Airport,
  players: GamePlayer[],
  currentPlayerId: string
): 'low' | 'medium' | 'high' {
  // 他プレイヤーの目的地または現在地との距離を計算
  const targetLat = getCoordinate(targetAirport.latitude);
  const targetLng = getCoordinate(targetAirport.longitude);

  let nearbyCount = 0;

  players.forEach(player => {
    if (player.id === currentPlayerId) return;

    // プレイヤーの現在地を取得（簡易版）
    // 実際には route_spaces から位置を計算する必要がある
    const playerSpace = player.route_spaces?.[player.current_space_number - 1];
    if (playerSpace) {
      const distance = calculateDistance(
        targetLat,
        targetLng,
        playerSpace.lat,
        playerSpace.lng
      );

      // 3000km以内に他プレイヤーがいる場合
      if (distance < 3000) {
        nearbyCount++;
      }
    }
  });

  if (nearbyCount >= 2) return 'high';
  if (nearbyCount === 1) return 'medium';
  return 'low';
}

// 目的地候補を3つ生成
export function generateDestinationCandidates(
  currentAirport: Airport,
  allAirports: Airport[],
  visitedAirportCodes: string[],
  players: GamePlayer[],
  currentPlayerId: string,
  occupiedCities: Map<string, { playerId: string; level: number }>
): DestinationCandidate[] {
  const currentLat = getCoordinate(currentAirport.latitude);
  const currentLng = getCoordinate(currentAirport.longitude);

  // 訪問済みと現在地を除外
  const availableAirports = allAirports.filter(
    airport =>
      airport.code !== currentAirport.code &&
      !visitedAirportCodes.includes(airport.code)
  );

  if (availableAirports.length < 3) {
    console.warn('利用可能な空港が3つ未満です');
  }

  // 距離を計算してソート
  const airportsWithDistance = availableAirports.map(airport => {
    const distance = calculateDistance(
      currentLat,
      currentLng,
      getCoordinate(airport.latitude),
      getCoordinate(airport.longitude)
    );
    return { airport, distance };
  });

  // バランスよく選ぶ: 近距離1, 中距離1, 遠距離1
  airportsWithDistance.sort((a, b) => a.distance - b.distance);

  // 近距離: 1500km以上5000km未満（短すぎる距離を避ける）
  // 中距離: 5000km以上10000km未満
  // 遠距離: 10000km以上
  const nearRange = airportsWithDistance.filter(a => a.distance >= 1500 && a.distance < 5000);
  const midRange = airportsWithDistance.filter(a => a.distance >= 5000 && a.distance < 10000);
  const farRange = airportsWithDistance.filter(a => a.distance >= 10000);

  const selected: typeof airportsWithDistance = [];

  // 近距離から1つ
  if (nearRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(nearRange.length, 5));
    selected.push(nearRange[randomIndex]);
  }

  // 中距離から1つ
  if (midRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(midRange.length, 5));
    selected.push(midRange[randomIndex]);
  }

  // 遠距離から1つ
  if (farRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(farRange.length, 5));
    selected.push(farRange[randomIndex]);
  }

  // 3つに満たない場合は適当に追加
  while (selected.length < 3 && selected.length < airportsWithDistance.length) {
    const randomIndex = Math.floor(Math.random() * airportsWithDistance.length);
    const candidate = airportsWithDistance[randomIndex];
    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }

  // DestinationCandidate に変換
  return selected.map(({ airport, distance }) => {
    const rewardLevel = calculateRewardLevel(distance);
    const estimatedDays = estimateTravelDays(distance);
    const specialEffect = generateSpecialEffect();
    const competitionLevel = calculateCompetitionLevel(airport, players, currentPlayerId);

    const occupation = occupiedCities.get(airport.id);

    return {
      airport,
      distance: Math.round(distance),
      estimatedDays,
      rewardLevel,
      specialEffect,
      competitionLevel,
      isOccupied: !!occupation,
      occupiedBy: occupation?.playerId,
    };
  });
}

// AIがランダムに選択権を持つプレイヤーを決定
export function selectRandomChooser(players: GamePlayer[]): GamePlayer {
  const humanPlayers = players.filter(p => p.player_type === 'human');

  // 人間プレイヤーが複数いる場合はその中から、いなければ全プレイヤーから
  const eligiblePlayers = humanPlayers.length > 0 ? humanPlayers : players;

  const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
  return eligiblePlayers[randomIndex];
}

// 目的地選択の基準をスコア化（AI用）
export function scoreDestination(candidate: DestinationCandidate): number {
  let score = 0;

  // 報酬レベルに応じてスコア
  score += candidate.rewardLevel * 100;

  // 特殊効果があれば加点
  if (candidate.specialEffect) {
    score += 150;
  }

  // 競合度によるスコア調整
  if (candidate.competitionLevel === 'low') {
    score += 50; // 競争が少ないほうが安全
  } else if (candidate.competitionLevel === 'high') {
    score -= 30; // 競争が激しいのはリスク
  }

  // 占有されている場合は減点
  if (candidate.isOccupied) {
    score -= 100;
  }

  // 距離に応じた調整（遠すぎると減点）
  if (candidate.distance > 15000) {
    score -= 50;
  }

  return score;
}
