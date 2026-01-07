'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { EncouragementGratitudeScenario } from '@/types/database.types';

interface EncouragementGratitudeEventProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: EncouragementGratitudeScenario;
}

export default function EncouragementGratitudeEvent({
  isOpen,
  onClose,
  scenario,
}: EncouragementGratitudeEventProps) {
  const [currentStep, setCurrentStep] = useState<'trigger' | 'story' | 'message'>('trigger');

  if (!isOpen) return null;

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      gratitude_happy: '感謝 - 嬉しい出来事',
      gratitude_help: '感謝 - 辛い時の助け',
      encouragement: '元気づけ',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      gratitude_happy: '🎉',
      gratitude_help: '🤝',
      encouragement: '💪',
    };
    return icons[category] || '💌';
  };

  const getTriggerIcon = (triggerType: string) => {
    const icons: Record<string, string> = {
      phone: '📞',
      email: '📧',
      message: '💬',
      diary: '📔',
      photo: '📷',
      letter: '✉️',
      encounter: '👥',
      video_call: '📹',
    };
    return icons[triggerType] || '💌';
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels: Record<string, string> = {
      phone: '電話',
      email: 'メール',
      message: 'メッセージ',
      diary: '日記',
      photo: '写真',
      letter: '手紙',
      encounter: '出会い',
      video_call: 'ビデオ通話',
    };
    return labels[triggerType] || triggerType;
  };

  const handleNext = () => {
    if (currentStep === 'trigger') {
      setCurrentStep('story');
    } else if (currentStep === 'story') {
      setCurrentStep('message');
    }
  };

  const handleClose = () => {
    setCurrentStep('trigger');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="text-6xl mb-1 animate-bounce">
              {getCategoryIcon(scenario.category)}
            </div>
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {getCategoryLabel(scenario.category)}
            </h2>
            {scenario.subcategory && (
              <p className="text-sm text-purple-600 dark:text-purple-300">
                {scenario.subcategory}
              </p>
            )}
          </div>

          {/* きっかけステップ */}
          {currentStep === 'trigger' && (
            <div className="space-y-2 animate-in slide-in-from-right duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getTriggerIcon(scenario.trigger_type)}</span>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    {getTriggerLabel(scenario.trigger_type)}
                    {scenario.trigger_from && ` - ${scenario.trigger_from}`}
                  </h3>
                </div>
                {scenario.location_context && (
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                    📍 {scenario.location_context}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {scenario.travel_situation}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  思い出す... →
                </Button>
              </div>
            </div>
          )}

          {/* 背景ストーリーステップ */}
          {currentStep === 'story' && (
            <div className="space-y-2 animate-in slide-in-from-right duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    あの時のこと...
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {scenario.background_story}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {scenario.category === 'encouragement' ? '励ます →' : '感謝を伝える →'}
                </Button>
              </div>
            </div>
          )}

          {/* メッセージステップ */}
          {currentStep === 'message' && (
            <div className="space-y-2 animate-in slide-in-from-right duration-300">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">💝</span>
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
                    {scenario.category === 'encouragement' ? '元気づけの言葉' : '感謝の言葉'}
                  </h3>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-medium italic">
                  "{scenario.message_text}"
                </p>
              </div>

              {/* ポイント表示 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
                <div className="flex justify-center gap-6">
                  {scenario.impressed_points > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">体験ポイント</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        +{scenario.impressed_points}
                      </p>
                    </div>
                  )}
                  {scenario.giver_points > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">喜び提供</p>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        +{scenario.giver_points}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleClose}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white min-w-[200px]"
                >
                  ✓ 旅を続ける
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
