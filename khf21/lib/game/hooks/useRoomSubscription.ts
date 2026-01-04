/**
 * Supabase Realtimeを使ったルーム変更の監視フック
 */

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { GameRoom, RoomPlayer } from '../roomManager';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRoomSubscription(roomId: string | null) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // ルームとプレイヤーの初期データを取得
  const fetchRoomData = useCallback(async () => {
    if (!roomId) {
      setIsLoading(false);
      return;
    }

    try {
      // ルーム情報を取得
      const { data: roomData, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);

      // プレイヤー情報を取得
      const { data: playersData, error: playersError } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', roomId)
        .order('player_order', { ascending: true });

      if (playersError) throw playersError;
      setPlayers(playersData || []);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch room data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) return;

    fetchRoomData();

    // Realtimeチャンネルを作成
    let roomChannel: RealtimeChannel | null = null;
    let playersChannel: RealtimeChannel | null = null;

    try {
      // ルーム変更の監視
      roomChannel = supabase
        .channel(`room:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'game_rooms',
            filter: `id=eq.${roomId}`,
          },
          (payload) => {
            console.log('Room updated:', payload);
            if (payload.eventType === 'UPDATE' && payload.new) {
              setRoom(payload.new as GameRoom);
            } else if (payload.eventType === 'DELETE') {
              setRoom(null);
              setError('ルームが削除されました');
            }
          }
        )
        .subscribe();

      // プレイヤー変更の監視
      playersChannel = supabase
        .channel(`room_players:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'room_players',
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            console.log('Players updated:', payload);

            if (payload.eventType === 'INSERT' && payload.new) {
              // 新しいプレイヤーが参加
              setPlayers((prev) => {
                const exists = prev.some((p) => p.id === payload.new.id);
                if (exists) return prev;
                return [...prev, payload.new as RoomPlayer].sort(
                  (a, b) => a.player_order - b.player_order
                );
              });
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              // プレイヤー情報が更新
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === payload.new.id ? (payload.new as RoomPlayer) : p
                )
              );
            } else if (payload.eventType === 'DELETE' && payload.old) {
              // プレイヤーが退出
              setPlayers((prev) => prev.filter((p) => p.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      console.log(`Subscribed to room: ${roomId}`);
    } catch (err) {
      console.error('Failed to subscribe to room:', err);
      setError('リアルタイム接続に失敗しました');
    }

    // クリーンアップ
    return () => {
      if (roomChannel) {
        supabase.removeChannel(roomChannel);
        console.log(`Unsubscribed from room: ${roomId}`);
      }
      if (playersChannel) {
        supabase.removeChannel(playersChannel);
        console.log(`Unsubscribed from room_players: ${roomId}`);
      }
    };
  }, [roomId, supabase, fetchRoomData]);

  return {
    room,
    players,
    isLoading,
    error,
    refetch: fetchRoomData,
  };
}
