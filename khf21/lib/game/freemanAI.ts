/**
 * フリーマンAIロジック
 * フリーマンの自動行動を制御
 */

import { createClient } from '@/lib/supabase/client';
import type { GamePlayer } from '@/types/multiplayer.types';
import type { Airport, Attraction, Art, Gourmet } from '@/types/database.types';

export type OvertakeActionType = 'move_back' | 'get_points' | 'skip_turn';
export type SupportActionType = 'move_forward' | 'give_points' | 'encourage';
export type ExperienceType = 'attraction' | 'art' | 'gourmet';

export class FreemanAI {
  private supabase = createClient();

  /**
   * 目的地を自動選択
   * 戦略: 未訪問の空港をランダムに選択、全て訪問済みの場合は最遠地を選択
   * @param player フリーマンプレイヤー
   * @param airports 選択可能な空港リスト
   * @param visitedIds 訪問済み空港IDリスト
   * @returns 選択された空港
   */
  async selectDestination(
    player: GamePlayer,
    airports: Airport[],
    visitedIds: string[]
  ): Promise<Airport> {
    console.log(`AI: Selecting destination for ${player.player_nickname}`);

    // 未訪問の空港をフィルタリング
    const unvisitedAirports = airports.filter(
      (airport) => !visitedIds.includes(airport.id)
    );

    if (unvisitedAirports.length > 0) {
      // 未訪問の空港からランダムに選択
      const randomIndex = Math.floor(Math.random() * unvisitedAirports.length);
      const selected = unvisitedAirports[randomIndex];

      console.log(`AI: Selected unvisited airport - ${selected.name}`);
      return selected;
    }

    // 全て訪問済みの場合は、現在位置から最も遠い空港を選択
    if (player.current_airport_id) {
      const currentAirport = airports.find((a) => a.id === player.current_airport_id);

      if (currentAirport) {
        let farthestAirport = airports[0];
        let maxDistance = 0;

        for (const airport of airports) {
          if (airport.id === player.current_airport_id) continue;

          const distance = this.calculateDistance(
            currentAirport.latitude,
            currentAirport.longitude,
            airport.latitude,
            airport.longitude
          );

          if (distance > maxDistance) {
            maxDistance = distance;
            farthestAirport = airport;
          }
        }

        console.log(`AI: Selected farthest airport - ${farthestAirport.name}`);
        return farthestAirport;
      }
    }

    // フォールバック: ランダムに選択
    const randomIndex = Math.floor(Math.random() * airports.length);
    return airports[randomIndex];
  }

  /**
   * サイコロを自動実行
   * 純粋なランダム（1-6）
   * @returns サイコロの結果（1-6）
   */
  async rollDice(): Promise<number> {
    // 1-2秒待機（考え中の演出）
    await this.delay(1000 + Math.random() * 1000);

    const result = Math.floor(Math.random() * 6) + 1;
    console.log(`AI: Rolled dice - ${result}`);

    return result;
  }

  /**
   * 体験を自動選択
   * 戦略: ポイントが最も高いものを選択
   * @param attraction 名所
   * @param art アート
   * @param gourmet グルメ
   * @returns 選択された体験タイプ
   */
  async selectExperience(
    attraction: Attraction | null,
    art: Art | null,
    gourmet: Gourmet | null
  ): Promise<ExperienceType> {
    console.log('AI: Selecting experience...');

    // 各体験のポイントを取得
    const attractionPoints = attraction?.impressed_points || 0;
    const artPoints = art?.impressed_points || 0; // Artもimpressed_pointsを使用
    const gourmetPoints = gourmet?.impressed_points || 0;

    // 最も高いポイントの体験を選択
    const maxPoints = Math.max(attractionPoints, artPoints, gourmetPoints);

    if (attractionPoints === maxPoints && attraction) {
      console.log(`AI: Selected attraction - ${attraction.name} (${attractionPoints} pts)`);
      return 'attraction';
    } else if (artPoints === maxPoints && art) {
      console.log(`AI: Selected art - ${art.name} (${artPoints} pts)`);
      return 'art';
    } else if (gourmetPoints === maxPoints && gourmet) {
      console.log(`AI: Selected gourmet - ${gourmet.name} (${gourmetPoints} pts)`);
      return 'gourmet';
    }

    // フォールバック: ランダムに選択
    const options: ExperienceType[] = [];
    if (attraction) options.push('attraction');
    if (art) options.push('art');
    if (gourmet) options.push('gourmet');

    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
    }

    // デフォルト
    return 'attraction';
  }

  /**
   * 追い越し行動を選択（Dフリーマン）
   * 戦略: ランダムまたは戦略的
   * @param diceValue サイコロの値（ペナルティの計算に使用）
   * @returns 選択されたアクション
   */
  async selectOvertakeAction(diceValue: number): Promise<OvertakeActionType> {
    console.log('AI (Defense): Selecting overtake action...');

    // 少し待機（考え中の演出）
    await this.delay(500 + Math.random() * 500);

    // 戦略的選択（ポイント差が大きい場合はポイント奪取を優先）
    const random = Math.random();

    if (random < 0.4) {
      // 40%: 後退させる
      console.log(`AI: Selected move_back (${diceValue} spaces)`);
      return 'move_back';
    } else if (random < 0.7) {
      // 30%: ポイント獲得
      console.log(`AI: Selected get_points (${diceValue * 10} pts)`);
      return 'get_points';
    } else {
      // 30%: 1回休み
      console.log('AI: Selected skip_turn');
      return 'skip_turn';
    }
  }

  /**
   * サポート行動を選択（Sフリーマン）
   * 戦略: ランダムまたは戦略的
   * @param diceValue サイコロの値（サポートの計算に使用）
   * @returns 選択されたアクション
   */
  async selectSupportAction(diceValue: number): Promise<SupportActionType> {
    console.log('AI (Support): Selecting support action...');

    // 少し待機（考え中の演出）
    await this.delay(500 + Math.random() * 500);

    const random = Math.random();

    if (random < 0.4) {
      // 40%: 前進させる
      console.log(`AI: Selected move_forward (${diceValue} spaces)`);
      return 'move_forward';
    } else if (random < 0.7) {
      // 30%: ポイント付与
      console.log(`AI: Selected give_points (${diceValue * 10} pts)`);
      return 'give_points';
    } else {
      // 30%: 激励メッセージ
      console.log('AI: Selected encourage (50 pts)');
      return 'encourage';
    }
  }

  /**
   * AI行動の難易度調整
   * 難易度に応じて選択を変更（将来の拡張用）
   * @param difficulty 難易度（'easy' | 'normal' | 'hard'）
   */
  setDifficulty(difficulty: 'easy' | 'normal' | 'hard') {
    // 将来的に難易度に応じてAIの挙動を変更
    console.log(`AI difficulty set to: ${difficulty}`);
  }

  /**
   * 2点間の距離を計算（Haversine formula）
   * @param lat1 地点1の緯度
   * @param lon1 地点1の経度
   * @param lat2 地点2の緯度
   * @param lon2 地点2の経度
   * @returns 距離（km）
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球の半径（km）
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * 度をラジアンに変換
   */
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 遅延処理（演出用）
   * @param ms ミリ秒
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * ランダムな激励メッセージを取得
   * @returns 激励メッセージ
   */
  getEncourageMessage(): string {
    const messages = [
      'がんばれ！きっとうまくいくよ！',
      'あなたならできる！',
      '素晴らしい旅を続けて！',
      '次の目的地も楽しもう！',
      'その調子で進もう！',
      '良い旅を！',
      '応援してるよ！',
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }
}
