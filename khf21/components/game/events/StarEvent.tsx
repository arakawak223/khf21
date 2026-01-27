'use client';

import { useMemo } from 'react';
import EventModal from '../EventModal';
import type { Star } from '@/types/database.types';
import { getStarEncounterScenario, type EncounterLocation } from '@/lib/game/starEncounterScenarios';

interface StarEventProps {
  isOpen: boolean;
  onClose: () => void;
  star: Star;
  location: EncounterLocation;
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

  const getLocationLabel = (loc: EncounterLocation) => {
    const labels: Record<EncounterLocation, string> = {
      flight: '機内',
      airport_lounge: '空港ラウンジ',
      airport_gate: '搭乗ゲート',
      hotel: 'ホテル',
      restaurant: 'レストラン',
      tourist_attraction: '観光名所',
      bar: 'バー',
      street: '街中',
      museum: '美術館',
      cafe: 'カフェ',
      theater: '劇場',
    };
    return labels[loc] || '旅先';
  };

  // シナリオをメモ化して、コンポーネントが再レンダリングされても同じシナリオを維持
  const encounterScenario = useMemo(() => {
    return getStarEncounterScenario(
      location,
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
      <div className="space-y-2">
        {/* カテゴリバッジ */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
            {getCategoryLabel(star.category)}
          </span>
          {star.nationality && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
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
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p>{star.description}</p>
          </div>
        )}

        {/* 体験メッセージ */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border-l-4 border-purple-500">
          <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
            ✨ 体験
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {star.category === 'musician' &&
              '生で聴いたことのあるあの歌声の持ち主に会えるなんて、夢のようです。音楽への情熱を直接感じることができて、心が震えました。'}
            {star.category === 'artist' &&
              '作品を通じて感じていた世界観を、本人から直接聞くことができました。アートへの深い愛情と哲学を感じました。'}
            {star.category === 'movie_star' &&
              'スクリーン越しに見ていた憧れのスターに会えるなんて！その輝きと優しさに、改めて魅了されました。'}
            {star.category === 'athlete' &&
              'あの伝説的なパフォーマンスを生み出した本人に会えました。スポーツへの真摯な姿勢と努力に深く感銘を受けました。'}
          </p>
        </div>

        {/* 思い出メモ */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 italic">
          この出会いは一生の思い出になるでしょう
        </div>
      </div>
    </EventModal>
  );
}
