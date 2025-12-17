'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Airport } from '@/types/database.types';

interface DestinationRouletteProps {
  availableAirports: Airport[];
  onDestinationSelected: (airport: Airport) => void;
}

export default function DestinationRoulette({
  availableAirports,
  onDestinationSelected,
}: DestinationRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  // ルーレットを回す
  const handleSpin = () => {
    console.log('handleSpin called', { isSpinning, airportsCount: availableAirports.length });
    if (isSpinning || availableAirports.length === 0) {
      console.log('Spin blocked:', { isSpinning, airportsCount: availableAirports.length });
      return;
    }

    console.log('Starting spin...');
    setIsSpinning(true);
    setSelectedAirport(null);

    // ランダムに目的地を選択
    const randomIndex = Math.floor(Math.random() * availableAirports.length);
    let counter = 0;
    const spinDuration = 3000; // 3秒
    const spinSpeed = 100; // 100msごとに切り替え

    const interval = setInterval(() => {
      counter++;
      setCurrentIndex((prev) => (prev + 1) % availableAirports.length);

      if (counter * spinSpeed >= spinDuration) {
        clearInterval(interval);
        setCurrentIndex(randomIndex);
        setSelectedAirport(availableAirports[randomIndex]);
        setIsSpinning(false);
      }
    }, spinSpeed);
  };

  const currentAirport = availableAirports[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto" style={{ perspective: '1200px' }}>
      <style jsx>{`
        @keyframes slot-flash {
          0%, 100% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 50px rgba(59, 130, 246, 0.9), 0 0 100px rgba(168, 85, 247, 0.7);
          }
        }
        .slot-machine-glow {
          animation: slot-flash 1.5s ease-in-out infinite;
        }
        @keyframes neon-pulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(59, 130, 246, 0.6);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(59, 130, 246, 0.9);
          }
        }
        .neon-text {
          animation: neon-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative">
        {/* スロットマシン風外枠 */}
        <div
          className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl"
          style={{
            transform: 'rotateX(5deg)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* トップネオンサイン */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white neon-text mb-2">
              ✈️ DESTINATION ROULETTE
            </h2>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    isSpinning
                      ? 'bg-red-500 animate-pulse'
                      : selectedAirport
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* スロット表示部 - 3Dボックス */}
          <div className="relative mb-6">
            {/* 外側のゴールドフレーム */}
            <div className="absolute -inset-3 bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700 rounded-2xl opacity-80 blur-sm"></div>
            <div className="absolute -inset-2 bg-gradient-to-br from-yellow-700 via-amber-600 to-yellow-800 rounded-2xl shadow-xl"></div>

            {/* メイン表示ボックス */}
            <div
              className={`relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl p-10 border-4 ${
                selectedAirport
                  ? 'border-green-400 slot-machine-glow'
                  : isSpinning
                  ? 'border-blue-400'
                  : 'border-gray-700'
              }`}
              style={{
                transform: 'translateZ(20px)',
                boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.8)',
                minHeight: '280px',
              }}
            >
              {/* トップの矢印 */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[28px] border-l-transparent border-r-transparent border-t-yellow-500 shadow-lg"></div>
              </div>

              {currentAirport && (
                <div className="text-center space-y-5">
                  {/* アイコン - 3Dエフェクト付き */}
                  <div
                    className={`text-8xl ${isSpinning ? 'animate-bounce' : selectedAirport ? 'animate-pulse' : ''}`}
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))',
                      transform: 'translateZ(30px)',
                    }}
                  >
                    ✈️
                  </div>

                  {/* 都市名 */}
                  <div>
                    <h3
                      className={`text-5xl font-bold mb-3 ${
                        selectedAirport
                          ? 'text-green-400 neon-text'
                          : 'text-white'
                      }`}
                      style={{
                        textShadow: selectedAirport
                          ? '0 0 20px rgba(74, 222, 128, 0.8)'
                          : '0 4px 8px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {currentAirport.city}
                    </h3>
                    <p className="text-xl text-gray-300 mb-2">
                      {currentAirport.name_ja || currentAirport.name}
                    </p>
                    <div className="flex justify-center items-center gap-3 text-sm">
                      <span className="px-3 py-1 rounded-full bg-blue-600/50 text-blue-200 font-semibold">
                        {currentAirport.country}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-600/50 text-purple-200 font-semibold">
                        {currentAirport.code}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 回転中のライトバー */}
              {isSpinning && (
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute h-full w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse left-1/4"></div>
                  <div className="absolute h-full w-1 bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse right-1/4"></div>
                </div>
              )}
            </div>
          </div>

          {/* ステータス表示 */}
          <div className="text-center mb-6">
            <div className="inline-block px-6 py-3 rounded-full bg-black/50 border-2 border-gray-700">
              <p className="text-lg font-bold text-white">
                {selectedAirport
                  ? '🎉 目的地が決まりました！'
                  : isSpinning
                  ? '🎲 ルーレット回転中...'
                  : '✨ ボタンを押して目的地を決めよう'}
              </p>
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="flex gap-4 relative z-10">
            {!selectedAirport ? (
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                size="lg"
                className="w-full touch-target text-2xl font-bold py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl transform transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
                style={{
                  boxShadow: '0 10px 40px rgba(147, 51, 234, 0.5)',
                }}
              >
                {isSpinning ? '🎰 スピン中...' : '🎲 ルーレットを回す'}
              </Button>
            ) : (
              <Button
                onClick={() => onDestinationSelected(selectedAirport)}
                size="lg"
                className="w-full touch-target text-2xl font-bold py-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-2xl transform transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
                style={{
                  boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5)',
                }}
              >
                ✓ この目的地に決定
              </Button>
            )}
          </div>

          {/* 下部情報 */}
          {!isSpinning && !selectedAirport && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <span className="text-yellow-400 text-sm font-semibold">🌐 候補空港:</span>
                <span className="text-white text-sm font-bold">{availableAirports.length}</span>
              </div>
            </div>
          )}

          {/* サイドのネオンライン装飾 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-r-full opacity-60"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-l-full opacity-60"></div>
        </div>

        {/* 下部の影 */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-8 bg-black/40 blur-2xl rounded-full"></div>
      </div>
    </div>
  );
}
