'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  emoji?: string;
  children: ReactNode;
  points?: {
    impressed?: number;
    giver?: number;
  };
  closeButtonText?: string;
  showPoints?: boolean;
  isWorldHeritage?: boolean; // 世界遺産フラグ
}

export default function EventModal({
  isOpen,
  onClose,
  title,
  subtitle,
  imageUrl,
  emoji,
  children,
  points,
  closeButtonText = '次へ',
  showPoints = true,
  isWorldHeritage = false,
}: EventModalProps) {
  if (!isOpen) return null;

  // 世界遺産の場合は画像を大きく表示
  const imageHeight = isWorldHeritage ? 'h-64 md:h-80' : 'h-32';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up shadow-2xl">
        <div className="p-4 space-y-2">
          {/* ヘッダー */}
          <div className="text-center space-y-1">
            {emoji && !imageUrl && <div className="text-4xl">{emoji}</div>}
            {imageUrl && (
              <div className={`w-full ${imageHeight} relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg`}>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* 世界遺産バッジをオーバーレイ */}
                {isWorldHeritage && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span>🏆</span>
                    <span>世界遺産</span>
                  </div>
                )}
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* コンテンツ */}
          <div className="text-sm leading-snug">
            {children}
          </div>

          {/* ポイント表示 */}
          {showPoints && points && (points.impressed || points.giver) && (
            <div className="bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-900/20 dark:to-green-900/20 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
                獲得ポイント
              </p>
              <div className="flex justify-center gap-4">
                {points.impressed !== undefined && points.impressed !== 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400">
                        感動体験
                      </p>
                      <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                        {points.impressed > 0 ? '+' : ''}
                        {points.impressed}
                      </p>
                    </div>
                  </div>
                )}
                {points.giver !== undefined && points.giver !== 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎁</span>
                    <div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400">
                        喜び提供
                      </p>
                      <p className="text-base font-bold text-green-600 dark:text-green-400">
                        {points.giver > 0 ? '+' : ''}
                        {points.giver}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 閉じるボタン */}
          <Button
            onClick={onClose}
            size="default"
            className="w-full touch-target text-base font-bold py-3"
          >
            {closeButtonText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
