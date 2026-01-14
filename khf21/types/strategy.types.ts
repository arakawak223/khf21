// 戦略的ゲーム要素の型定義

import type { Airport } from './database.types';

// ===============================
// カードシステム
// ===============================

export type CardCategory = 'attack' | 'defense' | 'boost';

export interface GameCard {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  category: CardCategory;
  icon: string;
  rarity: 1 | 2 | 3; // 1: コモン, 2: レア, 3: 超レア
  effect: CardEffect;
}

export interface CardEffect {
  type: 'move_back' | 'change_destination' | 'steal_points' | 'barrier' | 'counter' |
        'double_move' | 'double_points' | 'extra_card' | 'teleport' | 'freeze';
  value?: number;
  duration?: number; // ターン数
  target?: 'self' | 'opponent' | 'all';
}

// プレイヤーが所持するカード
export interface PlayerCard {
  cardId: string;
  obtainedAt: string;
  used: boolean;
}

// ===============================
// ミッションシステム
// ===============================

export type MissionType = 'visit_continents' | 'collect_type' | 'speed_challenge' |
                          'point_target' | 'visit_count' | 'distance_travel';

export interface Mission {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  type: MissionType;
  icon: string;
  targetValue: number;
  rewardPoints: number;
  rewardCards?: number; // カード報酬枚数
  difficulty: 1 | 2 | 3; // 1: 簡単, 2: 普通, 3: 難しい
}

export interface PlayerMission {
  missionId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

// ===============================
// 目的地選択システム
// ===============================

export interface DestinationCandidate {
  airport: Airport;
  distance: number;
  estimatedDays: number;
  rewardLevel: 1 | 2 | 3 | 4 | 5; // 星の数
  specialEffect?: DestinationSpecialEffect;
  competitionLevel: 'low' | 'medium' | 'high'; // 他プレイヤーとの競合度
  isOccupied?: boolean; // 他プレイヤーが占有中か
  occupiedBy?: string; // 占有プレイヤーID
}

export interface DestinationSpecialEffect {
  type: 'double_points' | 'card_bonus' | 'mission_boost' | 'safe_zone' | 'danger_zone';
  description: string;
  icon: string;
}

// グループ選択システム
export type GroupColor = 'red' | 'blue' | 'green';

export interface AirportGroup {
  color: GroupColor;
  colorName: string;  // 'Red', 'Blue', 'Green'
  emoji: string;      // '🔴', '🔵', '🟢'
  airports: Airport[];
  count: number;      // Number of airports in group
}

// ===============================
// 先行到着・占有システム
// ===============================

export interface CityOccupation {
  cityId: string;
  cityName: string;
  occupiedBy: string; // プレイヤーID
  occupiedAt: string;
  level: 1 | 2 | 3; // 占有レベル（訪問回数で上がる）
  tollFee: number; // 通行料
}

// ===============================
// 追い抜きイベント
// ===============================

export interface OvertakeEvent {
  overtaker: string; // 追い抜いたプレイヤーID
  overtaken: string; // 追い抜かれたプレイヤーID
  location: { lat: number; lng: number };
  bonusPoints: number;
  timestamp: string;
}

// ===============================
// プレイヤー拡張データ
// ===============================

export interface PlayerStrategyData {
  playerId: string;
  cards: PlayerCard[]; // 所持カード
  missions: PlayerMission[]; // 個人ミッション
  occupiedCities: string[]; // 占有中の都市ID
  activeEffects: ActiveEffect[]; // 現在有効な効果
  statistics: PlayerStatistics; // 統計情報
}

export interface ActiveEffect {
  effectType: string;
  duration: number; // 残りターン数
  source: string; // カードIDまたはイベント名
}

export interface PlayerStatistics {
  citiesVisited: string[]; // 訪問都市
  continentsVisited: string[]; // 訪問大陸
  totalDistance: number; // 総移動距離
  overtakeCount: number; // 追い抜き回数
  overtakenCount: number; // 追い抜かれた回数
  cardsUsed: number; // カード使用回数
  missionsCompleted: number; // ミッション達成数
}
