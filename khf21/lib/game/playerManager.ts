/**
 * プレイヤー管理API
 * 複数プレイヤー対戦システムのプレイヤー操作
 */

import { createClient } from '@/lib/supabase/client';
import type {
  GamePlayer,
  CreatePlayerParams,
  UpdatePlayerParams,
} from '@/types/multiplayer.types';

/**
 * プレイヤーを作成
 */
export async function createPlayer(params: CreatePlayerParams): Promise<GamePlayer> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .insert({
      game_session_id: params.game_session_id,
      player_type: params.player_type,
      player_order: params.player_order,
      player_nickname: params.player_nickname,
      player_color: params.player_color,
      current_airport_id: params.current_airport_id || null,
      freeman_type: params.freeman_type || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create player:', error);
    throw new Error(`プレイヤーの作成に失敗しました: ${error.message}`);
  }

  return data as GamePlayer;
}

/**
 * セッションの全プレイヤーを取得
 */
export async function getPlayersBySession(sessionId: string): Promise<GamePlayer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_session_id', sessionId)
    .order('player_order', { ascending: true });

  if (error) {
    console.error('Failed to get players:', error);
    throw new Error(`プレイヤーの取得に失敗しました: ${error.message}`);
  }

  return (data as GamePlayer[]) || [];
}

/**
 * プレイヤーIDで取得
 */
export async function getPlayerById(playerId: string): Promise<GamePlayer | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('id', playerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // プレイヤーが見つからない
      return null;
    }
    console.error('Failed to get player:', error);
    throw new Error(`プレイヤーの取得に失敗しました: ${error.message}`);
  }

  return data as GamePlayer;
}

/**
 * プレイヤーを更新
 */
export async function updatePlayer(
  playerId: string,
  updates: UpdatePlayerParams
): Promise<GamePlayer> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .update(updates)
    .eq('id', playerId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update player:', error);
    throw new Error(`プレイヤーの更新に失敗しました: ${error.message}`);
  }

  return data as GamePlayer;
}

/**
 * プレイヤーのポイントを加算
 */
export async function addPlayerPoints(
  playerId: string,
  impressedPoints: number,
  giverPoints: number
): Promise<GamePlayer> {
  const supabase = createClient();

  // 現在のポイントを取得
  const player = await getPlayerById(playerId);
  if (!player) {
    throw new Error('プレイヤーが見つかりません');
  }

  // 新しいポイントを計算
  const newImpressedPoints = player.impressed_points + impressedPoints;
  const newGiverPoints = player.giver_points + giverPoints;

  // 更新
  return updatePlayer(playerId, {
    impressed_points: newImpressedPoints,
    giver_points: newGiverPoints,
  });
}

/**
 * プレイヤーを削除
 */
export async function deletePlayer(playerId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('game_players')
    .delete()
    .eq('id', playerId);

  if (error) {
    console.error('Failed to delete player:', error);
    throw new Error(`プレイヤーの削除に失敗しました: ${error.message}`);
  }
}

/**
 * 現在のターンプレイヤーを取得
 */
export async function getCurrentTurnPlayer(sessionId: string): Promise<GamePlayer | null> {
  const supabase = createClient();

  // セッションの current_turn_order を取得
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('current_turn_order')
    .eq('id', sessionId)
    .single();

  if (sessionError) {
    console.error('Failed to get session:', sessionError);
    throw new Error(`セッションの取得に失敗しました: ${sessionError.message}`);
  }

  if (!session) {
    return null;
  }

  // current_turn_order に対応するプレイヤーを取得
  const { data: player, error: playerError } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_session_id', sessionId)
    .eq('player_order', session.current_turn_order)
    .single();

  if (playerError) {
    if (playerError.code === 'PGRST116') {
      // プレイヤーが見つからない
      return null;
    }
    console.error('Failed to get current turn player:', playerError);
    throw new Error(`現在のターンプレイヤーの取得に失敗しました: ${playerError.message}`);
  }

  return player as GamePlayer;
}

/**
 * 人間プレイヤーを取得
 */
export async function getHumanPlayer(sessionId: string): Promise<GamePlayer | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_session_id', sessionId)
    .eq('player_type', 'human')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // プレイヤーが見つからない
      return null;
    }
    console.error('Failed to get human player:', error);
    throw new Error(`人間プレイヤーの取得に失敗しました: ${error.message}`);
  }

  return data as GamePlayer;
}

/**
 * フリーマンプレイヤーを取得
 */
export async function getFreemanPlayer(sessionId: string): Promise<GamePlayer | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_session_id', sessionId)
    .in('player_type', ['freeman_d', 'freeman_s'])
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // プレイヤーが見つからない
      return null;
    }
    console.error('Failed to get freeman player:', error);
    throw new Error(`フリーマンプレイヤーの取得に失敗しました: ${error.message}`);
  }

  return data as GamePlayer;
}

/**
 * プレイヤーの順位を取得
 */
export async function getPlayerRankings(sessionId: string): Promise<GamePlayer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_session_id', sessionId)
    .order('total_points', { ascending: false })
    .order('player_order', { ascending: true });

  if (error) {
    console.error('Failed to get player rankings:', error);
    throw new Error(`プレイヤーの順位取得に失敗しました: ${error.message}`);
  }

  return (data as GamePlayer[]) || [];
}
