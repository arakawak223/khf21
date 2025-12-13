'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { GameSession, Airport } from '@/types/database.types';

interface GameContextType {
  gameSession: GameSession | null;
  currentAirport: Airport | null;
  isLoading: boolean;
  error: string | null;

  // ゲームセッション操作
  setGameSession: (session: GameSession | null) => void;
  setCurrentAirport: (airport: Airport | null) => void;
  updatePoints: (impressedPoints: number, giverPoints: number) => void;
  updateElapsedDays: (days: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSessionState] = useState<GameSession | null>(null);
  const [currentAirport, setCurrentAirportState] = useState<Airport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const updateElapsedDays = useCallback((days: number) => {
    setGameSessionState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        elapsed_days: prev.elapsed_days + days,
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
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameSession,
        currentAirport,
        isLoading,
        error,
        setGameSession,
        setCurrentAirport,
        updatePoints,
        updateElapsedDays,
        setLoading,
        setError: setErrorCallback,
        resetGame,
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
