'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { GiverScenario } from '@/types/database.types';

interface GiverEventProps {
  isOpen: boolean;
  onClose: (selectedPoints: number) => void;
  scenario: GiverScenario;
}

interface ActionOption {
  text: string;
  points: number;
}

export default function GiverEvent({
  isOpen,
  onClose,
  scenario,
}: GiverEventProps) {
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(null);
  const [showResult, setShowResult] = useState(false);

  const getLocationLabel = (locationType: string) => {
    const labels: Record<string, string> = {
      airport: '空港',
      flight: '機内',
      port: '港',
      ship: '船上',
      restaurant: 'レストラン',
      concert_hall: 'コンサートホール',
      museum: '美術館',
    };
    return labels[locationType] || '旅先';
  };

  const actionOptions = (scenario.action_options || []) as unknown as ActionOption[];

  const handleActionSelect = (action: ActionOption) => {
    setSelectedAction(action);
    setShowResult(true);
  };

  const handleClose = () => {
    if (selectedAction) {
      onClose(selectedAction.points);
    } else {
      onClose(0);
    }
  };

  if (!isOpen) return null;

  if (showResult && selectedAction) {
    // 結果表示画面
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up shadow-2xl">
          <div className="p-6 space-y-2">
            {/* ヘッダー */}
            <div className="text-center space-y-2">
              <div className="text-6xl">🎁</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                喜んでもらえました！
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {getLocationLabel(scenario.location_type)}
              </p>
            </div>

            {/* 選択したアクション */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border-l-4 border-green-500">
              <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">
                あなたの行動
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {selectedAction.text}
              </p>
            </div>

            {/* フィードバック */}
            {scenario.feedback_text && (
              <div className="text-gray-700 dark:text-gray-300">
                <p>{scenario.feedback_text}</p>
              </div>
            )}

            {/* ポイント表示 */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-2 space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
                獲得ポイント
              </p>
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      喜び提供
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{selectedAction.points}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border-l-4 border-purple-500">
              <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
                ✨ 心温まる体験
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                人に喜んでもらえることは、自分自身の喜びにもなります。
                小さな親切や思いやりが、誰かの一日を明るくします。
                旅先での温かい交流は、かけがえのない思い出となりました。
              </p>
            </div>

            {/* 閉じるボタン */}
            <Button
              onClick={handleClose}
              size="lg"
              className="w-full touch-target text-lg font-bold"
            >
              次へ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 選択肢表示画面
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up shadow-2xl">
        <div className="p-6 space-y-2">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="text-6xl">🤝</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {scenario.title}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getLocationLabel(scenario.location_type)}
            </p>
          </div>

          {/* 状況説明 */}
          <div className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p>{scenario.situation_text}</p>
          </div>

          {/* 行動選択 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
              どうしますか？
            </p>
            {actionOptions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionSelect(action)}
                className="w-full touch-target p-4 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 rounded-lg transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {index === 0 && '💚'}
                    {index === 1 && '💙'}
                    {index === 2 && '💛'}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">
                      {action.text}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      +{action.points} ギバーポイント
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* キャンセルボタン */}
          <Button
            onClick={handleClose}
            variant="outline"
            size="lg"
            className="w-full touch-target"
          >
            今は何もしない
          </Button>
        </div>
      </Card>
    </div>
  );
}
