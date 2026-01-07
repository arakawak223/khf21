'use client';

import EventModal from '../EventModal';
import type { Gourmet } from '@/types/database.types';

interface GourmetEventProps {
  isOpen: boolean;
  onClose: () => void;
  gourmet: Gourmet;
}

export default function GourmetEvent({
  isOpen,
  onClose,
  gourmet,
}: GourmetEventProps) {
  return (
    <EventModal
      isOpen={isOpen}
      onClose={onClose}
      title={gourmet.name_ja}
      subtitle={`${gourmet.city || ''}, ${gourmet.country}`}
      imageUrl={gourmet.image_url || undefined}
      emoji="🍽️"
      points={{ impressed: gourmet.impressed_points }}
    >
      <div className="space-y-2">
        {/* 料理タイプバッジ */}
        {gourmet.cuisine_type && (
          <div className="flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
              {gourmet.cuisine_type}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
              {gourmet.country}料理
            </span>
          </div>
        )}

        {/* 説明文 */}
        {gourmet.description && (
          <div className="text-gray-700 dark:text-gray-300">
            <p>{gourmet.description}</p>
          </div>
        )}

        {/* グルメ体験メッセージ */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-2 border-l-4 border-orange-500">
          <p className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-1">
            🍽️ グルメ体験
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            この土地ならではの味わいに舌鼓を打ちました。食材の新鮮さ、調理の技術、
            そして料理に込められた情熱が一口ごとに伝わってきます。
            食を通じてその土地の文化と歴史を感じることができました。
            この味は一生忘れられない思い出となりました。
          </p>
        </div>

        {/* 豆知識 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
          <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">
            💡 豆知識
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ご当地グルメは、その地域の気候、風土、歴史が育んだ食文化の結晶です。
            地元の食材と伝統的な調理法が生み出す味わいは、
            その土地でしか体験できない特別なものです。
          </p>
        </div>

        {/* 場所情報 */}
        {gourmet.city && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <span>📍</span>
              <span>{gourmet.city}</span>
            </div>
          </div>
        )}
      </div>
    </EventModal>
  );
}
