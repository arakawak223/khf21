'use client';

import { useEffect, useState } from 'react';
import type { SpaceType } from '@/types/strategy.types';

interface SpaceEffectNotificationProps {
  spaceType: SpaceType;
  message: string;
  icon?: string;
  onClose: () => void;
  autoCloseDuration?: number; // ミリ秒（デフォルト: 3000）
}

export default function SpaceEffectNotification({
  spaceType,
  message,
  icon,
  onClose,
  autoCloseDuration = 3000,
}: SpaceEffectNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // マウント時にアニメーション開始
    setTimeout(() => setIsVisible(true), 10);

    // 自動クローズ
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // フェードアウト後にクローズ
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  // スペースタイプ別の背景色
  const getBackgroundColor = () => {
    switch (spaceType) {
      case 'card':
        return 'from-purple-500 to-pink-500';
      case 'bonus':
        return 'from-yellow-400 to-orange-500';
      case 'event':
        return 'from-blue-400 to-cyan-500';
      case 'trap':
        return 'from-red-500 to-pink-600';
      case 'warp':
        return 'from-green-400 to-emerald-500';
      case 'safe':
        return 'from-cyan-400 to-blue-500';
      case 'lucky':
        return 'from-pink-400 to-rose-500';
      case 'mission':
        return 'from-orange-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // アイコンのデフォルト
  const getDefaultIcon = () => {
    switch (spaceType) {
      case 'card': return '🎴';
      case 'bonus': return '💎';
      case 'event': return '⭐';
      case 'trap': return '💣';
      case 'warp': return '🌀';
      case 'safe': return '🛡️';
      case 'lucky': return '🍀';
      case 'mission': return '🎯';
      default: return '⚪';
    }
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* 通知カード */}
      <div
        className={`
          relative z-10
          transform transition-all duration-300
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}
        `}
      >
        <div
          className={`
            bg-gradient-to-br ${getBackgroundColor()}
            rounded-2xl shadow-2xl p-8 min-w-[300px] max-w-md
            border-4 border-white
          `}
        >
          {/* アイコン */}
          <div className="flex justify-center mb-4">
            <div className="text-7xl animate-bounce">
              {displayIcon}
            </div>
          </div>

          {/* メッセージ */}
          <div className="text-center text-white">
            <p className="text-2xl font-bold whitespace-pre-line leading-relaxed drop-shadow-lg">
              {message}
            </p>
          </div>

          {/* タップして閉じるヒント */}
          <div className="mt-6 text-center text-white/80 text-sm">
            タップして閉じる
          </div>
        </div>

        {/* キラキラエフェクト */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s',
              }}
            >
              <span className="text-2xl opacity-50">✨</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
