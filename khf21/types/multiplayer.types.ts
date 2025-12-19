/**
 * 複数プレイヤー対戦システムの型定義
 */

import type { Airport } from './database.types';

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
 * ゲームプレイヤー
 */
export interface GamePlayer {
  id: string;
  game_session_id: string;
  player_type: PlayerType;
  player_order: number;
  player_nickname: string;
  player_color: string;

  // 現在位置
  current_location_type: 'airport' | 'port' | 'flight' | 'ship';
  current_airport_id: string | null;
  current_port_id: string | null;
  current_space_number: number;
  destination_airport_id: string | null;
  route_spaces: RouteSpace[] | null;

  // ポイント
  impressed_points: number;
  giver_points: number;
  total_points: number;

  // 状態管理
  is_skipping_turn: boolean;
  freeman_type: FreemanType | null;

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
  current_airport_id?: string;
  freeman_type?: FreemanType;
}

/**
 * プレイヤー更新パラメータ
 */
export interface UpdatePlayerParams {
  player_nickname?: string;
  player_color?: string;
  current_location_type?: 'airport' | 'port' | 'flight' | 'ship';
  current_airport_id?: string | null;
  current_port_id?: string | null;
  current_space_number?: number;
  destination_airport_id?: string | null;
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
}
