'use client';

import { useState } from 'react';
import type { PlayerMission } from '@/types/strategy.types';
import { getMissionById } from '@/lib/game/strategyData';

interface MissionPanelProps {
  playerMissions: PlayerMission[];
}

export default function MissionPanel({ playerMissions }: MissionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (playerMissions.length === 0) {
    return null;
  }

  // 完了済みミッション数
  const completedCount = playerMissions.filter(m => m.completed).length;

  return (
    <div className="fixed top-20 right-4 z-30">
      {/* 展開/折りたたみボタン */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
      >
        <span className="text-xl">🎯</span>
        <span className="font-bold">
          ミッション ({completedCount}/{playerMissions.length})
        </span>
        <span className="text-sm">{isExpanded ? '▼' : '▲'}</span>
      </button>

      {/* ミッション一覧 */}
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {playerMissions.map((playerMission) => {
              const mission = getMissionById(playerMission.missionId);
              if (!mission) return null;

              const progressPercentage = Math.min(
                (playerMission.progress / mission.targetValue) * 100,
                100
              );

              return (
                <div
                  key={mission.id}
                  className={`
                    relative rounded-lg p-4 border-2 transition-all duration-300
                    ${playerMission.completed
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  {/* 完了バッジ */}
                  {playerMission.completed && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                      ✓ 達成！
                    </div>
                  )}

                  {/* ミッション情報 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{mission.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1">{mission.nameJa}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {mission.description}
                      </div>

                      {/* 難易度 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">難易度:</span>
                        <div className="text-yellow-500">
                          {'⭐'.repeat(mission.difficulty)}
                        </div>
                      </div>

                      {/* 進捗バー */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">進捗</span>
                          <span className="font-bold">
                            {playerMission.progress} / {mission.targetValue}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              playerMission.completed
                                ? 'bg-green-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 報酬 */}
                  <div className="flex items-center gap-4 text-xs border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                    {mission.rewardPoints > 0 && (
                      <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span className="font-bold text-yellow-600">
                          +{mission.rewardPoints}pt
                        </span>
                      </div>
                    )}
                    {mission.rewardCards && mission.rewardCards > 0 && (
                      <div className="flex items-center gap-1">
                        <span>🎴</span>
                        <span className="font-bold text-purple-600">
                          +{mission.rewardCards}枚
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
