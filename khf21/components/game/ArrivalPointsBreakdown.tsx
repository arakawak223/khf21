/**
 * 目的地到着時のポイント内訳表示コンポーネント
 * 到着ボーナス、名所・アート・グルメポイントの内訳を大きく表示
 */

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PointBreakdown {
  arrivalBonus: number;
  isFirstToArrive: boolean;
  attractionPoints?: number;
  artPoints?: number;
  gourmetPoints?: number;
  attractionName?: string;
  artName?: string;
  gourmetName?: string;
  attractionCategory?: 'world_heritage' | 'scenic_spot' | 'landmark';
  isWorldHeritage?: boolean; // 世界遺産かどうか
}

interface ArrivalPointsBreakdownProps {
  destinationName: string;
  destinationNumber: number;
  breakdown: PointBreakdown;
  onContinue: () => void;
  playerName: string;
}

export default function ArrivalPointsBreakdown({
  destinationName,
  destinationNumber,
  breakdown,
  onContinue,
  playerName,
}: ArrivalPointsBreakdownProps) {
  const totalPoints =
    breakdown.arrivalBonus +
    (breakdown.attractionPoints || 0) +
    (breakdown.artPoints || 0) +
    (breakdown.gourmetPoints || 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
              {playerName} が目的地{destinationNumber}に到着！
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
                  {breakdown.isFirstToArrive ? '🥇' : '✈️'}
                </div>
                <div>
                  <div className="font-bold text-gray-800">
                    {breakdown.isFirstToArrive ? '先着ボーナス' : '到着ポイント'}
                  </div>
                  {breakdown.isFirstToArrive && (
                    <div className="text-xs text-gray-600">
                      目的地{destinationNumber}に一番乗り！
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
              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                breakdown.isWorldHeritage || breakdown.attractionCategory === 'world_heritage'
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {breakdown.isWorldHeritage || breakdown.attractionCategory === 'world_heritage' ? '🏆' : '🏛️'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      {breakdown.isWorldHeritage || breakdown.attractionCategory === 'world_heritage' ? (
                        <>
                          <span>世界遺産訪問</span>
                          <span className="text-xs px-2 py-0.5 bg-amber-400 text-amber-900 rounded-full font-bold">
                            UNESCO
                          </span>
                        </>
                      ) : (
                        '名所訪問'
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {breakdown.attractionName}
                    </div>
                    {(breakdown.isWorldHeritage || breakdown.attractionCategory === 'world_heritage') && (
                      <div className="text-xs text-amber-700 font-semibold mt-0.5">
                        💎 世界遺産ボーナス+50%適用済み
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  breakdown.isWorldHeritage || breakdown.attractionCategory === 'world_heritage'
                    ? 'text-amber-600'
                    : 'text-purple-600'
                }`}>
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
