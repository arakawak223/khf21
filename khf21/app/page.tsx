import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
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
              世界を飛び回る冒険
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              ルーレットを回して飛行機で世界を旅しよう
            </p>
          </div>

          {/* ゲーム説明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl space-y-4 text-left">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              ゲームについて
            </h3>
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
