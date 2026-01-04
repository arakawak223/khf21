'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RoomManager } from '@/lib/game/roomManager';
import { useRoomSubscription } from '@/lib/game/hooks/useRoomSubscription';
import { useHeartbeat } from '@/lib/game/hooks/useHeartbeat';
import type { Airport } from '@/types/database.types';
import MultiplayerModeSelect from './MultiplayerModeSelect';
import CreateRoomScreen from './CreateRoomScreen';
import JoinRoomScreen from './JoinRoomScreen';
import RoomLobby from './RoomLobby';

type ScreenState = 'select' | 'create' | 'join' | 'lobby';

interface MultiplayerFlowProps {
  airports: Airport[];
  onGameStart: (settings: {
    periodDays: number;
    periodName: string;
    startingAirportId: string;
    roomId: string;
    players: any[];
  }) => void;
  onBack: () => void;
}

export default function MultiplayerFlow({
  airports,
  onGameStart,
  onBack,
}: MultiplayerFlowProps) {
  const [screen, setScreen] = useState<ScreenState>('select');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomPlayerId, setRoomPlayerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomManager = new RoomManager();
  const supabase = createClient();

  // リアルタイムでルーム情報を監視
  const { room, players, isLoading: roomLoading } = useRoomSubscription(roomId);

  // ハートビートを送信（接続維持）
  useHeartbeat(roomPlayerId);

  // ユーザーIDを取得
  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const id = user?.id || `guest-${Date.now()}`;
      setUserId(id);
    };
    initUser();
  }, [supabase]);

  // ルーム作成
  const handleCreateRoom = async (settings: {
    roomName: string;
    playerNickname: string;
    periodDays: number;
    periodName: string;
    startingAirportId: string;
    maxPlayers: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { room, roomPlayer } = await roomManager.createRoom(
        userId,
        settings.playerNickname,
        settings.roomName,
        {
          periodDays: settings.periodDays,
          periodName: settings.periodName,
          startingAirportId: settings.startingAirportId,
          includeFreeman: false,
        }
      );

      setRoomId(room.id);
      setRoomPlayerId(roomPlayer.id);
      setScreen('lobby');
      console.log('Room created:', room.room_code);
    } catch (err) {
      console.error('Failed to create room:', err);
      setError(err instanceof Error ? err.message : 'ルームの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ルーム参加
  const handleJoinRoom = async (roomCode: string, playerNickname: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { room, roomPlayer } = await roomManager.joinRoom(
        roomCode,
        userId,
        playerNickname
      );

      setRoomId(room.id);
      setRoomPlayerId(roomPlayer.id);
      setScreen('lobby');
      console.log('Joined room:', room.room_code);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError(err instanceof Error ? err.message : 'ルームへの参加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 準備状態の変更
  const handleReady = async (isReady: boolean) => {
    if (!roomPlayerId) return;

    try {
      await roomManager.updatePlayerReady(roomPlayerId, isReady);
      console.log('Ready status updated:', isReady);
    } catch (err) {
      console.error('Failed to update ready status:', err);
      setError('準備状態の更新に失敗しました');
    }
  };

  // ゲーム開始
  const handleStartGame = async () => {
    if (!room || !roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 全員が準備完了かチェック
      const allReady = await roomManager.areAllPlayersReady(roomId);
      if (!allReady) {
        setError('全員が準備完了していません');
        setIsLoading(false);
        return;
      }

      // ルームのステータスを「playing」に更新
      await roomManager.updateRoomStatus(roomId, 'playing');

      console.log('Starting game with settings:', room.game_settings);

      // ゲームを開始
      onGameStart({
        periodDays: room.game_settings.periodDays,
        periodName: room.game_settings.periodName,
        startingAirportId: room.game_settings.startingAirportId || '',
        roomId: room.id,
        players: players,
      });
    } catch (err) {
      console.error('Failed to start game:', err);
      setError('ゲームの開始に失敗しました');
      setIsLoading(false);
    }
  };

  // 退室
  const handleLeaveRoom = async () => {
    if (!roomPlayerId) return;

    try {
      await roomManager.leaveRoom(roomPlayerId);
      setRoomId(null);
      setRoomPlayerId(null);
      setScreen('select');
      console.log('Left room');
    } catch (err) {
      console.error('Failed to leave room:', err);
      setError('退室に失敗しました');
    }
  };

  // 画面レンダリング
  if (screen === 'select') {
    return (
      <MultiplayerModeSelect
        onCreateRoom={() => setScreen('create')}
        onJoinRoom={() => setScreen('join')}
        onBack={onBack}
      />
    );
  }

  if (screen === 'create') {
    return (
      <CreateRoomScreen
        airports={airports}
        onCreateRoom={handleCreateRoom}
        onBack={() => setScreen('select')}
        isLoading={isLoading}
      />
    );
  }

  if (screen === 'join') {
    return (
      <JoinRoomScreen
        onJoinRoom={handleJoinRoom}
        onBack={() => setScreen('select')}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (screen === 'lobby' && room) {
    return (
      <RoomLobby
        room={room}
        players={players}
        currentUserId={userId}
        onReady={handleReady}
        onStartGame={handleStartGame}
        onLeaveRoom={handleLeaveRoom}
        isStarting={isLoading}
      />
    );
  }

  return null;
}
