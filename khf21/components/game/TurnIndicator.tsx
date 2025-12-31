/**
 * ターン表示コンポーネント
 * 現在のターンプレイヤーを表示
 */

'use client';

import { motion } from 'framer-motion';
import type { GamePlayer } from '@/types/multiplayer.types';

interface TurnIndicatorProps {
  currentTurnPlayer: GamePlayer | null;
  isHumanTurn: boolean;
}

export function TurnIndicator({ currentTurnPlayer, isHumanTurn }: TurnIndicatorProps) {
  if (!currentTurnPlayer) {
    return null;
  }

  const getPlayerTypeLabel = (playerType: string): string => {
    switch (playerType) {
      case 'human':
        return 'あなた';
      case 'freeman_d':
        return 'Dフリーマン';
      case 'freeman_s':
        return 'Sフリーマン';
      default:
        return 'プレイヤー';
    }
  };

  const getTurnMessage = (): string => {
    if (isHumanTurn) {
      return 'あなたのターンです';
    } else if (currentTurnPlayer.player_type === 'freeman_d') {
      return 'Dフリーマンのターンです';
    } else if (currentTurnPlayer.player_type === 'freeman_s') {
      return 'Sフリーマンのターンです';
    }
    return `${currentTurnPlayer.player_nickname}のターンです`;
  };

  const getBackgroundColor = (): string => {
    if (isHumanTurn) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    } else if (currentTurnPlayer.player_type === 'freeman_d') {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    } else if (currentTurnPlayer.player_type === 'freeman_s') {
      return 'bg-gradient-to-r from-green-500 to-green-600';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getIcon = (): string => {
    if (isHumanTurn) {
      return '👤';
    } else if (currentTurnPlayer.player_type === 'freeman_d') {
      return '🤖';
    } else if (currentTurnPlayer.player_type === 'freeman_s') {
      return '🤝';
    }
    return '🎮';
  };

  // 休み状態のチェック
  if (currentTurnPlayer.is_skipping_turn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto mb-2"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-md p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">😴</span>
            <h2 className="text-sm font-bold text-white">
              {currentTurnPlayer.player_nickname}は休み中...
            </h2>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-2"
    >
      <div className={`${getBackgroundColor()} rounded-lg shadow-md p-2 text-center`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">{getIcon()}</span>
          <h2 className="text-sm font-bold text-white">
            {getTurnMessage()}
          </h2>
          <span className="text-white/70 text-xs">|</span>
          <span className="text-white text-sm font-semibold">
            {currentTurnPlayer.total_points}pt
          </span>
          {currentTurnPlayer.current_space_number > 0 && (
            <>
              <span className="text-white/70 text-xs">|</span>
              <span className="text-white text-xs">
                マス {currentTurnPlayer.current_space_number}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
