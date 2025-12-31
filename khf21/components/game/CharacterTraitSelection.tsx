/**
 * キャラクター特性選択コンポーネント
 * プレイヤー登録時に旅行スタイルを選択
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterTrait } from '@/types/multiplayer.types';
import { CHARACTER_TRAIT_OPTIONS } from '@/lib/game/resourceOptions';

interface CharacterTraitSelectionProps {
  isOpen: boolean;
  onSelect: (trait: CharacterTrait) => void;
  onClose?: () => void;
}

export function CharacterTraitSelection({
  isOpen,
  onSelect,
  onClose,
}: CharacterTraitSelectionProps) {
  const [selectedTrait, setSelectedTrait] = useState<CharacterTrait | null>(null);

  const handleSelect = (trait: CharacterTrait) => {
    setSelectedTrait(trait);
  };

  const handleConfirm = () => {
    if (selectedTrait) {
      onSelect(selectedTrait);
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-center mb-2">
              🎭 旅行スタイルを選択
            </h2>
            <p className="text-sm text-center opacity-90">
              あなたのプレイスタイルに合った特性を選んでください
            </p>
          </div>

          {/* 選択肢一覧 */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHARACTER_TRAIT_OPTIONS.map((option) => {
              const isSelected = selectedTrait === option.trait;

              return (
                <motion.button
                  key={option.trait}
                  onClick={() => handleSelect(option.trait)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }
                  `}
                >
                  {/* アイコンと名前 */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{option.emoji}</span>
                    <div>
                      <h3 className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                        {option.name}
                      </h3>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </div>

                  {/* 効果 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-600">💎 初期RP:</span>
                      <span className="font-semibold text-green-600">
                        {option.effects.resourcePoints}
                      </span>
                    </div>

                    {option.effects.longDistanceBonus !== 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">✈️ 長距離:</span>
                        <span className={`font-semibold ${
                          option.effects.longDistanceBonus > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {option.effects.longDistanceBonus > 0 ? '+' : ''}
                          {option.effects.longDistanceBonus}%
                        </span>
                      </div>
                    )}

                    {option.effects.starEncounterRate !== 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">⭐ スター:</span>
                        <span className={`font-semibold ${
                          option.effects.starEncounterRate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {option.effects.starEncounterRate > 0 ? '+' : ''}
                          {option.effects.starEncounterRate}%
                        </span>
                      </div>
                    )}

                    {option.effects.eventRateModifier !== 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">🎲 イベント:</span>
                        <span className={`font-semibold ${
                          option.effects.eventRateModifier > 0 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {option.effects.eventRateModifier > 0 ? '+' : ''}
                          {option.effects.eventRateModifier}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 特殊能力 */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      {option.effects.specialAbility}
                    </p>
                  </div>

                  {/* 選択インジケーター */}
                  {isSelected && (
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
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                キャンセル
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selectedTrait}
              className={`
                px-6 py-3 rounded-lg font-bold text-white transition-all
                ${selectedTrait
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              この特性で決定
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
