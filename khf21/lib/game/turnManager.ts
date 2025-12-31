/**
 * ターン管理システム
 * 複数プレイヤー対戦のターン制御
 */

import { createClient } from '@/lib/supabase/client';
import type { GamePlayer } from '@/types/multiplayer.types';
import { getCurrentTurnPlayer, getPlayersBySession } from './playerManager';

export class TurnManager {
  private supabase = createClient();

  /**
   * ターン開始
   * 現在のターンプレイヤーを取得し、休み状態をチェック
   * @param sessionId ゲームセッションID
   * @returns 現在のターンプレイヤー
   */
  async startTurn(sessionId: string): Promise<GamePlayer> {
    // 現在のターンプレイヤーを取得
    let currentPlayer = await getCurrentTurnPlayer(sessionId);

    if (!currentPlayer) {
      throw new Error('No current turn player found');
    }

    // 休み状態の場合は自動スキップ
    if (await this.checkSkipTurn(currentPlayer)) {
      console.log(`Player ${currentPlayer.player_nickname} is skipping turn`);

      // 休み状態を解除
      await this.clearSkipTurn(currentPlayer.id);

      // 次のプレイヤーへ
      await this.endTurn(sessionId);

      // 再帰的に次のプレイヤーのターンを開始
      return this.startTurn(sessionId);
    }

    return currentPlayer;
  }

  /**
   * ターン終了（次のプレイヤーへ）
   * current_turn_orderをインクリメントし、循環させる
   * @param sessionId ゲームセッションID
   */
  async endTurn(sessionId: string): Promise<void> {
    // ゲームセッションの情報を取得
    const { data: session, error: sessionError } = await this.supabase
      .from('game_sessions')
      .select('current_turn_order, total_players')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error(`Failed to get game session: ${sessionError?.message}`);
    }

    // 次のターン番号を計算（循環）
    const nextTurnOrder = (session.current_turn_order % session.total_players) + 1;

    // current_turn_orderを更新
    const { error: updateError } = await this.supabase
      .from('game_sessions')
      .update({
        current_turn_order: nextTurnOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      throw new Error(`Failed to update turn order: ${updateError.message}`);
    }

    console.log(`Turn ended. Next turn order: ${nextTurnOrder}`);
  }

  /**
   * 休み状態チェック
   * @param player プレイヤー
   * @returns true: 休み状態, false: プレイ可能
   */
  async checkSkipTurn(player: GamePlayer): Promise<boolean> {
    return player.is_skipping_turn;
  }

  /**
   * 休み状態解除
   * @param playerId プレイヤーID
   */
  async clearSkipTurn(playerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('game_players')
      .update({
        is_skipping_turn: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', playerId);

    if (error) {
      throw new Error(`Failed to clear skip turn: ${error.message}`);
    }

    console.log(`Cleared skip turn for player ${playerId}`);
  }

  /**
   * プレイヤーを休み状態にする
   * @param playerId プレイヤーID
   */
  async setSkipTurn(playerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('game_players')
      .update({
        is_skipping_turn: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', playerId);

    if (error) {
      throw new Error(`Failed to set skip turn: ${error.message}`);
    }

    console.log(`Set skip turn for player ${playerId}`);
  }

  /**
   * ゲーム終了判定
   * すべてのプレイヤーが全空港を訪問したかチェック
   * @param sessionId ゲームセッションID
   * @returns true: ゲーム終了, false: ゲーム継続
   */
  async checkGameEnd(sessionId: string): Promise<boolean> {
    // 全プレイヤーを取得
    const players = await getPlayersBySession(sessionId);

    // 総空港数を取得
    const { count: totalAirports, error: countError } = await this.supabase
      .from('airports')
      .select('*', { count: 'exact', head: true });

    if (countError || totalAirports === null) {
      throw new Error(`Failed to count airports: ${countError?.message}`);
    }

    // 人間プレイヤーが全空港を訪問したかチェック
    for (const player of players) {
      if (player.player_type === 'human') {
        // 訪問済み空港数を取得
        const { count: visitedCount, error: visitedError } = await this.supabase
          .from('travel_history')
          .select('*', { count: 'exact', head: true })
          .eq('game_session_id', sessionId)
          .eq('player_id', player.id);

        if (visitedError) {
          throw new Error(`Failed to count visited airports: ${visitedError.message}`);
        }

        // まだ全空港を訪問していない人間プレイヤーがいる
        if (visitedCount !== totalAirports) {
          return false;
        }
      }
    }

    // すべての人間プレイヤーが全空港を訪問済み
    return true;
  }

  /**
   * 勝者を決定
   * 総ポイントが最も高いプレイヤーを返す
   * @param sessionId ゲームセッションID
   * @returns 勝者のプレイヤー
   */
  async determineWinner(sessionId: string): Promise<GamePlayer> {
    const players = await getPlayersBySession(sessionId);

    // 総ポイントでソート
    const sortedPlayers = players.sort((a, b) => b.total_points - a.total_points);

    return sortedPlayers[0];
  }

  /**
   * ターン情報を取得
   * @param sessionId ゲームセッションID
   * @returns ターン情報
   */
  async getTurnInfo(sessionId: string): Promise<{
    currentTurnOrder: number;
    totalPlayers: number;
    currentPlayer: GamePlayer;
  }> {
    const { data: session, error: sessionError } = await this.supabase
      .from('game_sessions')
      .select('current_turn_order, total_players')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error(`Failed to get game session: ${sessionError?.message}`);
    }

    const currentPlayer = await getCurrentTurnPlayer(sessionId);

    if (!currentPlayer) {
      throw new Error('No current turn player found');
    }

    return {
      currentTurnOrder: session.current_turn_order,
      totalPlayers: session.total_players,
      currentPlayer,
    };
  }
}
