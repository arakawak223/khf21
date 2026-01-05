/**
 * オンラインマルチプレイヤー対戦のルーム管理
 */

import { createClient } from '@/lib/supabase/client';

export interface GameRoom {
  id: string;
  room_code: string;
  room_name: string | null;
  host_user_id: string;
  status: 'waiting' | 'playing' | 'finished' | 'cancelled';
  max_players: number;
  current_players: number;
  game_settings: {
    destinationCount?: number;
    destinationLabel?: string;
    periodDays?: number; // 後方互換性のため残す
    periodName?: string; // 後方互換性のため残す
    includeFreeman: boolean;
    startingAirportId: string | null;
  };
  game_session_id: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  player_nickname: string;
  player_color: string;
  player_order: number;
  is_ready: boolean;
  is_host: boolean;
  connection_status: 'connected' | 'disconnected';
  last_ping_at: string;
  game_player_id: string | null;
  created_at: string;
  updated_at: string;
}

export class RoomManager {
  private supabase = createClient();

  /**
   * ルーム作成
   */
  async createRoom(
    hostUserId: string,
    hostNickname: string,
    roomName: string | null = null,
    gameSettings: Partial<GameRoom['game_settings']> = {}
  ): Promise<{ room: GameRoom; roomPlayer: RoomPlayer }> {
    // ユニークなルームコードを生成
    const roomCode = await this.generateUniqueRoomCode();

    // デフォルト設定
    const defaultSettings: GameRoom['game_settings'] = {
      destinationCount: 5,
      destinationLabel: '5箇所',
      includeFreeman: false,
      startingAirportId: null,
      ...gameSettings,
    };

    // ルームを作成
    const { data: room, error: roomError } = await this.supabase
      .from('game_rooms')
      .insert({
        room_code: roomCode,
        room_name: roomName,
        host_user_id: hostUserId,
        status: 'waiting',
        max_players: 4,
        current_players: 0,
        game_settings: defaultSettings,
      })
      .select()
      .single();

    if (roomError || !room) {
      throw new Error(`Failed to create room: ${roomError?.message}`);
    }

    // ホストをルームプレイヤーとして追加
    const { data: roomPlayer, error: playerError } = await this.supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        user_id: hostUserId,
        player_nickname: hostNickname,
        player_color: '#3b82f6', // 青
        player_order: 1,
        is_ready: false,
        is_host: true,
        connection_status: 'connected',
      })
      .select()
      .single();

    if (playerError || !roomPlayer) {
      throw new Error(`Failed to add host to room: ${playerError?.message}`);
    }

    console.log(`Room created: ${roomCode} by ${hostNickname}`);
    return { room, roomPlayer };
  }

  /**
   * ルームコードでルームに参加
   */
  async joinRoom(
    roomCode: string,
    userId: string,
    playerNickname: string
  ): Promise<{ room: GameRoom; roomPlayer: RoomPlayer }> {
    // ルームを取得
    const { data: room, error: roomError } = await this.supabase
      .from('game_rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .single();

    if (roomError || !room) {
      throw new Error('ルームが見つかりません');
    }

    // ルームの状態をチェック
    if (room.status !== 'waiting') {
      throw new Error('このルームは既にゲーム中またば終了しています');
    }

    // 定員チェック
    if (room.current_players >= room.max_players) {
      throw new Error('ルームが満員です');
    }

    // 既に参加しているかチェック
    const { data: existingPlayer } = await this.supabase
      .from('room_players')
      .select('*')
      .eq('room_id', room.id)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) {
      throw new Error('既にこのルームに参加しています');
    }

    // プレイヤーオーダーを決定（現在のプレイヤー数 + 1）
    const playerOrder = room.current_players + 1;

    // プレイヤーカラーを決定
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#f97316'];
    const playerColor = colors[playerOrder - 1] || colors[0];

    // ルームプレイヤーとして追加
    const { data: roomPlayer, error: playerError } = await this.supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        user_id: userId,
        player_nickname: playerNickname,
        player_color: playerColor,
        player_order: playerOrder,
        is_ready: false,
        is_host: false,
        connection_status: 'connected',
      })
      .select()
      .single();

    if (playerError || !roomPlayer) {
      throw new Error(`Failed to join room: ${playerError?.message}`);
    }

    console.log(`${playerNickname} joined room: ${roomCode}`);
    return { room, roomPlayer };
  }

  /**
   * ルームから退室
   */
  async leaveRoom(roomPlayerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('room_players')
      .delete()
      .eq('id', roomPlayerId);

    if (error) {
      throw new Error(`Failed to leave room: ${error.message}`);
    }

    console.log(`Player left room: ${roomPlayerId}`);
  }

  /**
   * ルームコードでルームを取得
   */
  async getRoomByCode(roomCode: string): Promise<GameRoom | null> {
    const { data, error } = await this.supabase
      .from('game_rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .single();

    if (error) {
      console.error('Failed to get room:', error);
      return null;
    }

    return data;
  }

  /**
   * ルームIDでルームを取得
   */
  async getRoomById(roomId: string): Promise<GameRoom | null> {
    const { data, error } = await this.supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Failed to get room:', error);
      return null;
    }

    return data;
  }

  /**
   * ルーム内のプレイヤーリストを取得
   */
  async getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
    const { data, error } = await this.supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .order('player_order', { ascending: true });

    if (error) {
      console.error('Failed to get room players:', error);
      return [];
    }

    return data || [];
  }

  /**
   * プレイヤーの準備状態を更新
   */
  async updatePlayerReady(roomPlayerId: string, isReady: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('room_players')
      .update({ is_ready: isReady })
      .eq('id', roomPlayerId);

    if (error) {
      throw new Error(`Failed to update ready status: ${error.message}`);
    }

    console.log(`Player ready status updated: ${roomPlayerId} -> ${isReady}`);
  }

  /**
   * 全プレイヤーが準備完了かチェック
   */
  async areAllPlayersReady(roomId: string): Promise<boolean> {
    const players = await this.getRoomPlayers(roomId);

    if (players.length < 2) {
      return false; // 最低2人必要
    }

    return players.every((p) => p.is_ready);
  }

  /**
   * ルームのステータスを更新
   */
  async updateRoomStatus(
    roomId: string,
    status: GameRoom['status']
  ): Promise<void> {
    const updates: any = { status };

    if (status === 'playing') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'finished') {
      updates.finished_at = new Date().toISOString();
    }

    const { error } = await this.supabase
      .from('game_rooms')
      .update(updates)
      .eq('id', roomId);

    if (error) {
      throw new Error(`Failed to update room status: ${error.message}`);
    }

    console.log(`Room status updated: ${roomId} -> ${status}`);
  }

  /**
   * ルームにゲームセッションIDを設定
   */
  async setRoomGameSession(roomId: string, gameSessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('game_rooms')
      .update({ game_session_id: gameSessionId })
      .eq('id', roomId);

    if (error) {
      throw new Error(`Failed to set game session: ${error.message}`);
    }

    console.log(`Room game session set: ${roomId} -> ${gameSessionId}`);
  }

  /**
   * ルームを削除
   */
  async deleteRoom(roomId: string): Promise<void> {
    const { error } = await this.supabase
      .from('game_rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }

    console.log(`Room deleted: ${roomId}`);
  }

  /**
   * プレイヤーの接続状態を更新（ハートビート）
   */
  async updatePlayerPing(roomPlayerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('room_players')
      .update({
        last_ping_at: new Date().toISOString(),
        connection_status: 'connected',
      })
      .eq('id', roomPlayerId);

    if (error) {
      console.error('Failed to update player ping:', error);
    }
  }

  /**
   * 切断されたプレイヤーを検出（60秒以上ピングがない）
   */
  async detectDisconnectedPlayers(roomId: string): Promise<RoomPlayer[]> {
    const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString();

    const { data, error } = await this.supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .lt('last_ping_at', sixtySecondsAgo);

    if (error) {
      console.error('Failed to detect disconnected players:', error);
      return [];
    }

    return data || [];
  }

  /**
   * ユニークなルームコードを生成
   */
  private async generateUniqueRoomCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // ユニークかチェック
      const { data } = await this.supabase
        .from('game_rooms')
        .select('id')
        .eq('room_code', code)
        .single();

      if (!data) {
        return code;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique room code');
  }
}
