/**
 * 追い越し管理システム
 * 追い越し判定、ペナルティ/サポート実行、フリーマン変化
 */

import { createClient } from '@/lib/supabase/client';
import type { GamePlayer, OvertakeEvent, OvertakeCheckResult } from '@/types/multiplayer.types';
import type { OvertakeActionType, SupportActionType } from './freemanAI';

export class OvertakeManager {
  private supabase = createClient();

  /**
   * 追い越し判定
   * 移動前後の位置を比較し、追い越しが発生したかチェック
   * @param currentPlayer 現在のプレイヤー
   * @param allPlayers 全プレイヤーのリスト
   * @param oldSpaceNumber 移動前のマス番号
   * @param newSpaceNumber 移動後のマス番号
   * @returns 追い越しイベントの配列
   */
  checkOvertake(
    currentPlayer: GamePlayer,
    allPlayers: GamePlayer[],
    oldSpaceNumber: number,
    newSpaceNumber: number
  ): OvertakeCheckResult['events'] {
    const overtakeEvents: OvertakeCheckResult['events'] = [];

    // 同じ目的地に向かっているプレイヤーをフィルタリング
    const sameDestinationPlayers = allPlayers.filter(
      (player) =>
        player.id !== currentPlayer.id &&
        player.destination_airport_id === currentPlayer.destination_airport_id &&
        player.current_space_number > 0
    );

    for (const otherPlayer of sameDestinationPlayers) {
      const otherSpace = otherPlayer.current_space_number;

      // 追い越し判定条件
      // 移動前: currentPlayer.space < otherPlayer.space
      // 移動後: newSpace >= otherPlayer.space
      if (oldSpaceNumber < otherSpace && newSpaceNumber >= otherSpace) {
        console.log(
          `Overtake detected! ${currentPlayer.player_nickname} overtook ${otherPlayer.player_nickname} at space ${otherSpace}`
        );

        overtakeEvents.push({
          overtaking_player: currentPlayer,
          overtaken_player: otherPlayer,
          space_number: otherSpace,
        });
      }
    }

    return overtakeEvents;
  }

