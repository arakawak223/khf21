'use client';

import { Button } from '@/components/ui/button';
import type { GamePlayer } from '@/types/multiplayer.types';

interface CardTargetSelectorProps {
  players: GamePlayer[];
  currentPlayerId: string;
  onSelectTarget: (targetId: string) => void;
  onCancel: () => void;
}

export default function CardTargetSelector({
  players,
  currentPlayerId,
  onSelectTarget,
  onCancel,
}: CardTargetSelectorProps) {
  // 対戦相手のみをフィルタ
  const opponents = players.filter(p => p.id !== currentPlayerId);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="space-y-4">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="text-4xl">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              対象プレイヤーを選択
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              カードの効果を適用するプレイヤーを選んでください
            </p>
          </div>

          {/* プレイヤー一覧 */}
          <div className="space-y-2">
            {opponents.map((player) => (
              <button
                key={player.id}
                onClick={() => onSelectTarget(player.id)}
                className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* プレイヤーアイコン */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: player.player_color }}
                    >
                      {player.player_nickname[0]}
                    </div>

                    {/* プレイヤー情報 */}
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white">
                        {player.player_nickname}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {player.total_points}pt
                      </div>
                    </div>
                  </div>

                  {/* 矢印 */}
                  <div className="text-2xl text-purple-600">→</div>
                </div>
              </button>
            ))}
          </div>

          {/* キャンセルボタン */}
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  );
}
