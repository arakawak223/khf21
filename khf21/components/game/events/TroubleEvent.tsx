'use client';

import { useState } from 'react';
import EventModal from '../EventModal';
import type { Trouble, TroubleResolution } from '@/types/database.types';

interface TroubleEventProps {
  isOpen: boolean;
  onClose: () => void;
  trouble: Trouble;
  resolution?: TroubleResolution;
}

export default function TroubleEvent({
  isOpen,
  onClose,
  trouble,
  resolution,
}: TroubleEventProps) {
  const [showResolution, setShowResolution] = useState(false);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      theft: 'スリ',
      robbery: '強盗',
      flight_delay: '飛行機遅延',
      hijack: 'ハイジャック',
      engine_failure: 'エンジン故障',
      shipwreck: '船沈没',
      pirate: '海賊',
      fire: '火災',
    };
    return labels[category] || 'トラブル';
  };

  const getHelperLabel = (helperType: string) => {
    const labels: Record<string, string> = {
      local_person: '地元の人',
      tour_guide: 'ツアーガイド',
      firefighter: '消防士',
      paramedic: '救急隊',
      police: '警察',
      coast_guard: '海上警察',
      detective: '刑事',
      doctor: '医者',
      japanese_traveler: '親切な日本人旅行者',
    };
    return labels[helperType] || '助けてくれた人';
  };

  const handleNext = () => {
    if (!showResolution && resolution) {
      setShowResolution(true);
    } else {
      onClose();
    }
  };

  if (showResolution && resolution) {
    // トラブル解消画面
    // 正味のポイント = トラブル損失 + 解決獲得
    const netPoints = trouble.impressed_points_loss + resolution.impressed_points;

    return (
      <EventModal
        isOpen={isOpen}
        onClose={handleNext}
        title="助けが来た！"
        subtitle={getHelperLabel(resolution.helper_type)}
        emoji="🦸"
        points={{ impressed: netPoints }}
        closeButtonText="次へ"
      >
        <div className="space-y-2">
          {/* ヘルパータイプバッジ */}
          <div className="flex items-center justify-center">
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
              {getHelperLabel(resolution.helper_type)}
            </span>
          </div>

          {/* 解消シナリオ */}
          <div className="text-gray-700 dark:text-gray-300">
            <p>{resolution.resolution_text}</p>
          </div>

          {/* 励ましの言葉 */}
          {resolution.encouragement_text && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border-l-4 border-green-500">
              <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">
                💬 励ましの言葉
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                「{resolution.encouragement_text}」
              </p>
            </div>
          )}

          {/* 体験メッセージ */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border-l-4 border-purple-500">
            <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
              ✨ 体験
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              困難な状況の中で、見知らぬ人が助けてくれました。
              人の優しさと温かさに触れ、心から感謝の気持ちでいっぱいです。
              この経験は、人と人との繋がりの大切さを改めて教えてくれました。
              {netPoints < 0 && (
                <span className="block mt-1 text-red-700 dark:text-red-300">
                  ただし、トラブルによる損失は{Math.abs(trouble.impressed_points_loss)}ポイント、
                  解決により{resolution.impressed_points}ポイント回復し、
                  正味{Math.abs(netPoints)}ポイントの損失となりました。
                </span>
              )}
              {netPoints > 0 && (
                <span className="block mt-1 text-green-700 dark:text-green-300">
                  トラブルは{Math.abs(trouble.impressed_points_loss)}ポイントの損失でしたが、
                  解決により{resolution.impressed_points}ポイント獲得し、
                  正味{netPoints}ポイントのプラスとなりました！
                </span>
              )}
              {netPoints === 0 && (
                <span className="block mt-1 text-gray-700 dark:text-gray-300">
                  トラブルは{Math.abs(trouble.impressed_points_loss)}ポイントの損失でしたが、
                  解決により{resolution.impressed_points}ポイント獲得し、
                  プラスマイナスゼロとなりました。
                </span>
              )}
            </p>
          </div>

          {/* 希望のメッセージ */}
          <div className="text-center text-xs text-gray-600 dark:text-gray-400">
            <p>
              {trouble.severity >= 3
                ? '大変な状況でしたが、無事に解決しました。旅は続きます。'
                : 'トラブルは無事に解決しました。旅は続きます。'}
            </p>
          </div>
        </div>
      </EventModal>
    );
  }

  // トラブル発生画面
  return (
    <EventModal
      isOpen={isOpen}
      onClose={handleNext}
      title={`トラブル発生: ${trouble.name_ja}`}
      subtitle={getCategoryLabel(trouble.category)}
      imageUrl={trouble.image_url || undefined}
      emoji="⚠️"
      points={{ impressed: trouble.impressed_points_loss }}
      closeButtonText={resolution ? '続きを見る' : '次へ'}
      showPoints={!resolution}
    >
      <div className="space-y-2">
        {/* 重要度表示 */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
            危険度: {'⭐'.repeat(trouble.severity)}
          </span>
          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
            {trouble.severity}マス後退
          </span>
        </div>

        {/* トラブル説明 */}
        <div className="text-gray-700 dark:text-gray-300">
          <p>{trouble.description}</p>
        </div>

        {/* 警告メッセージ */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 border-l-4 border-red-500">
          <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-1">
            ⚠️ トラブル発生
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            予期せぬトラブルに巻き込まれてしまいました。
            旅には様々な困難がつきものです。
            {trouble.impressed_points_loss < 0 &&
              ` このトラブルにより、${Math.abs(
                trouble.impressed_points_loss
              )}ポイントを失いました。`}
            {` さらに、${trouble.severity}マス後退してしまいます。`}
          </p>
        </div>

        {resolution && (
          <div className="text-center text-xs text-gray-600 dark:text-gray-400">
            <p>しかし、助けが来るまでもう少しです...</p>
          </div>
        )}
      </div>
    </EventModal>
  );
}
