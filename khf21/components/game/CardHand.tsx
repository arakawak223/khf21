'use client';

import { useState } from 'react';
import type { GameCard, PlayerCard } from '@/types/strategy.types';
import { getCardById } from '@/lib/game/strategyData';
import { Button } from '@/components/ui/button';

interface CardHandProps {
  playerCards: PlayerCard[];
  isMyTurn: boolean;
  canUseCards: boolean;
  onUseCard: (cardId: string) => void;
}

export default function CardHand({
  playerCards,
  isMyTurn,
  canUseCards,
  onUseCard,
}: CardHandProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 未使用のカードのみ表示
  const unusedCards = playerCards.filter(pc => !pc.used);

  if (unusedCards.length === 0) {
    return null;
  }

  const handleCardClick = (cardId: string) => {
    if (!isMyTurn || !canUseCards) return;
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  const handleUseCard = (cardId: string) => {
    onUseCard(cardId);
    setExpandedCardId(null);
  };

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

  // カテゴリのカラー
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attack':
        return 'text-red-600 bg-red-100';
      case 'defense':
        return 'text-blue-600 bg-blue-100';
      case 'boost':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // カテゴリの日本語名
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'attack':
        return '攻撃';
      case 'defense':
        return '防御';
      case 'boost':
        return 'ブースト';
      default:
        return '';
    }
  };

  return (
    <>
      {/* カード手札表示（固定位置） */}
      <div className="fixed bottom-4 right-4 z-30">
        {/* 展開/折りたたみボタン */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🎴</span>
          <span className="font-bold">カード ({unusedCards.length})</span>
          <span className="text-sm">{isExpanded ? '▼' : '▲'}</span>
        </button>

        {/* カード一覧 */}
        {isExpanded && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              {unusedCards.map((playerCard, index) => {
                const card = getCardById(playerCard.cardId);
                if (!card) return null;

                const isExpanded = expandedCardId === card.id;

                return (
                  <div
                    key={`${playerCard.cardId}-${index}-${playerCard.obtainedAt}`}
                    className={`
                      relative rounded-lg p-3 cursor-pointer transition-all duration-300
                      ${isExpanded ? 'ring-2 ring-purple-500' : ''}
                      ${!isMyTurn || !canUseCards ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                    `}
                    onClick={() => handleCardClick(card.id)}
                  >
                    {/* カード背景グラデーション */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${getRarityGradient(card.rarity)} opacity-10`} />

                    {/* カード内容 */}
                    <div className="relative">
                      {/* ヘッダー */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{card.icon}</span>
                          <div>
                            <div className="font-bold text-sm">{card.nameJa}</div>
                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getCategoryColor(card.category)}`}>
                              {getCategoryName(card.category)}
                            </div>
                          </div>
                        </div>
                        {/* レアリティ星 */}
                        <div className="text-yellow-500">
                          {'⭐'.repeat(card.rarity)}
                        </div>
                      </div>

                      {/* 説明 */}
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {card.description}
                      </div>

                      {/* 使用ボタン（展開時のみ） */}
                      {isExpanded && isMyTurn && canUseCards && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseCard(card.id);
                          }}
                        >
                          使用する
                        </Button>
                      )}

                      {/* 使用不可メッセージ */}
                      {isExpanded && (!isMyTurn || !canUseCards) && (
                        <div className="text-xs text-center text-gray-500 py-2">
                          {!isMyTurn ? '自分のターンで使用できます' : 'このタイミングでは使用できません'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
