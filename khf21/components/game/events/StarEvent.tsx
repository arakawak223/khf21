'use client';

import { useMemo } from 'react';
import EventModal from '../EventModal';
import type { Star } from '@/types/database.types';
import { getStarEncounterScenario, type EncounterLocation } from '@/lib/game/starEncounterScenarios';

interface StarEventProps {
  isOpen: boolean;
  onClose: () => void;
  star: Star;
  location: 'airport' | 'flight' | 'hotel' | 'restaurant';
}

export default function StarEvent({
  isOpen,
  onClose,
  star,
  location,
}: StarEventProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      musician: 'ミュージシャン',
      artist: 'アーティスト',
      movie_star: '映画スター',
      athlete: 'スポーツ選手',
    };
    return labels[category] || 'スター';
  };

  const getLocationLabel = (loc: string) => {
    const labels: Record<string, string> = {
      airport: '空港',
      flight: '機内',
      hotel: 'ホテル',
      restaurant: 'レストラン',
    };
    return labels[loc] || '旅先';
  };

  // シナリオをメモ化して、コンポーネントが再レンダリングされても同じシナリオを維持
  const encounterScenario = useMemo(() => {
    // location を EncounterLocation 型にマッピング
    let encounterLocation: EncounterLocation;
    switch (location) {
      case 'airport':
        encounterLocation = 'airport_lounge';
        break;
      case 'flight':
        encounterLocation = 'flight';
        break;
      case 'hotel':
        encounterLocation = 'hotel';
        break;
      case 'restaurant':
        encounterLocation = 'restaurant';
        break;
      default:
        encounterLocation = 'airport_lounge';
    }

    return getStarEncounterScenario(
      encounterLocation,
      star.name,
      star.name_ja || star.name
    );
  }, [location, star.name, star.name_ja]);

  return (
    <EventModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${star.name_ja || star.name}と遭遇！`}
      subtitle={getLocationLabel(location)}
      imageUrl={star.portrait_url || undefined}
      emoji="⭐"
      points={{ impressed: star.impressed_points }}
    >
      <div className="space-y-4">
        {/* カテゴリバッジ */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold">
            {getCategoryLabel(star.category)}
          </span>
          {star.nationality && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
              {star.nationality}
            </span>
          )}
        </div>

        {/* 遭遇ストーリー */}
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p>{encounterScenario.situation}</p>
          <p>{encounterScenario.interaction}</p>
        </div>

        {/* 説明 */}
        {star.description && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p>{star.description}</p>
          </div>
        )}

        {/* 感動体験メッセージ */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
          <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
            ✨ 感動体験
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {star.category === 'musician' &&
              '生で聴いたことのあるあの歌声の持ち主に会えるなんて、夢のようです。音楽への情熱を直接感じることができて、心が震えました。'}
            {star.category === 'artist' &&
              '作品を通じて感じていた世界観を、本人から直接聞くことができました。アートへの深い愛情と哲学に感動しました。'}
            {star.category === 'movie_star' &&
              'スクリーン越しに見ていた憧れのスターに会えるなんて！その輝きと優しさに、改めて魅了されました。'}
            {star.category === 'athlete' &&
              'あの伝説的なパフォーマンスを生み出した本人に会えました。スポーツへの真摯な姿勢と努力に深く感銘を受けました。'}
          </p>
        </div>

        {/* 思い出メモ */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
          この出会いは一生の思い出になるでしょう
        </div>
      </div>
    </EventModal>
  );
}
