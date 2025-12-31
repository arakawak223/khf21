/**
 * 追い越しイベントモーダル
 * 追い越し発生時の通知とアニメーション
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { OvertakeEvent } from '@/types/multiplayer.types';
import type { OvertakeActionType, SupportActionType } from '@/lib/game/freemanAI';

interface OvertakeModalProps {
  isOpen: boolean;
  event: OvertakeEvent | null;
  actionType?: OvertakeActionType | SupportActionType;
  actionValue?: number;
  encourageMessage?: string;
  onClose: () => void;
}

export function OvertakeModal({
  isOpen,
  event,
  actionType,
  actionValue,
  encourageMessage,
  onClose,
}: OvertakeModalProps) {
  if (!isOpen || !event || !event.overtaken_player || !event.overtaking_player) return null;

  // 型アサーション: この時点でnullチェック済み
  const safeEvent = event as Required<OvertakeEvent>;

  const isDefenseType = safeEvent.overtaken_player.player_type === 'freeman_d';
  const isSupportType = safeEvent.overtaken_player.player_type === 'freeman_s';

  const getTitle = (): string => {
    if (isDefenseType) {
      return '⚔️ フリーマンに追い越された！';
    } else if (isSupportType) {
      return '🤝 フリーマンがサポート！';
    }
    return '🏃 追い越し発生！';
  };

  const getActionMessage = (): string => {
    if (!actionType || !actionValue) return '';

    if (isDefenseType) {
      switch (actionType as OvertakeActionType) {
        case 'move_back':
          return `${actionValue}マス後退させられた！`;
        case 'get_points':
          return `${safeEvent.overtaken_player.player_nickname}に${actionValue * 10}ポイント奪われた！`;
        case 'skip_turn':
          return '次のターンは休み！';
        default:
          return '';
      }
    } else if (isSupportType) {
      switch (actionType as SupportActionType) {
        case 'move_forward':
          return `${actionValue}マス前進できた！`;
        case 'give_points':
          return `${actionValue * 10}ポイントもらった！`;
        case 'encourage':
          return `${encourageMessage || 'がんばれ！'}\n+${actionValue}ポイント！`;
        default:
          return '';
      }
    }

    return '';
  };

  const getBackgroundColor = (): string => {
    if (isDefenseType) {
      return 'from-red-600 to-red-700';
    } else if (isSupportType) {
      return 'from-green-600 to-green-700';
    }
    return 'from-blue-600 to-blue-700';
  };

  const getIcon = (): string => {
    if (isDefenseType) {
      return '🤖';
    } else if (isSupportType) {
      return '🤝';
    }
    return '🏃';
  };

  const getActionIcon = (): string => {
    if (!actionType) return '';

    if (isDefenseType) {
      switch (actionType as OvertakeActionType) {
        case 'move_back':
          return '⬅️';
        case 'get_points':
          return '💰';
        case 'skip_turn':
          return '😴';
        default:
          return '';
      }
    } else if (isSupportType) {
      switch (actionType as SupportActionType) {
        case 'move_forward':
          return '➡️';
        case 'give_points':
          return '💎';
        case 'encourage':
          return '💪';
        default:
          return '';
      }
    }

    return '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* メインカード */}
            <div className={`bg-gradient-to-br ${getBackgroundColor()} rounded-2xl shadow-2xl overflow-hidden`}>
              {/* ヘッダー */}
              <div className="bg-black/20 px-8 py-6 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2,
                    ease: 'easeInOut',
                  }}
                  className="text-8xl mb-4"
                >
                  {getIcon()}
                </motion.div>
                <h2 className="text-4xl font-black text-white drop-shadow-lg">
                  {getTitle()}
                </h2>
              </div>

              {/* コンテンツ */}
              <div className="px-8 py-10 text-center">
                {/* 追い越し情報 */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full border-4 border-white"
                        style={{ backgroundColor: safeEvent.overtaking_player.player_color }}
                      />
                      <span className="text-2xl font-bold text-white">
                        {safeEvent.overtaking_player.player_nickname}
                      </span>
                    </motion.div>

                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-4xl"
                    >
                      →
                    </motion.div>

                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-2xl font-bold text-white">
                        {safeEvent.overtaken_player.player_nickname}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full border-4 border-white"
                        style={{ backgroundColor: safeEvent.overtaken_player.player_color }}
                      />
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/90"
                  >
                    マス {safeEvent.space_number} で追い越しました！
                  </motion.p>
                </div>

                {/* アクション結果 */}
                {actionType && actionValue && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-8 border-4 border-white/30"
                  >
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <motion.span
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                        className="text-6xl"
                      >
                        {getActionIcon()}
                      </motion.span>
                    </div>

                    <p className="text-3xl font-black text-white whitespace-pre-line">
                      {getActionMessage()}
                    </p>

                    {/* Sフリーマンの変化通知 */}
                    {isDefenseType && safeEvent.overtaking_player.player_type === 'human' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 bg-green-500/30 border-2 border-green-300 rounded-lg p-4"
                      >
                        <p className="text-xl font-bold text-white flex items-center justify-center gap-2">
                          <span>✨</span>
                          <span>Dフリーマンが Sフリーマンに変化しました！</span>
                          <span>✨</span>
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* フッター */}
              <div className="bg-black/20 px-8 py-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-10 py-4 bg-white text-gray-900 rounded-xl font-bold text-xl shadow-lg hover:bg-gray-100 transition-colors"
                >
                  続ける
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 簡易版追い越し通知（トースト風）
 */
interface OvertakeToastProps {
  event: OvertakeEvent;
  onDismiss: () => void;
}

export function OvertakeToast({ event, onDismiss }: OvertakeToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-2xl p-4 max-w-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        <div className="flex-grow">
          <p className="font-bold text-white">
            {event.overtaking_player?.player_nickname || 'プレイヤー'} が {event.overtaken_player?.player_nickname || 'プレイヤー'} を追い越しました！
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-white hover:text-gray-200 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
