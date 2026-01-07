/**
 * 目的地到着時のポイント内訳表示コンポーネント
 * 到着ボーナス、名所・アート・グルメポイントの内訳を大きく表示
 */

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PointBreakdown {
  arrivalBonus: number;
  isFirstArrival: boolean;
  attractionPoints?: number;
  artPoints?: number;
  gourmetPoints?: number;
  attractionName?: string;
  artName?: string;
  gourmetName?: string;
}

interface ArrivalPointsBreakdownProps {
  destinationName: string;
  destinationNumber: number;
  breakdown: PointBreakdown;
  onContinue: () => void;
}

export default function ArrivalPointsBreakdown({
  destinationName,
  destinationNumber,
  breakdown,
  onContinue,
}: ArrivalPointsBreakdownProps) {
  const totalPoints =
    breakdown.arrivalBonus +
    (breakdown.attractionPoints || 0) +
    (breakdown.artPoints || 0) +
    (breakdown.gourmetPoints || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="text-6xl">🎊</div>
            <h2 className="text-3xl font-bold text-gray-800">
              目的地{destinationNumber}に到着！
            </h2>
            <p className="text-xl text-gray-600">{destinationName}</p>
          </div>

          {/* 合計ポイント */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 text-center">
            <div className="text-lg text-gray-600 mb-2">獲得ポイント</div>
            <div className="text-5xl font-bold text-blue-600">
              +{totalPoints.toLocaleString()}
            </div>
            <div className="text-xl text-gray-600 mt-1">ポイント</div>
          </div>

          {/* ポイント内訳 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2">
              ポイント内訳
            </h3>

            {/* 到着ボーナス */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {breakdown.isFirstArrival ? '🥇' : '✈️'}
                </div>
                <div>
                  <div className="font-bold text-gray-800">
                    {breakdown.isFirstArrival ? '初到着ボーナス' : '到着ポイント'}
                  </div>
                  {breakdown.isFirstArrival && (
                    <div className="text-xs text-gray-600">
                      この都市に一番乗り！
                    </div>
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                +{breakdown.arrivalBonus}
              </div>
            </div>

            {/* 名所ポイント */}
            {breakdown.attractionPoints && breakdown.attractionPoints > 0 && (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏛️</div>
                  <div>
                    <div className="font-bold text-gray-800">名所訪問</div>
                    <div className="text-xs text-gray-600">
                      {breakdown.attractionName}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  +{breakdown.attractionPoints}
                </div>
              </div>
            )}

            {/* アートポイント */}
            {breakdown.artPoints && breakdown.artPoints > 0 && (
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎭</div>
                  <div>
                    <div className="font-bold text-gray-800">アート鑑賞</div>
                    <div className="text-xs text-gray-600">
                      {breakdown.artName}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-pink-600">
                  +{breakdown.artPoints}
                </div>
              </div>
            )}

            {/* グルメポイント */}
            {breakdown.gourmetPoints && breakdown.gourmetPoints > 0 && (
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🍽️</div>
                  <div>
                    <div className="font-bold text-gray-800">グルメ体験</div>
                    <div className="text-xs text-gray-600">
                      {breakdown.gourmetName}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  +{breakdown.gourmetPoints}
                </div>
              </div>
            )}
          </div>

          {/* 続けるボタン */}
          <Button
            onClick={onContinue}
            className="w-full text-xl font-bold py-6"
            size="lg"
          >
            続ける
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
