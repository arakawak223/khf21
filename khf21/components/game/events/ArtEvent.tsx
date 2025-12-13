'use client';

import EventModal from '../EventModal';
import type { Art } from '@/types/database.types';

interface ArtEventProps {
  isOpen: boolean;
  onClose: () => void;
  art: Art;
}

export default function ArtEvent({ isOpen, onClose, art }: ArtEventProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      concert: 'コンサート',
      musical: 'ミュージカル',
      performance: 'パフォーマンス',
      street_art: '大道芸',
    };
    return labels[category] || 'アート';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      concert: '🎵',
      musical: '🎭',
      performance: '🎪',
      street_art: '🎨',
    };
    return emojis[category] || '🎨';
  };

  return (
    <EventModal
      isOpen={isOpen}
      onClose={onClose}
      title={art.name_ja}
      subtitle={art.venue ? `${art.venue}${art.city ? `, ${art.city}` : ''}` : art.city || ''}
      imageUrl={art.image_url || undefined}
      emoji={getCategoryEmoji(art.category)}
      points={{ impressed: art.impressed_points }}
    >
      <div className="space-y-4">
        {/* カテゴリバッジ */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm font-semibold">
            {getCategoryLabel(art.category)}
          </span>
          {art.country && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
              {art.country}
            </span>
          )}
        </div>

        {/* 説明文 */}
        {art.description && (
          <div className="text-gray-700 dark:text-gray-300">
            <p>{art.description}</p>
          </div>
        )}

        {/* 鑑賞体験メッセージ */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-l-4 border-pink-500">
          <p className="text-sm font-semibold text-pink-800 dark:text-pink-200 mb-2">
            {getCategoryEmoji(art.category)} 鑑賞体験
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {art.category === 'concert' &&
              '生の音楽の迫力と美しさに圧倒されました。会場全体が一体となって音楽に包まれる感覚は、録音では決して味わえない特別なものです。'}
            {art.category === 'musical' &&
              '俳優たちの熱演と美しい歌声、壮大なセットに魅了されました。物語の世界に引き込まれ、笑いと涙の感動的な時間を過ごしました。'}
            {art.category === 'performance' &&
              'アーティストの卓越した技術と表現力に心を奪われました。想像を超えるパフォーマンスに、何度も鳥肌が立ちました。'}
            {art.category === 'street_art' &&
              '路上で繰り広げられる芸術的なパフォーマンスに足を止めました。身近な場所で触れるアートの力に、改めて感動しました。'}
          </p>
        </div>

        {/* 感動体験メッセージ */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
          <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
            ✨ 感動体験
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            この素晴らしいアート体験は、旅の最高の思い出の一つとなりました。芸術の持つ力を肌で感じ、心が豊かになる瞬間でした。
          </p>
        </div>

        {/* 会場情報 */}
        {art.venue && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <span>📍</span>
              <span>{art.venue}</span>
            </div>
          </div>
        )}
      </div>
    </EventModal>
  );
}
