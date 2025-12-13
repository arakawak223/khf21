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
}: EventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up shadow-2xl">
        <div className="p-6 space-y-4">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            {emoji && <div className="text-6xl">{emoji}</div>}
            {imageUrl && (
              <div className="w-full h-48 relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* コンテンツ */}
          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>

          {/* ポイント表示 */}
          {showPoints && points && (points.impressed || points.giver) && (
            <div className="bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-900/20 dark:to-green-900/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                獲得ポイント
              </p>
              <div className="flex justify-center gap-6">
                {points.impressed !== undefined && points.impressed !== 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        感動体験
                      </p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {points.impressed > 0 ? '+' : ''}
                        {points.impressed}
                      </p>
                    </div>
                  </div>
                )}
                {points.giver !== undefined && points.giver !== 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        喜び提供
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
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
            size="lg"
            className="w-full touch-target text-lg font-bold"
          >
            {closeButtonText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
