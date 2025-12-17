'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Airport } from '@/types/database.types';

interface DestinationIntroProps {
  airport: Airport;
  distance: number;
  stayDays: number;
  onContinue: () => void;
}

const REGION_NAMES: Record<string, string> = {
  asia: 'アジア',
  europe: 'ヨーロッパ',
  north_america: '北米',
  south_america: '南米',
  africa: 'アフリカ',
  oceania: 'オセアニア',
  middle_east: '中東',
};

export default function DestinationIntro({
  airport,
  distance,
  stayDays,
  onContinue,
}: DestinationIntroProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up shadow-2xl">
        <div className="p-6 space-y-4">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="text-6xl mb-2">✈️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {airport.city}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {airport.name_ja || airport.name}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{airport.country}</span>
              <span>•</span>
              <span>{REGION_NAMES[airport.region || ''] || airport.region}</span>
              <span>•</span>
              <span className="font-mono font-bold">{airport.code}</span>
            </div>
          </div>

          {/* 都市の説明 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2">
              🌍 この都市について
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getCityDescription(airport)}
            </p>
          </div>

          {/* 旅の情報 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                距離
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {distance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">km</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                滞在日数
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stayDays}
              </p>
              <p className="text-xs text-gray-500">日間</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                飛行時間
              </p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {Math.round(distance / 800)}
              </p>
              <p className="text-xs text-gray-500">時間</p>
            </div>
          </div>

          {/* メッセージ */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              ✨ 素敵な旅になりそうですね！<br />
              それでは、さっそく出発しましょう！
            </p>
          </div>

          {/* 次へボタン */}
          <Button
            onClick={onContinue}
            size="lg"
            className="w-full touch-target text-xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            🛫 出発する
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 都市の簡単な説明を生成（将来的にはデータベースから取得）
function getCityDescription(airport: Airport): string {
  const descriptions: Record<string, string> = {
    Tokyo: '日本の首都であり、伝統と革新が融合した世界有数のメガシティ。美しい寺社仏閣、最先端のテクノロジー、そして美味しい食文化が魅力です。',
    'New York': 'アメリカ最大の都市で、世界の経済・文化・芸術の中心地。自由の女神やタイムズスクエアなど、象徴的なランドマークが数多くあります。',
    London: 'イギリスの首都で、長い歴史と王室の伝統が息づく国際都市。ビッグベン、大英博物館など、見どころが満載です。',
    Paris: 'フランスの首都で、「花の都」として知られる美しい街。エッフェル塔、ルーブル美術館など、芸術と文化の宝庫です。',
    Dubai: 'アラブ首長国連邦の都市で、世界一高いビルや人工島など、未来的な建築物が立ち並ぶ砂漠のオアシス。',
    Singapore: '東南アジアの国際的な金融都市。多文化が融合し、清潔で緑豊かな都市環境が特徴です。',
    Seoul: '韓国の首都で、現代的なビルと歴史的な宮殿が共存する活気ある都市。K-POPや韓国料理で世界的に有名です。',
    Sydney: 'オーストラリア最大の都市。美しいハーバーとオペラハウスが象徴的で、ビーチとアウトドアライフスタイルが魅力です。',
  };

  return (
    descriptions[airport.city] ||
    `${airport.city}は${airport.country}の主要都市の一つです。この地域の文化や自然、そして人々との出会いを楽しんでください！`
  );
}
