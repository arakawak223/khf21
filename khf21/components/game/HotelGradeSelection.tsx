/**
 * ホテルグレード選択コンポーネント
 * 到着時にホテルグレードを選択可能
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HotelGrade } from '@/types/multiplayer.types';
import { HOTEL_GRADE_OPTIONS } from '@/lib/game/resourceOptions';
import { ResourcePointsDisplay } from './ResourcePointsDisplay';

interface HotelGradeSelectionProps {
  isOpen: boolean;
  currentResourcePoints: number;
  currentHotelGrade: HotelGrade;
  onSelect: (hotelGrade: HotelGrade, cost: number) => void;
  onClose: () => void;
}

export function HotelGradeSelection({
  isOpen,
  currentResourcePoints,
  currentHotelGrade,
  onSelect,
  onClose,
}: HotelGradeSelectionProps) {
  const [selectedGrade, setSelectedGrade] = useState<HotelGrade>(currentHotelGrade);

  const handleConfirm = () => {
    const option = HOTEL_GRADE_OPTIONS.find(opt => opt.grade === selectedGrade);
    if (option && currentResourcePoints >= option.cost) {
      onSelect(selectedGrade, option.cost);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        >
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">
                🏨 ホテルグレード選択
              </h2>
              <ResourcePointsDisplay resourcePoints={currentResourcePoints} size="medium" />
            </div>
            <p className="text-sm opacity-90">
              ホテルをアップグレードして特別イベント発生率UP！
            </p>
          </div>

          {/* 選択肢一覧 */}
          <div className="p-6 space-y-3">
            {HOTEL_GRADE_OPTIONS.map((option) => {
              const isSelected = selectedGrade === option.grade;
              const isCurrentGrade = currentHotelGrade === option.grade;
              const canAfford = currentResourcePoints >= option.cost;
              const isAffordable = canAfford || option.cost === 0;

              return (
                <motion.button
                  key={option.grade}
                  onClick={() => isAffordable && setSelectedGrade(option.grade)}
                  disabled={!isAffordable}
                  whileHover={isAffordable ? { scale: 1.02 } : {}}
                  whileTap={isAffordable ? { scale: 0.98 } : {}}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all relative
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : isAffordable
                        ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* 左側：グレード情報 */}
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                            {option.name}
                          </h3>
                          {isCurrentGrade && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              現在のグレード
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>

                        {/* 効果表示 */}
                        <div className="flex items-center gap-3 mt-2">
                          {option.specialEventBonus > 0 && (
                            <span className="text-xs text-blue-600 font-semibold">
                              🎭 +{option.specialEventBonus}% イベント
                            </span>
                          )}
                          {option.starEncounterBonus > 0 && (
                            <span className="text-xs text-purple-600 font-semibold">
                              ⭐ +{option.starEncounterBonus}% スター
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 右側：コスト */}
                    <div className="text-right">
                      {option.cost === 0 ? (
                        <span className="text-sm text-gray-500 font-semibold">無料</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-gray-800">
                            {option.cost} RP
                          </span>
                          {!canAfford && (
                            <span className="text-xs text-red-500 font-semibold">
                              不足
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 選択インジケーター */}
                  {isSelected && isAffordable && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* フッター */}
          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              キャンセル
            </button>

            <button
              onClick={handleConfirm}
              className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
            >
              このホテルに宿泊
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
