'use client';

import { useState } from 'react';
import type { DestinationCandidate } from '@/types/strategy.types';
import { Button } from '@/components/ui/button';

interface DestinationChoiceProps {
  candidates: DestinationCandidate[];
  chooserName: string;
  isCurrentPlayerChooser: boolean;
  onSelect: (airportId: string) => void;
  autoSelectDelay?: number; // AI自動選択の遅延時間（ミリ秒）
}

export default function DestinationChoice({
  candidates,
  chooserName,
  isCurrentPlayerChooser,
  onSelect,
  autoSelectDelay = 3000,
}: DestinationChoiceProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // 報酬レベルを星で表示
  const renderStars = (level: number) => {
    return '⭐'.repeat(level);
  };

  // 競合度のラベルとカラー
  const getCompetitionLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return { label: '空いてます', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'medium':
        return { label: 'やや混雑', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'high':
        return { label: '激戦区！', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  const handleSelect = async (index: number) => {
    if (isSelecting || !isCurrentPlayerChooser) return;

    setIsSelecting(true);
    setSelectedIndex(index);

    // 少し待ってから確定（アニメーション用）
    await new Promise(resolve => setTimeout(resolve, 500));

    onSelect(candidates[index].airport.id);
  };

  // AI自動選択（コンポーネントマウント時に実行）
  useState(() => {
    if (!isCurrentPlayerChooser) {
      setTimeout(() => {
        // 最もスコアの高い候補を選択（簡易版）
        const bestIndex = candidates.reduce((bestIdx, candidate, idx) => {
          const currentBest = candidates[bestIdx];
          return candidate.rewardLevel > currentBest.rewardLevel ? idx : bestIdx;
        }, 0);

        setSelectedIndex(bestIndex);
        setTimeout(() => {
          onSelect(candidates[bestIndex].airport.id);
        }, 500);
      }, autoSelectDelay);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            🎯 目的地を選んでください
          </h2>
          <div className="text-xl">
            {isCurrentPlayerChooser ? (
              <span className="text-green-600 font-bold">あなたが選択できます！</span>
            ) : (
              <span className="text-gray-600">
                {chooserName} が選択中...
              </span>
            )}
          </div>
        </div>

        {/* 候補一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidates.map((candidate, index) => {
            const competitionInfo = getCompetitionLabel(candidate.competitionLevel);
            const isSelected = selectedIndex === index;

            return (
              <div
                key={candidate.airport.id}
                className={`
                  relative rounded-xl border-4 p-6 cursor-pointer transition-all duration-300
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-2xl'
                    : 'border-gray-300 hover:border-blue-300 hover:shadow-lg'
                  }
                  ${!isCurrentPlayerChooser && 'pointer-events-none opacity-75'}
                `}
                onClick={() => handleSelect(index)}
              >
                {/* 選択マーク */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl animate-bounce">
                    ✓
                  </div>
                )}

                {/* 都市名 */}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">✈️</div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {candidate.airport.city}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {candidate.airport.name_ja || candidate.airport.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {candidate.airport.country}
                  </p>
                </div>

                {/* 距離情報 */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300">📏 距離</span>
                    <span className="font-bold">{candidate.distance.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">📅 予想日数</span>
                    <span className="font-bold">{candidate.estimatedDays} 日</span>
                  </div>
                </div>

                {/* 報酬レベル */}
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">報酬レベル</div>
                  <div className="text-2xl">{renderStars(candidate.rewardLevel)}</div>
                </div>

                {/* 競合度 */}
                <div className="flex items-center justify-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${competitionInfo.bgColor} ${competitionInfo.color}`}>
                    👥 {competitionInfo.label}
                  </span>
                </div>

                {/* 占有情報 */}
                {candidate.isOccupied && (
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2 mb-3 text-center">
                    <div className="text-xs text-orange-700 dark:text-orange-300">
                      🏴 他プレイヤーが占有中
                    </div>
                  </div>
                )}

                {/* 特殊効果 */}
                {candidate.specialEffect && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-3 border-2 border-purple-300">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">{candidate.specialEffect.icon}</span>
                      <div>
                        <div className="font-bold text-purple-700 dark:text-purple-300">
                          特殊効果！
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          {candidate.specialEffect.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 選択ボタン */}
                {isCurrentPlayerChooser && (
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    disabled={isSelecting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(index);
                    }}
                  >
                    {isSelected ? '✓ 選択中...' : 'この都市を選ぶ'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>💡 報酬レベルが高いほど到着時のポイントが増えます</p>
          <p>💡 競合度が高いと他プレイヤーと競争になります</p>
        </div>
      </div>
    </div>
  );
}
