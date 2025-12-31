/**
 * フリーマン行動可視化コンポーネント
 * フリーマンの行動をアニメーションで表示
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { GamePlayer } from '@/types/multiplayer.types';

export type FreemanActionType =
  | 'selecting_destination'
  | 'rolling_dice'
  | 'selecting_experience'
  | 'selecting_overtake'
  | 'selecting_support'
  | 'moving'
  | 'idle';

interface FreemanActionProps {
  player: GamePlayer;
  actionType: FreemanActionType;
  message?: string;
}

export function FreemanAction({ player, actionType, message }: FreemanActionProps) {
  const getActionIcon = (): string => {
    switch (actionType) {
      case 'selecting_destination':
        return '🗺️';
      case 'rolling_dice':
        return '🎲';
      case 'selecting_experience':
        return '🎨';
      case 'selecting_overtake':
        return '⚔️';
      case 'selecting_support':
        return '🤝';
      case 'moving':
        return '✈️';
      case 'idle':
        return '💤';
      default:
        return '🤖';
    }
  };

  const getActionMessage = (): string => {
    if (message) return message;

    switch (actionType) {
      case 'selecting_destination':
        return `${player.player_nickname}が目的地を選んでいます...`;
      case 'rolling_dice':
        return `${player.player_nickname}がサイコロを振ります...`;
      case 'selecting_experience':
        return `${player.player_nickname}が体験を選んでいます...`;
      case 'selecting_overtake':
        return `${player.player_nickname}が追い越し行動を選んでいます...`;
      case 'selecting_support':
        return `${player.player_nickname}がサポート行動を選んでいます...`;
      case 'moving':
        return `${player.player_nickname}が移動中...`;
      case 'idle':
        return `${player.player_nickname}は待機中です`;
      default:
        return `${player.player_nickname}が考え中...`;
    }
  };

  const getBackgroundColor = (): string => {
    if (player.player_type === 'freeman_d') {
      return 'from-red-500 to-red-600';
    } else if (player.player_type === 'freeman_s') {
      return 'from-green-500 to-green-600';
    }
    return 'from-purple-500 to-purple-600';
  };

  if (actionType === 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto mb-4"
      >
        <div className={`bg-gradient-to-r ${getBackgroundColor()} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-center gap-4">
            {/* アイコンアニメーション */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-5xl"
            >
              {getActionIcon()}
            </motion.div>

            {/* メッセージ */}
            <div className="flex-grow">
              <p className="text-xl font-bold text-white text-center">
                {getActionMessage()}
              </p>
            </div>

            {/* 考え中アニメーション */}
            <motion.div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-3 h-3 bg-white rounded-full"
                />
              ))}
            </motion.div>
          </div>

          {/* プログレスバー */}
          <motion.div
            className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                ease: 'linear',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * フリーマン思考中インジケーター（シンプル版）
 */
interface FreemanThinkingProps {
  player: GamePlayer;
}

export function FreemanThinking({ player }: FreemanThinkingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-2xl"
      >
        ⚙️
      </motion.span>
      <span className="font-semibold">{player.player_nickname}が考え中...</span>
    </motion.div>
  );
}

/**
 * フリーマン行動完了通知
 */
interface FreemanActionCompleteProps {
  player: GamePlayer;
  actionType: FreemanActionType;
  result?: string | number;
}

export function FreemanActionComplete({ player, actionType, result }: FreemanActionCompleteProps) {
  const getMessage = (): string => {
    switch (actionType) {
      case 'selecting_destination':
        return `${player.player_nickname}が目的地を決定しました！`;
      case 'rolling_dice':
        return `${player.player_nickname}がサイコロを振りました！`;
      case 'selecting_experience':
        return `${player.player_nickname}が体験を選びました！`;
      default:
        return `${player.player_nickname}の行動が完了しました！`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-bold">{getMessage()}</p>
          {result && (
            <p className="text-sm text-white/90 mt-1">
              結果: <strong>{result}</strong>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
