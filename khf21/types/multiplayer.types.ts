/**
 * 複数プレイヤー対戦システムの型定義
 */

import type { Airport } from './database.types';
import type { PlayerCard, PlayerMission, PlayerStatistics, ActiveEffect } from './strategy.types';

/**
 * プレイヤータイプ
 */
export type PlayerType = 'human' | 'freeman_d' | 'freeman_s';

/**
 * フリーマンタイプ
 */
export type FreemanType = 'defense' | 'support';

/**
 * 追い越しアクションタイプ
 */
export type OvertakeActionType =
  | 'move_back'      // 後退
  | 'get_points'     // ポイント奪取
  | 'skip_turn'      // 1回休み
  | 'move_forward'   // 前進
  | 'give_points'    // ポイント付与
  | 'encourage';     // 激励メッセージ+50ポイント

/**
 * 経路マスの座標情報
 */
export interface RouteSpace {
  lat: number;
  lng: number;
  spaceNumber: number;
}

/**
 * 目的地訪問履歴
 */
export interface DestinationVisit {
  destinationNumber: number; // 目的地の順番（1, 2, 3...）
  airportId: string;
  airportName: string;
  city: string;
  pointsEarned: number; // この目的地で獲得したポイント
  visitedAt: string;
}

/**
 * フライトクラス
 */
export type FlightClass = 'economy' | 'business' | 'first';

/**
 * ホテルグレード
 */
export type HotelGrade = 'guesthouse' | 'standard' | 'luxury';

/**
 * キャラクター特性
 */
export type CharacterTrait = 'adventurer' | 'planner' | 'socialite' | 'efficient' | 'balanced';

/**
 * ゲームプレイヤー
 */
export interface GamePlayer {
  id: string;
  game_session_id: string;
  player_type: PlayerType;
  player_order: number;
  player_nickname: string;
  player_color: string;
  nationality: string; // プレイヤーの国籍

  // 現在位置
  current_location_type: 'airport' | 'port' | 'flight' | 'ship';
  current_airport_id: string | null;
  current_port_id: string | null;
  current_space_number: number;
  // 注: destination_airport_idは削除 - ゲーム全体で共通の目的地を使用
  route_spaces: RouteSpace[] | null;

  // ポイント
  impressed_points: number;
  giver_points: number;
  total_points: number;

  // 資源管理（ポイントベース）
  resource_points: number;
  total_spent_points: number;
  current_flight_class: FlightClass;
  current_hotel_grade: HotelGrade;
  star_encounter_bonus: number;

  // キャラクター特性
  character_trait: CharacterTrait;
  trait_long_distance_bonus: number;
  trait_event_rate_modifier: number;

  // 状態管理
  is_skipping_turn: boolean;
  freeman_type: FreemanType | null;

  // 戦略的要素
  cards?: PlayerCard[]; // 所持カード
  missions?: PlayerMission[]; // 個人ミッション
  occupied_cities?: string[]; // 占有中の都市ID
  active_effects?: ActiveEffect[]; // 現在有効な効果
  statistics?: PlayerStatistics; // 統計情報
  visit_history?: DestinationVisit[]; // 目的地訪問履歴

  created_at: string;
  updated_at: string;
}

/**
 * 追い越しイベント
 */
export interface OvertakeEvent {
  id?: string;
  game_session_id: string;
  overtaking_player_id: string;
  overtaken_player_id: string;
  space_number: number;
  action_type: OvertakeActionType;
  action_value: number | null;
  occurred_at?: string;

  // 拡張情報（DBには保存されない）
  overtaking_player?: GamePlayer;
  overtaken_player?: GamePlayer;
}

/**
 * フリーマン変化記録
 */
export interface FreemanTransformation {
  id: string;
  game_session_id: string;
  freeman_player_id: string;
  from_type: FreemanType;
  to_type: FreemanType;
  reason: string | null;
  transformed_at: string;
}

/**
 * プレイヤー作成パラメータ
 */
export interface CreatePlayerParams {
  game_session_id: string;
  player_type: PlayerType;
  player_order: number;
  player_nickname: string;
  player_color: string;
  nationality: string; // プレイヤーの国籍
  current_airport_id?: string;
  freeman_type?: FreemanType;
}

/**
 * プレイヤー更新パラメータ
 */
export interface UpdatePlayerParams {
  player_nickname?: string;
  player_color?: string;
  nationality?: string; // プレイヤーの国籍
  current_location_type?: 'airport' | 'port' | 'flight' | 'ship';
  current_airport_id?: string | null;
  current_port_id?: string | null;
  current_space_number?: number;
  // 注: destination_airport_idは削除 - ゲーム全体で共通の目的地を使用
  route_spaces?: RouteSpace[] | null;
  impressed_points?: number;
  giver_points?: number;
  is_skipping_turn?: boolean;
  freeman_type?: FreemanType | null;
}

/**
 * 追い越し判定結果
 */
export interface OvertakeCheckResult {
  hasOvertake: boolean;
  events: Array<{
    overtaking_player: GamePlayer;
    overtaken_player: GamePlayer;
    space_number: number;
  }>;
}

/**
 * ターン情報
 */
export interface TurnInfo {
  current_turn_order: number;
  current_player: GamePlayer;
  all_players: GamePlayer[];
  is_human_turn: boolean;
}

/**
 * AI選択結果
 */
export interface AISelection {
  destination?: Airport;
  dice_value?: number;
  experience?: 'attraction' | 'art' | 'gourmet';
  overtake_action?: 'move_back' | 'get_points' | 'skip_turn';
  support_action?: 'move_forward' | 'give_points' | 'encourage';
  flight_class?: FlightClass;
  hotel_grade?: HotelGrade;
  activity_choice?: boolean;
}

/**
 * フライトクラス選択肢
 */
export interface FlightClassOption {
  class: FlightClass;
  name: string;
  description: string;
  cost: number;
  starEncounterBonus: number;
  bonusPoints: number;
  emoji: string;
}

/**
 * ホテルグレード選択肢
 */
export interface HotelGradeOption {
  grade: HotelGrade;
  name: string;
  description: string;
  cost: number;
  specialEventBonus: number;
  starEncounterBonus: number;
  emoji: string;
}

/**
 * アクティビティ選択肢
 */
export interface ActivityOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  pointsRange: [number, number]; // [最小, 最大]
  emoji: string;
}

/**
 * 資源ポイント取引記録
 */
export interface BudgetTransaction {
  id: string;
  game_id: string;
  player_id: string;
  transaction_type: 'flight_upgrade' | 'hotel_upgrade' | 'activity';
  amount: number;
  choice_made: string;
  location_context: string | null;
  created_at: string;
}

/**
 * キャラクター特性選択肢
 */
export interface CharacterTraitOption {
  trait: CharacterTrait;
  name: string;
  description: string;
  emoji: string;
  effects: {
    resourcePoints: number; // 初期資源ポイント
    longDistanceBonus: number; // 長距離移動ボーナス（%）
    starEncounterRate: number; // スター遭遇率（%）
    eventRateModifier: number; // イベント発生率修正（%）
    specialAbility: string; // 特殊能力の説明
  };
}
