'use client';

import { useEffect, useState } from 'react';
import type { GameCard } from '@/types/strategy.types';

interface CardObtainedAnimationProps {
  card: GameCard;
  onClose: () => void;
  autoCloseDuration?: number;
}

export default function CardObtainedAnimation({
  card,
  onClose,
  autoCloseDuration = 3000,
}: CardObtainedAnimationProps) {
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

  // レアリティの背景グラデーション
  const getRarityGradient = (rarity: 1 | 2 | 3) => {
    switch (rarity) {
      case 1:
        return 'from-gray-400 to-gray-600'; // コモン
      case 2:
        return 'from-blue-400 to-blue-600'; // レア
      case 3:
        return 'from-purple-400 via-pink-500 to-yellow-500'; // 超レア
    }
  };

  // レアリティのエフェクト
  const getRarityEffect = (rarity: 1 | 2 | 3) => {
    switch (rarity) {
      case 1:
        return ''; // コモン - エフェクトなし
      case 2:
        return 'animate-pulse'; // レア - パルス
      case 3:
        return 'animate-bounce'; // 超レア - バウンス
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      {/* カード表示 */}
      <div
        className={`
          relative transform transition-all duration-500
          ${isVisible ? 'scale-100 rotate-0' : 'scale-50 rotate-180'}
        `}
      >
        {/* 背景エフェクト（超レアの場合） */}
        {card.rarity === 3 && (
          <div className="absolute -inset-8 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-full opacity-50 blur-xl animate-pulse" />
        )}

        {/* カード本体 */}
        <div
          className={`
            relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-80
            ${getRarityEffect(card.rarity)}
          `}
        >
          {/* 「NEW CARD」ラベル */}
          <div className="text-center mb-4">
            <div className={`inline-block bg-gradient-to-r ${getRarityGradient(card.rarity)} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg`}>
              🎉 NEW CARD! 🎉
            </div>
          </div>

          {/* カードアイコン */}
          <div className="text-center mb-4">
            <div className="text-7xl mb-2 animate-bounce">{card.icon}</div>
          </div>

          {/* カード名 */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {card.nameJa}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
          </div>

          {/* レアリティ */}
          <div className="text-center mb-4">
            <div className="text-3xl">
              {'⭐'.repeat(card.rarity)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {card.rarity === 1 && 'コモン'}
              {card.rarity === 2 && 'レア'}
              {card.rarity === 3 && '超レア！'}
            </div>
          </div>

          {/* クリックして閉じる */}
          <div className="text-center text-xs text-gray-500">
            タップして閉じる
          </div>
        </div>

        {/* キラキラエフェクト（レア以上） */}
        {card.rarity >= 2 && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 rounded-full animate-ping" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          </>
        )}
      </div>
    </div>
  );
}
