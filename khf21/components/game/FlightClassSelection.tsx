/**
 * フライトクラス選択コンポーネント
 * 出発前にフライトクラスを選択してアップグレード可能
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlightClass } from '@/types/multiplayer.types';
import { FLIGHT_CLASS_OPTIONS } from '@/lib/game/resourceOptions';
import { ResourcePointsDisplay } from './ResourcePointsDisplay';

interface FlightClassSelectionProps {
  isOpen: boolean;
  currentResourcePoints: number;
  currentFlightClass: FlightClass;
  onSelect: (flightClass: FlightClass, cost: number) => void;
  onClose: () => void;
}

export function FlightClassSelection({
  isOpen,
  currentResourcePoints,
  currentFlightClass,
  onSelect,
  onClose,
}: FlightClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<FlightClass>(currentFlightClass);

  const handleConfirm = () => {
    const option = FLIGHT_CLASS_OPTIONS.find(opt => opt.class === selectedClass);
    if (option && currentResourcePoints >= option.cost) {
      onSelect(selectedClass, option.cost);
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
          <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">
                ✈️ フライトクラス選択
              </h2>
              <ResourcePointsDisplay resourcePoints={currentResourcePoints} size="medium" />
            </div>
            <p className="text-sm opacity-90">
              フライトクラスをアップグレードしてスター遭遇率UP！
            </p>
          </div>

          {/* 選択肢一覧 */}
          <div className="p-6 space-y-3">
            {FLIGHT_CLASS_OPTIONS.map((option) => {
              const isSelected = selectedClass === option.class;
              const isCurrentClass = currentFlightClass === option.class;
              const canAfford = currentResourcePoints >= option.cost;
              const isAffordable = canAfford || option.cost === 0;

              return (
                <motion.button
                  key={option.class}
                  onClick={() => isAffordable && setSelectedClass(option.class)}
                  disabled={!isAffordable}
                  whileHover={isAffordable ? { scale: 1.02 } : {}}
                  whileTap={isAffordable ? { scale: 0.98 } : {}}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : isAffordable
                        ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* 左側：クラス情報 */}
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                            {option.name}
                          </h3>
                          {isCurrentClass && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              現在のクラス
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>

                        {/* 効果表示 */}
                        <div className="flex items-center gap-3 mt-2">
                          {option.starEncounterBonus > 0 && (
                            <span className="text-xs text-purple-600 font-semibold">
                              ⭐ +{option.starEncounterBonus}%
                            </span>
                          )}
                          {option.bonusPoints > 0 && (
                            <span className="text-xs text-green-600 font-semibold">
                              🎁 +{option.bonusPoints}pt
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
                      className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
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
              className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-sky-500 hover:shadow-lg transition-all"
            >
              このクラスで出発
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
