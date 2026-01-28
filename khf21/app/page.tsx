import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { GameInfoTabs } from "@/components/game-info-tabs";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
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
          <GameInfoTabs />

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
