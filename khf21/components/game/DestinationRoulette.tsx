'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    if (isSpinning || availableAirports.length === 0) return;

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
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6 space-y-6">
        {/* タイトル */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            ✈️ 次の目的地を選ぶ
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedAirport
              ? '目的地が決まりました！'
              : isSpinning
              ? 'ルーレット回転中...'
              : 'ボタンを押して目的地を決めよう'}
          </p>
        </div>

        {/* ルーレット表示 */}
        <div className="relative">
          <div
            className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border-4 ${
              selectedAirport
                ? 'border-green-500 animate-pulse'
                : isSpinning
                ? 'border-blue-500 animate-spin-slow'
                : 'border-gray-300 dark:border-gray-600'
            } transition-all duration-300`}
          >
            {currentAirport && (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">{currentAirport.icon || '🌍'}</div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    {currentAirport.city}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    {currentAirport.name_ja || currentAirport.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {currentAirport.country} ({currentAirport.code})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 矢印インジケーター */}
          {isSpinning && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-4xl animate-bounce">👇</div>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          {!selectedAirport ? (
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="w-full touch-target text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSpinning ? '回転中...' : '🎰 ルーレットを回す'}
            </Button>
          ) : (
            <Button
              onClick={() => onDestinationSelected(selectedAirport)}
              size="lg"
              className="w-full touch-target text-xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              ✓ この目的地に決定
            </Button>
          )}
        </div>

        {/* 候補リスト（小さく表示） */}
        {!isSpinning && !selectedAirport && (
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              候補: {availableAirports.length}空港
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
