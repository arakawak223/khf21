'use client';

import { useEffect, useState } from 'react';
import type { Mission } from '@/types/strategy.types';

interface MissionCompletedAnimationProps {
  mission: Mission;
  onClose: () => void;
  autoCloseDuration?: number;
}

export default function MissionCompletedAnimation({
  mission,
  onClose,
  autoCloseDuration = 4000,
}: MissionCompletedAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // アニメーション開始
    setTimeout(() => setIsVisible(true), 100);

    // 自動クローズ
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      {/* ミッション達成表示 */}
      <div
        className={`
          relative transform transition-all duration-500
          ${isVisible ? 'scale-100' : 'scale-0'}
        `}
      >
        {/* 背景エフェクト */}
        <div className="absolute -inset-12 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-full opacity-30 blur-3xl animate-pulse" />

        {/* メイン表示 */}
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-10 w-96 border-4 border-yellow-400">
          {/* 「MISSION COMPLETE」ヘッダー */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              MISSION
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              COMPLETE!
            </div>
          </div>

          {/* ミッション情報 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border-2 border-yellow-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{mission.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {mission.nameJa}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mission.description}
                </p>
              </div>
            </div>

            {/* 難易度 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">難易度:</span>
              <div className="text-2xl">
                {'⭐'.repeat(mission.difficulty)}
              </div>
            </div>
          </div>

          {/* 報酬 */}
          <div className="space-y-3">
            <div className="text-center text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
              🎁 報酬
            </div>

            {mission.rewardPoints > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl p-4 flex items-center justify-between border-2 border-yellow-400">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">💰</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    ポイント
                  </span>
                </div>
                <div className="text-3xl font-bold text-yellow-600">
                  +{mission.rewardPoints}
                </div>
              </div>
            )}

            {mission.rewardCards && mission.rewardCards > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 flex items-center justify-between border-2 border-purple-400">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🎴</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    カード
                  </span>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  +{mission.rewardCards}枚
                </div>
              </div>
            )}
          </div>

          {/* クリックして閉じる */}
          <div className="text-center text-xs text-gray-500 mt-6">
            タップして閉じる
          </div>
        </div>

        {/* キラキラエフェクト */}
        <div className="absolute top-0 left-0 w-6 h-6 bg-yellow-300 rounded-full animate-ping" />
        <div className="absolute top-10 right-0 w-4 h-4 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-10 left-10 w-5 h-5 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-0 right-10 w-6 h-6 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-1/2 left-0 w-4 h-4 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 right-0 w-5 h-5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
