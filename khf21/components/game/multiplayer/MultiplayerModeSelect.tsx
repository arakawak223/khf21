'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MultiplayerModeSelectProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onBack: () => void;
}

export default function MultiplayerModeSelect({
  onCreateRoom,
  onJoinRoom,
  onBack,
}: MultiplayerModeSelectProps) {
  return (
    <div className="mobile-container py-6">
      <Card className="p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              オンライン対戦
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              他のプレイヤーとリアルタイムで対戦しよう
            </p>
          </div>

          {/* ルーム作成 */}
          <button
            onClick={onCreateRoom}
            className="touch-target p-6 rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 hover:shadow-xl transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                ルームを作成
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                新しいゲームルームを作成して、フレンドを招待
              </p>
            </div>
          </button>

          {/* ルーム参加 */}
          <button
            onClick={onJoinRoom}
            className="touch-target p-6 rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 hover:shadow-xl transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🚪</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                ルームに参加
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ルームコードを入力して既存のルームに参加
              </p>
            </div>
          </button>

          {/* 戻るボタン */}
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="touch-target"
          >
            戻る
          </Button>

          {/* 注意事項 */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-bold">💡 注意事項</span><br />
              ・オンライン対戦には2〜4人のプレイヤーが必要です<br />
              ・全員が準備完了するとゲームが開始されます<br />
              ・途中退出すると他のプレイヤーに影響が出ます
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
