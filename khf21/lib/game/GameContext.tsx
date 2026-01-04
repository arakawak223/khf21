'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { GameSession, Airport } from '@/types/database.types';
import type { GamePlayer } from '@/types/multiplayer.types';
import { TurnManager } from './turnManager';

interface GameContextType {
  gameSession: GameSession | null;
  currentAirport: Airport | null;
  isLoading: boolean;
  error: string | null;

  // 複数プレイヤー対応
  players: GamePlayer[];
  currentTurnPlayer: GamePlayer | null;

  // ゲームセッション操作
  setGameSession: (session: GameSession | null) => void;
  setCurrentAirport: (airport: Airport | null) => void;
  updatePoints: (impressedPoints: number, giverPoints: number) => void;
  updateElapsedDays: (days: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;

  // プレイヤー管理
  setPlayers: (players: GamePlayer[] | ((prev: GamePlayer[]) => GamePlayer[])) => void;
  setCurrentTurnPlayer: (player: GamePlayer | null) => void;
  updatePlayer: (playerId: string, updates: Partial<GamePlayer>) => void;

  // ターン管理
  endTurn: () => Promise<void>;
  startTurn: () => Promise<GamePlayer>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSessionState] = useState<GameSession | null>(null);
  const [currentAirport, setCurrentAirportState] = useState<Airport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 複数プレイヤー対応
  const [players, setPlayersState] = useState<GamePlayer[]>([]);
  const [currentTurnPlayer, setCurrentTurnPlayerState] = useState<GamePlayer | null>(null);

  const turnManager = new TurnManager();

  const setGameSession = useCallback((session: GameSession | null) => {
    setGameSessionState(session);
  }, []);

  const setCurrentAirport = useCallback((airport: Airport | null) => {
    setCurrentAirportState(airport);
  }, []);

  const updatePoints = useCallback((impressedPoints: number, giverPoints: number) => {
    setGameSessionState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        impressed_points: prev.impressed_points + impressedPoints,
        giver_points: prev.giver_points + giverPoints,
        total_points: prev.total_points + impressedPoints + giverPoints,
      };
    });
  }, []);

  const updateElapsedDays = useCallback(async (days: number) => {
    console.log(`[GameContext] updateElapsedDays called with ${days} days`);

    setGameSessionState((prev) => {
      if (!prev) {
        console.log('[GameContext] updateElapsedDays: No game session, skipping');
        return prev;
      }

      const newElapsedDays = prev.elapsed_days + days;
      console.log(`[GameContext] updateElapsedDays: ${prev.elapsed_days} → ${newElapsedDays} days`);

      // データベースに保存（非同期で実行）
      const saveToDatabase = async () => {
        // ゲストセッションの場合はデータベース保存をスキップ
        if (prev.id.startsWith('guest-session-')) {
          console.log(`[GameContext] Skipping database save for guest session: ${prev.id}`);
          return;
        }

        try {
          console.log(`[GameContext] Attempting to save elapsed_days for session: ${prev.id}`);

          // 認証状態を確認
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          console.log(`[GameContext] Current user:`, user?.id || 'Not authenticated');

          const { updateGameSession } = await import('./api');
          await updateGameSession(prev.id, {
            elapsed_days: newElapsedDays,
          });
          console.log(`[GameContext] elapsed_days saved to database: ${newElapsedDays}`);
        } catch (error) {
          console.error('[GameContext] Failed to save elapsed_days to database:', error);
          console.error('[GameContext] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            raw: error,
          });
        }
      };

      // データベース保存を実行（await不要、バックグラウンドで実行）
      saveToDatabase();

      return {
        ...prev,
        elapsed_days: newElapsedDays,
      };
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorCallback = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const resetGame = useCallback(() => {
    setGameSessionState(null);
    setCurrentAirportState(null);
    setError(null);
    setPlayersState([]);
    setCurrentTurnPlayerState(null);
  }, []);

  // プレイヤー管理
  const setPlayers = useCallback((newPlayers: GamePlayer[] | ((prev: GamePlayer[]) => GamePlayer[])) => {
    if (typeof newPlayers === 'function') {
      setPlayersState(newPlayers);
    } else {
      setPlayersState(newPlayers);
    }
  }, []);

  const setCurrentTurnPlayer = useCallback((player: GamePlayer | null) => {
    setCurrentTurnPlayerState(player);
  }, []);

  const updatePlayer = useCallback((playerId: string, updates: Partial<GamePlayer>) => {
    setPlayersState((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  }, []);

  // ターン管理
  const endTurn = useCallback(async () => {
    if (!gameSession?.id) {
      throw new Error('No active game session');
    }

    try {
      await turnManager.endTurn(gameSession.id);

      // 次のターンプレイヤーを取得して設定
      const nextPlayer = await turnManager.startTurn(gameSession.id);
      setCurrentTurnPlayerState(nextPlayer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end turn';
      setError(errorMessage);
      throw err;
    }
  }, [gameSession?.id, turnManager]);

  const startTurn = useCallback(async (): Promise<GamePlayer> => {
    if (!gameSession?.id) {
      throw new Error('No active game session');
    }

    try {
      const player = await turnManager.startTurn(gameSession.id);
      setCurrentTurnPlayerState(player);
      return player;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start turn';
      setError(errorMessage);
      throw err;
    }
  }, [gameSession?.id, turnManager]);

  return (
    <GameContext.Provider
      value={{
        gameSession,
        currentAirport,
        isLoading,
        error,
        players,
        currentTurnPlayer,
        setGameSession,
        setCurrentAirport,
        updatePoints,
        updateElapsedDays,
        setLoading,
        setError: setErrorCallback,
        resetGame,
        setPlayers,
        setCurrentTurnPlayer,
        updatePlayer,
        endTurn,
        startTurn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
