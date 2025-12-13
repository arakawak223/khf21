'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { spinRoulette } from '@/lib/game/utils';
import { ANIMATION_DURATION } from '@/lib/game/constants';

interface RouletteProps {
  onSpinComplete: (result: number) => void;
  disabled?: boolean;
}

export default function Roulette({ onSpinComplete, disabled = false }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    const result = spinRoulette(); // 1-6の乱数

    // アニメーション用の回転角度を計算
    // 1回転 = 360度、複数回転させて最終的に結果の角度で止まる
    const baseRotation = 360 * 5; // 5回転
    const numberAngle = (result - 1) * 60; // 各数字は60度間隔（360/6）
    const finalRotation = rotation + baseRotation + numberAngle;

    setRotation(finalRotation);

    // 数字をアニメーション中に変化させる
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setCurrentNumber((counter % 6) + 1);
    }, 100);

    // アニメーション完了後
    setTimeout(() => {
      clearInterval(interval);
      setCurrentNumber(result);
      setIsSpinning(false);
      onSpinComplete(result);
    }, ANIMATION_DURATION.ROULETTE_SPIN);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      {/* ルーレット円盤 */}
      <div className="relative">
        <div
          className={`
            w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
            flex items-center justify-center shadow-2xl
            transition-transform duration-[3000ms] ease-out
            ${isSpinning ? 'scale-110' : 'scale-100'}
          `}
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* 中央の数字表示 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span
                className={`
                  text-6xl font-bold text-gray-800
                  ${isSpinning ? 'animate-pulse' : ''}
                `}
              >
                {currentNumber || '?'}
              </span>
            </div>
          </div>

          {/* 6つの数字を円周上に配置 */}
          {[1, 2, 3, 4, 5, 6].map((num, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180); // -90度でトップから開始
            const x = Math.cos(angle) * 90;
            const y = Math.sin(angle) * 90;
            return (
              <div
                key={num}
                className="absolute w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-800 shadow-md"
                style={{
                  left: `calc(50% + ${x}px - 20px)`,
                  top: `calc(50% + ${y}px - 20px)`,
                }}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* トップの矢印（どの数字で止まったかを示す） */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
        </div>
      </div>

      {/* 結果表示 */}
      {currentNumber !== null && !isSpinning && (
        <div className="text-center animate-fade-in">
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {currentNumber}マス進む！
          </p>
        </div>
      )}

      {/* スピンボタン */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        size="lg"
        className="touch-target text-xl font-bold px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      >
        {isSpinning ? 'スピン中...' : 'ルーレットを回す'}
      </Button>

      {/* ヒントテキスト */}
      {!isSpinning && currentNumber === null && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mobile-text">
          ボタンをタップしてルーレットを回しましょう
        </p>
      )}
    </div>
  );
}
