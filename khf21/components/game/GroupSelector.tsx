'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AirportGroup, GroupColor } from '@/types/strategy.types';

interface GroupSelectorProps {
  groups: AirportGroup[];
  playerName: string;
  isCurrentPlayer: boolean;
  onGroupSelected: (color: GroupColor) => void;
  autoSelectDelay?: number;
}

export default function GroupSelector({
  groups,
  playerName,
  isCurrentPlayer,
  onGroupSelected,
  autoSelectDelay = 2000,
}: GroupSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<GroupColor | null>(null);

  // AIプレイヤーの自動選択
  useEffect(() => {
    if (!isCurrentPlayer) {
      const timer = setTimeout(() => {
        // AIは空港数が最も多いグループを選択（既にFreemanAI.selectGroup()で選択済み）
        // ここではUI表示のため最初のグループをデフォルト選択
        const largestGroup = groups.reduce((prev, current) =>
          current.count > prev.count ? current : prev
        );
        handleSelect(largestGroup.color);
      }, autoSelectDelay);

      return () => clearTimeout(timer);
    }
  }, [isCurrentPlayer, groups, autoSelectDelay]);

  const handleSelect = (color: GroupColor) => {
    setSelectedColor(color);
    // アニメーション後にコールバック実行
    setTimeout(() => {
      onGroupSelected(color);
    }, 500);
  };

  const getGroupGradient = (color: GroupColor): string => {
    switch (color) {
      case 'red':
        return 'from-red-400 via-red-500 to-red-600';
      case 'blue':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'green':
        return 'from-green-400 via-green-500 to-green-600';
    }
  };

  const getGroupHoverGradient = (color: GroupColor): string => {
    switch (color) {
      case 'red':
        return 'hover:from-red-500 hover:via-red-600 hover:to-red-700';
      case 'blue':
        return 'hover:from-blue-500 hover:via-blue-600 hover:to-blue-700';
      case 'green':
        return 'hover:from-green-500 hover:via-green-600 hover:to-green-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full"
      >
        <div className="space-y-8">
          {/* タイトル */}
          <div className="text-center space-y-3">
            <div className="text-6xl">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              グループを選んでください
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {isCurrentPlayer ? (
                `${playerName} のターン`
              ) : (
                <span className="animate-pulse">{playerName} が選択中...</span>
              )}
            </p>
          </div>

          {/* グループボタン */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.button
                key={group.color}
                onClick={() => isCurrentPlayer && handleSelect(group.color)}
                disabled={!isCurrentPlayer || group.count === 0 || selectedColor !== null}
                whileHover={isCurrentPlayer && !selectedColor ? { scale: 1.05 } : {}}
                whileTap={isCurrentPlayer && !selectedColor ? { scale: 0.95 } : {}}
                className={`
                  relative p-6 rounded-2xl transition-all duration-300
                  ${group.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  ${selectedColor === group.color ? 'ring-4 ring-white shadow-2xl scale-105' : ''}
                  ${selectedColor && selectedColor !== group.color ? 'opacity-40' : ''}
                  bg-gradient-to-br ${getGroupGradient(group.color)}
                  ${isCurrentPlayer && !selectedColor && group.count > 0 ? getGroupHoverGradient(group.color) : ''}
                  shadow-lg
                `}
              >
                {/* 選択中のチェックマーク */}
                {selectedColor === group.color && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-4xl"
                  >
                    ✓
                  </motion.div>
                )}

                <div className="space-y-3 text-white">
                  {/* 絵文字 */}
                  <div className="text-5xl">{group.emoji}</div>

                  {/* グループ名 */}
                  <div className="text-2xl font-bold">{group.colorName}</div>

                  {/* キャッチコピー */}
                  <div className="text-sm font-medium opacity-90">{group.description}</div>

                  {/* 空港数 */}
                  <div className="text-lg font-semibold">
                    {group.count > 0 ? (
                      `${group.count} 空港`
                    ) : (
                      <span className="text-white/70">空</span>
                    )}
                  </div>

                  {/* 季節ボーナス */}
                  {group.seasonBonus && group.seasonBonus.bonusMultiplier > 1.0 && (
                    <div className="text-xs bg-white/20 rounded-lg px-2 py-1">
                      {group.seasonBonus.bonusDescription}
                    </div>
                  )}

                  {/* 主要効果 */}
                  {group.effects && (
                    <div className="text-xs space-y-1 opacity-90">
                      {group.effects.firstArrivalBonus > 0 && (
                        <div>✨ 先着+{group.effects.firstArrivalBonus}pt</div>
                      )}
                      {group.effects.specialCardRate > 1.0 && (
                        <div>🎴 特別カード{group.effects.specialCardRate}倍</div>
                      )}
                      {group.effects.impressedPointsModifier > 0 && (
                        <div>💎 Pt+{group.effects.impressedPointsModifier}%</div>
                      )}
                      {group.effects.troubleRateModifier !== 0 && (
                        <div>
                          {group.effects.troubleRateModifier > 0 ? '⚠️' : '🛡️'}
                          トラブル{group.effects.troubleRateModifier > 0 ? '+' : ''}{group.effects.troubleRateModifier}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* 詳細説明パネル */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center">
              📖 ルート説明
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* 冒険者ルート説明 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="text-2xl text-center">🔴</div>
                <div className="font-bold text-red-600 dark:text-red-400 text-center">冒険者ルート</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>• 人気観光地・秘境・山岳</div>
                  <div>• 他プレイヤーと競合しやすい</div>
                  <div>• 先着+30pt、カード2倍</div>
                  <div>• トラブル+15%</div>
                  <div className="pt-1 font-semibold">→ 逆転狙いに最適！</div>
                </div>
              </div>

              {/* 文化人ルート説明 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="text-2xl text-center">🔵</div>
                <div className="font-bold text-blue-600 dark:text-blue-400 text-center">文化人ルート</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>• 世界遺産・美術館・歴史</div>
                  <div>• 標準的な競合度</div>
                  <div>• Pt+25%、イベント豊富</div>
                  <div>• スター遭遇+20%</div>
                  <div className="pt-1 font-semibold">→ 安定重視に最適！</div>
                </div>
              </div>

              {/* 探求者ルート説明 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="text-2xl text-center">🟢</div>
                <div className="font-bold text-green-600 dark:text-green-400 text-center">探求者ルート</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>• 穴場・リゾート・温泉</div>
                  <div>• 競合が少なく安全</div>
                  <div>• 発見+20pt、レアカード</div>
                  <div>• トラブル-10%</div>
                  <div className="pt-1 font-semibold">→ 安全策に最適！</div>
                </div>
              </div>
            </div>

            {/* 季節情報 */}
            <div className="text-center text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg py-2 px-4">
              🌟 季節ボーナス: 夏=冒険者、春秋=文化人、冬=探求者 で+20%
            </div>
          </div>

          {/* ヘルプテキスト */}
          {isCurrentPlayer && !selectedColor && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              💡 選択したグループの空港からルーレットで目的地が決まります
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
