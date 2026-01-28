'use client';

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'game' | 'story'>('game');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mobile-container">
        {/* ヘッダー */}
        <div className="flex justify-end mb-8 gap-4">
          <Suspense>
            <AuthButton />
          </Suspense>
          <ThemeSwitcher />
        </div>

        {/* メインコンテンツ */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">
              夢旅ライトフライヤー２１
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              世界初の飛行機から進化した21世紀の翼
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              ライト兄弟の「ライトフライヤー１」のおかげで実現した空の旅。<br />
              21世紀版ライトフライヤーで世界の空を駆け巡ろう！
            </p>
          </div>

          {/* タブ付きゲーム説明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* タブヘッダー */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('game')}
                className={`flex-1 px-6 py-4 text-base font-semibold transition-colors ${
                  activeTab === 'game'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                🎮 ゲームについて
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`flex-1 px-6 py-4 text-base font-semibold transition-colors ${
                  activeTab === 'story'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                ✈️ ライト兄弟の革新
              </button>
            </div>

            {/* タブコンテンツ */}
            <div className="p-6 text-left">
              {activeTab === 'game' && (
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p className="flex items-start gap-2">
                    <span className="text-2xl">✨</span>
                    <span>
                      世界中の名所を訪れ、スターと出会い、感動体験を積み重ねよう
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-2xl">🎁</span>
                    <span>
                      旅先で出会う人々に喜びを提供し、ギバーポイントを獲得しよう
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-2xl">🌍</span>
                    <span>
                      世界100空港を巡る壮大な旅。期間は1週間から1年まで選択可能
                    </span>
                  </p>
                </div>
              )}

              {activeTab === 'story' && (
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    <span className="font-bold text-blue-600 dark:text-blue-400">自動車が走っている時代に、自転車屋のライト兄弟が歴史を変えた。</span>
                  </p>

                  <p>
                    不安定な二輪の乗り物を操縦する技術。止まれば倒れる自転車も、走って操れば安定し速く進む。この発想を応用し、<span className="font-semibold">3軸制御、アルミニウム製エンジン、双推進プロペラ</span>など、画期的な技術とアイデアでライトフライヤー１号は誕生した。
                  </p>

                  <p className="text-sm italic bg-amber-50 dark:bg-amber-900/20 p-3 rounded border-l-4 border-amber-500">
                    ネガティブな環境、不安定な状態だからこそ、それらを解消する革新は生まれる。
                  </p>

                  <p>
                    『<span className="font-bold text-purple-600 dark:text-purple-400">夢旅ライトフライヤー２１</span>』は、世界中の素晴らしいモノや文化を体験し、歴史を作ってきた人々と出会う旅のゲーム。<span className="font-semibold">人生の苦楽を楽しみ、夢を追いかける冒険</span>へようこそ。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ゲーム開始ボタン */}
          <div className="space-y-4">
            <Link href="/game">
              <Button
                size="lg"
                className="touch-target text-2xl font-bold px-12 py-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl"
              >
                🎮 ゲームを始める
              </Button>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ※ ログインしていない場合は、ゲスト状態でプレイできます
            </p>
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>夢旅ライトフライヤー２１ v1.0</p>
        </footer>
      </div>
    </main>
  );
}
