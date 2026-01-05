'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { GAME_CARDS, MISSIONS } from '@/lib/game/strategyData';

export default function CardGuidePage() {
  const router = useRouter();

  // カテゴリごとにカードを分類
  const attackCards = GAME_CARDS.filter(card => card.category === 'attack');
  const defenseCards = GAME_CARDS.filter(card => card.category === 'defense');
  const boostCards = GAME_CARDS.filter(card => card.category === 'boost');

  // レアリティの背景グラデーション
  const getRarityGradient = (rarity: 1 | 2 | 3) => {
    switch (rarity) {
      case 1:
        return 'from-gray-400 to-gray-600'; // コモン
      case 2:
        return 'from-blue-400 to-blue-600'; // レア
      case 3:
        return 'from-purple-400 via-pink-500 to-yellow-500'; // 超レア
    }
  };

  const getRarityName = (rarity: 1 | 2 | 3) => {
    switch (rarity) {
      case 1:
        return 'コモン';
      case 2:
        return 'レア';
      case 3:
        return '超レア';
    }
  };

  return (
    <div className="mobile-container py-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← 戻る
        </Button>

        <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🎯 ミッション & カードガイド</h1>
            <p className="text-sm opacity-90">
              ミッションとカードの使い方をマスターしよう
            </p>
          </div>
        </Card>
      </div>

      {/* カードの基本説明 */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📖</span>
          <span>カードについて</span>
        </h2>
        <div className="space-y-3 text-sm">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="font-semibold mb-1">🎁 カードの入手方法</p>
            <p className="text-gray-700 dark:text-gray-300">
              ・目的地到着時にランダムで獲得<br />
              ・ミッション達成報酬として獲得<br />
              ・特別なイベントで獲得
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="font-semibold mb-1">⏰ カードの使用タイミング</p>
            <p className="text-gray-700 dark:text-gray-300">
              ・自分のターン中に使用可能<br />
              ・マップ画面で右下のカードボタンから選択<br />
              ・使用したカードは消費されます
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p className="font-semibold mb-1">⭐ レアリティ</p>
            <p className="text-gray-700 dark:text-gray-300">
              ・★ コモン：よく出現する基本カード<br />
              ・★★ レア：やや強力な効果のカード<br />
              ・★★★ 超レア：非常に強力なカード
            </p>
          </div>
        </div>
      </Card>

      {/* ミッションについて */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>ミッションについて</span>
        </h2>
        <div className="space-y-3 text-sm">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-semibold mb-1">📋 ミッションとは</p>
            <p className="text-gray-700 dark:text-gray-300">
              ゲーム中に達成できる目標です。達成すると豪華な報酬が手に入ります。
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-semibold mb-1">🎁 報酬の種類</p>
            <p className="text-gray-700 dark:text-gray-300">
              ・<span className="font-bold text-yellow-600">ポイント</span>: 最終スコアに加算<br />
              ・<span className="font-bold text-purple-600">カード</span>: 戦略カードを獲得
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-semibold mb-1">⭐ 難易度</p>
            <p className="text-gray-700 dark:text-gray-300">
              ・★: 簡単（序盤で達成可能）<br />
              ・★★: 普通（中盤までに達成）<br />
              ・★★★: 難しい（終盤までかかる）
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-semibold mb-1">👀 確認方法</p>
            <p className="text-gray-700 dark:text-gray-300">
              画面右上の「ミッション」ボタンをタップすると、進捗状況を確認できます。
            </p>
          </div>
        </div>

        {/* ミッションの例 */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>📝</span>
            <span>ミッションの例</span>
          </h3>
          <div className="space-y-3">
            {MISSIONS.slice(0, 4).map((mission) => (
              <div
                key={mission.id}
                className="relative rounded-lg p-4 border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mission.icon}</span>
                    <div>
                      <div className="font-bold">{mission.nameJa}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {mission.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-yellow-500 text-sm">
                    {'⭐'.repeat(mission.difficulty)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  {mission.rewardPoints > 0 && (
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      <span className="font-bold text-yellow-600">
                        +{mission.rewardPoints}pt
                      </span>
                    </div>
                  )}
                  {mission.rewardCards && mission.rewardCards > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🎴</span>
                      <span className="font-bold text-purple-600">
                        +{mission.rewardCards}枚
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 攻撃カード */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⚔️</span>
          <span className="text-red-600">攻撃カード</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          相手プレイヤーを妨害するカード。対戦を有利に進めよう！
        </p>
        <div className="space-y-3">
          {attackCards.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg p-4 border-2 border-red-200 dark:border-red-800"
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${getRarityGradient(card.rarity)} opacity-10`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <div className="font-bold">{card.nameJa}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {card.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-yellow-500 text-sm">
                      {'⭐'.repeat(card.rarity)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRarityName(card.rarity)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 防御カード */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🛡️</span>
          <span className="text-blue-600">防御カード</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          相手の攻撃から身を守るカード。予め使用して備えよう！
        </p>
        <div className="space-y-3">
          {defenseCards.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800"
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${getRarityGradient(card.rarity)} opacity-10`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <div className="font-bold">{card.nameJa}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {card.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-yellow-500 text-sm">
                      {'⭐'.repeat(card.rarity)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRarityName(card.rarity)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ブーストカード */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🚀</span>
          <span className="text-green-600">ブーストカード</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          自分を強化するカード。ゲームを有利に進めよう！
        </p>
        <div className="space-y-3">
          {boostCards.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg p-4 border-2 border-green-200 dark:border-green-800"
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${getRarityGradient(card.rarity)} opacity-10`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <div className="font-bold">{card.nameJa}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {card.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-yellow-500 text-sm">
                      {'⭐'.repeat(card.rarity)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRarityName(card.rarity)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 戦略のヒント */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>戦略のヒント</span>
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0">🎯</span>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">タイミングが重要：</span>防御カードは攻撃される前に使おう
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0">🎲</span>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">コンボを狙う：</span>ポイント2倍カードを使ってから目的地へ到着
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0">🎴</span>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">カードを貯める：</span>重要な局面で使えるよう温存も選択肢
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0">⚡</span>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">リードしたら守備：</span>トップを走っているときは防御カードで守りを固めよう
            </p>
          </div>
        </div>
      </Card>

      {/* フッター */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => router.push('/game')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          ゲームを始める
        </Button>
      </div>
    </div>
  );
}
