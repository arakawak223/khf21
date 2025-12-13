'use client';

import { Card } from '@/components/ui/card';
import { calculateTotalPoints } from '@/lib/game/utils';

interface PointsDisplayProps {
  impressedPoints: number;
  giverPoints: number;
  showDetails?: boolean;
  compact?: boolean;
}

export default function PointsDisplay({
  impressedPoints,
  giverPoints,
  showDetails = true,
  compact = false,
}: PointsDisplayProps) {
  const totalPoints = calculateTotalPoints(impressedPoints, giverPoints);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            感動: {impressedPoints.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-600 dark:text-green-400 font-semibold">
            喜び: {giverPoints.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1 font-bold">
          <span className="text-blue-600 dark:text-blue-400">
            合計: {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4 shadow-lg">
      <div className="flex flex-col gap-4">
        {/* 合計ポイント */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            総合ポイント
          </p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalPoints.toLocaleString()}
          </p>
        </div>

        {/* 詳細表示 */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Impressedポイント */}
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    感動体験
                  </p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {impressedPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Giverポイント */}
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    喜び提供
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {giverPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
