'use client';

import EventModal from '../EventModal';
import type { Attraction } from '@/types/database.types';

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
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      world_heritage: '世界遺産',
      scenic_spot: '絶景ポイント',
      landmark: '名所',
    };
    return labels[category] || '名所';
  };

  return (
    <EventModal
      isOpen={isOpen}
      onClose={onClose}
      title={attraction.name_ja}
      subtitle={`${attraction.city}, ${attraction.country}`}
      imageUrl={attraction.image_url || undefined}
      emoji="🏛️"
      points={{ impressed: attraction.impressed_points }}
    >
      <div className="space-y-4">
        {/* カテゴリバッジ */}
        <div className="flex items-center justify-center">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
            {getCategoryLabel(attraction.category)}
          </span>
        </div>

        {/* 説明文 */}
        {attraction.description && (
          <div className="text-gray-700 dark:text-gray-300">
            <p>{attraction.description}</p>
          </div>
        )}

        {/* 感動体験メッセージ */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
          <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
            ✨ 感動体験
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {attraction.category === 'world_heritage' &&
              'この世界遺産の壮大さと歴史の重みに深く感動しました。何世紀も前の人々の知恵と技術に圧倒されます。'}
            {attraction.category === 'scenic_spot' &&
              'この絶景は言葉では表現できないほど美しく、心が洗われるようです。大自然の力強さと繊細さに感動を覚えます。'}
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
