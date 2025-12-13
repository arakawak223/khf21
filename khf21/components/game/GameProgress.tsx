'use client';

import { Card } from '@/components/ui/card';
import { formatGameProgress } from '@/lib/game/utils';

interface GameProgressProps {
  elapsedDays: number;
  totalDays: number;
  currentLocation: string;
  periodName?: string;
}

export default function GameProgress({
  elapsedDays,
  totalDays,
  currentLocation,
  periodName,
}: GameProgressProps) {
  const remainingDays = totalDays - elapsedDays;
  const progressPercentage = (elapsedDays / totalDays) * 100;

  return (
    <Card className="p-4 shadow-lg">
      <div className="flex flex-col gap-3">
        {/* 期間表示 */}
        {periodName && (
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {periodName}の旅
            </p>
          </div>
        )}

        {/* プログレスバー */}
        <div className="relative">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 日数表示 */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex flex-col items-start">
            <span className="text-gray-600 dark:text-gray-400">経過日数</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {elapsedDays}日
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-600 dark:text-gray-400">残り日数</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {remainingDays}日
            </span>
          </div>
        </div>

        {/* 現在地表示 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                現在地
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {currentLocation}
              </span>
            </div>
          </div>
        </div>

        {/* 残り日数の警告 */}
        {remainingDays <= 5 && remainingDays > 0 && elapsedDays > 0 && (
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              旅の終わりが近づいています
            </p>
          </div>
        )}

        {/* 旅の始まり */}
        {elapsedDays === 0 && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
            <p className="text-xs text-blue-800 dark:text-blue-200 font-semibold">
              ✈️ 素晴らしい旅の始まりです！
            </p>
          </div>
        )}

        {remainingDays <= 0 && (
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg text-center">
            <p className="text-xs text-red-800 dark:text-red-200 font-semibold">
              旅の期間が終了しました
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