  /**
   * ペナルティ実行（Dフリーマン→人間）
   * @param event 追い越しイベント
   * @param actionType ペナルティアクション
   * @param diceValue サイコロの値
   */
  async executePenalty(
    event: OvertakeEvent,
    actionType: OvertakeActionType,
    diceValue: number
  ): Promise<void> {
    if (!event.overtaking_player || !event.overtaken_player) {
      console.error('Penalty execution requires full player objects');
      return;
    }

    console.log(
      `Executing penalty: ${actionType} on ${event.overtaking_player.player_nickname}`
    );

    const overtakingPlayerId = event.overtaking_player.id;
    const sessionId = event.overtaking_player.game_session_id;

    switch (actionType) {
      case 'move_back': {
        // 後退させる
        const newSpace = Math.max(
          0,
          event.overtaking_player.current_space_number - diceValue
        );

        await this.supabase
          .from('game_players')
          .update({
            current_space_number: newSpace,
            updated_at: new Date().toISOString(),
          })
          .eq('id', overtakingPlayerId);

        console.log(`Moved ${event.overtaking_player.player_nickname} back ${diceValue} spaces`);
        break;
      }

      case 'get_points': {
        // フリーマンがポイントを奪取
        const pointsToGet = diceValue * 10;

        await this.supabase
          .from('game_players')
          .update({
            giver_points: event.overtaken_player.giver_points + pointsToGet,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.overtaken_player.id);

        console.log(
          `${event.overtaken_player.player_nickname} gained ${pointsToGet} points from overtake`
        );
        break;
      }

      case 'skip_turn': {
        // 1回休み
        await this.supabase
          .from('game_players')
          .update({
            is_skipping_turn: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', overtakingPlayerId);

        console.log(`${event.overtaking_player.player_nickname} will skip next turn`);
        break;
      }
    }

    // overtake_eventsテーブルに記録
    await this.supabase.from('overtake_events').insert({
      game_session_id: sessionId,
      overtaking_player_id: overtakingPlayerId,
      overtaken_player_id: event.overtaken_player.id,
      space_number: event.space_number,
      action_type: actionType,
      action_value: diceValue,
    });
  }

  /**
   * サポート実行（Sフリーマン→人間）
   * @param event 追い越しイベント
   * @param actionType サポートアクション
   * @param diceValue サイコロの値
   */
  async executeSupport(
    event: OvertakeEvent,
    actionType: SupportActionType,
    diceValue: number
  ): Promise<void> {
    if (!event.overtaking_player || !event.overtaken_player) {
      console.error('Support execution requires full player objects');
      return;
    }

    console.log(
      `Executing support: ${actionType} for ${event.overtaking_player.player_nickname}`
    );

    const overtakingPlayerId = event.overtaking_player.id;
    const sessionId = event.overtaking_player.game_session_id;

    switch (actionType) {
      case 'move_forward': {
        // 前進させる
        const newSpace = event.overtaking_player.current_space_number + diceValue;

        await this.supabase
          .from('game_players')
          .update({
            current_space_number: newSpace,
            updated_at: new Date().toISOString(),
          })
          .eq('id', overtakingPlayerId);

        console.log(`Moved ${event.overtaking_player.player_nickname} forward ${diceValue} spaces`);
        break;
      }

      case 'give_points': {
        // サポートポイント付与
        const pointsToGive = diceValue * 10;

        await this.supabase
          .from('game_players')
          .update({
            giver_points: event.overtaking_player.giver_points + pointsToGive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', overtakingPlayerId);

        console.log(
          `Gave ${pointsToGive} support points to ${event.overtaking_player.player_nickname}`
        );
        break;
      }

      case 'encourage': {
        // 激励メッセージ + 50ポイント
        const encouragePoints = 50;

        await this.supabase
          .from('game_players')
          .update({
            giver_points: event.overtaking_player.giver_points + encouragePoints,
            updated_at: new Date().toISOString(),
          })
          .eq('id', overtakingPlayerId);

        console.log(
          `Encouraged ${event.overtaking_player.player_nickname} with ${encouragePoints} points`
        );
        break;
      }
    }

    // overtake_eventsテーブルに記録
    await this.supabase.from('overtake_events').insert({
      game_session_id: sessionId,
      overtaking_player_id: overtakingPlayerId,
      overtaken_player_id: event.overtaken_player.id,
      space_number: event.space_number,
      action_type: actionType,
      action_value: actionType === 'encourage' ? 50 : diceValue,
    });
  }

  /**
   * フリーマン変化処理（D→S）
   * 人間プレイヤーがDフリーマンを追い越した時に呼び出される
   * @param freemanPlayer Dフリーマン
   */
  async transformFreeman(freemanPlayer: GamePlayer): Promise<void> {
    if (freemanPlayer.player_type !== 'freeman_d') {
      console.warn('Only D-Freeman can be transformed');
      return;
    }

    console.log(`Transforming ${freemanPlayer.player_nickname} from D to S type`);

    // Dフリーマン → Sフリーマンに変化
    await this.supabase
      .from('game_players')
      .update({
        player_type: 'freeman_s',
        freeman_type: 'support',
        player_nickname: 'Sフリーマン',
        player_color: '#10b981', // 緑色に変更
        updated_at: new Date().toISOString(),
      })
      .eq('id', freemanPlayer.id);

    console.log(`${freemanPlayer.player_nickname} transformed to S-Freeman`);
  }

  /**
   * 追い越しイベント履歴を取得
   * @param sessionId ゲームセッションID
   * @returns 追い越しイベントの配列
   */
  async getOvertakeHistory(sessionId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('overtake_events')
      .select(
        `
        *,
        overtaking_player:overtaking_player_id(*),
        overtaken_player:overtaken_player_id(*)
      `
      )
      .eq('game_session_id', sessionId)
      .order('occurred_at', { ascending: false });

    if (error) {
      console.error('Failed to get overtake history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * プレイヤーの追い越し統計を取得
   * @param playerId プレイヤーID
   * @returns 統計情報
   */
  async getPlayerOvertakeStats(playerId: string): Promise<{
    overtook: number;
    overtakenBy: number;
  }> {
    const { data: overtookData } = await this.supabase
      .from('overtake_events')
      .select('id', { count: 'exact', head: true })
      .eq('overtaking_player_id', playerId);

    const { data: overtakenData } = await this.supabase
      .from('overtake_events')
      .select('id', { count: 'exact', head: true })
      .eq('overtaken_player_id', playerId);

    return {
      overtook: overtookData ? 1 : 0, // count should be used properly
      overtakenBy: overtakenData ? 1 : 0,
    };
  }

  /**
   * 追い越しによる順位変動を計算
   * @param players 全プレイヤー
   * @returns 順位変動の情報
   */
  calculateRankChanges(players: GamePlayer[]): Map<string, { old: number; new: number }> {
    const rankChanges = new Map<string, { old: number; new: number }>();

    // 現在の順位を計算
    const sortedPlayers = [...players].sort((a, b) => b.total_points - a.total_points);

    sortedPlayers.forEach((player, index) => {
      const currentRank = index + 1;
      // TODO: 前回の順位を保存・取得する仕組みを実装
      rankChanges.set(player.id, { old: currentRank, new: currentRank });
    });

    return rankChanges;
  }
}
