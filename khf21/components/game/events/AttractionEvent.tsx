'use client';

import { useEffect, useState } from 'react';
import EventModal from '../EventModal';
import type { Attraction } from '@/types/database.types';
import { getPlaceholderImage } from '@/lib/unsplash/client';

interface AttractionEventProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: Attraction;
}

export default function AttractionEvent({
  isOpen,
  onClose,
  attraction,
}: AttractionEventProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(attraction.image_url || undefined);

  // 画像URLがない場合は動的に生成
  useEffect(() => {
    if (!attraction.image_url && attraction.category === 'world_heritage') {
      // Unsplashのプレースホルダー画像を使用
      const fallbackUrl = getPlaceholderImage(attraction.name, 800, 600);
      console.log(`[画像URL生成] ${attraction.name_ja}: ${fallbackUrl}`);
      setImageUrl(fallbackUrl);
    }
  }, [attraction]);
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      world_heritage: '世界遺産',
      scenic_spot: '絶景ポイント',
      landmark: '名所',
    };
    return labels[category] || '名所';
  };

  // 世界遺産の場合はポイントを1.5倍にする
  const calculatePoints = () => {
    const basePoints = attraction.impressed_points;
    if (attraction.category === 'world_heritage') {
      return Math.round(basePoints * 1.5);
    }
    return basePoints;
  };

  const finalPoints = calculatePoints();

  return (
    <EventModal
      isOpen={isOpen}
      onClose={onClose}
      title={attraction.name_ja}
      subtitle={`${attraction.city}, ${attraction.country}`}
      imageUrl={imageUrl}
      emoji={attraction.category === 'world_heritage' ? '🏆' : '🏛️'}
      points={{ impressed: finalPoints }}
      isWorldHeritage={attraction.category === 'world_heritage'}
    >
      <div className="space-y-2">
        {/* カテゴリバッジ */}
        <div className="flex items-center justify-center">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
            {getCategoryLabel(attraction.category)}
          </span>
        </div>

        {/* 説明文 */}
        {attraction.description && (
          <div className="text-gray-700 dark:text-gray-300 text-xs leading-snug">
            <p>{attraction.description}</p>
          </div>
        )}

        {/* 世界遺産の特別表示 */}
        {attraction.category === 'world_heritage' && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-3 border-2 border-amber-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                UNESCO世界遺産
              </p>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-100 leading-snug mb-2">
              人類共通の宝として、その顕著な普遍的価値が認められています。この貴重な文化遺産・自然遺産を訪れることができるのは大変名誉なことです。
            </p>
            <div className="bg-white/60 dark:bg-black/20 rounded px-2 py-1">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                💎 世界遺産ボーナス: ポイント+50%
              </p>
            </div>
          </div>
        )}

        {/* 体験メッセージ */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border-l-4 border-purple-500">
          <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
            ✨ 体験
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
            {attraction.category === 'world_heritage' &&
              'この世界遺産の壮大さと歴史の重みを感じました。何世紀も前の人々の知恵と技術に圧倒され、その価値を深く理解することができました。後世に残すべき人類の宝です。'}
            {attraction.category === 'scenic_spot' &&
              'この絶景は言葉では表現できないほど美しく、心が洗われるようです。大自然の力強さと繊細さを感じます。'}
            {attraction.category === 'landmark' &&
              'この場所には特別な雰囲気があり、その地の文化と歴史を肌で感じることができました。訪れることができて本当に良かったです。'}
          </p>
        </div>

        {/* 位置情報 */}
        {attraction.latitude && attraction.longitude && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            位置: {Number(attraction.latitude).toFixed(4)}°,{' '}
            {Number(attraction.longitude).toFixed(4)}°
          </div>
        )}
      </div>
    </EventModal>
  );
}
