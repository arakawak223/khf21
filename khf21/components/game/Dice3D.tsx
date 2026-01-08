'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Dice3DProps {
  onRollComplete: (result: number) => void;
  disabled?: boolean;
  autoPlay?: boolean; // 自動実行モード（フリーマン用）
  maxNumber?: number; // 最大値（6 or 12）デフォルト6
}

export default function Dice3D({ onRollComplete, disabled = false, autoPlay = false, maxNumber = 6 }: Dice3DProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canStop, setCanStop] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(0);
  const currentRotationRef = useRef(0); // 現在の回転角度を追跡
  const decelerationRate = useRef(0.96); // 減速率（0.96 = 4%ずつ減速）
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayExecutedRef = useRef(false); // autoPlay実行済みフラグ
  const isSpinningRef = useRef(false); // isSpinningの同期的な追跡用

  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1); // 1からmaxNumberまで
  const anglePerNumber = 360 / maxNumber; // 均等に配置

  const handleStart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('[Dice3D] handleStart called');
    if (isSpinning || disabled) {
      console.log('[Dice3D] Start blocked - isSpinning:', isSpinning, 'disabled:', disabled);
      return;
    }

    console.log('[Dice3D] Starting dice roll');
    setIsSpinning(true);
    isSpinningRef.current = true; // 同期的に追跡
    setCanStop(false);
    setResult(null);
    setShowZoom(false); // ズーム表示をリセット
    setDebugInfo(''); // デバッグ情報をリセット
    speedRef.current = 30; // 初期速度（度/フレーム）

    // 0.5秒後にストップボタンを有効化
    setTimeout(() => {
      setCanStop(true);
    }, 500);

    // 高速回転アニメーション開始
    const animate = () => {
      currentRotationRef.current = (currentRotationRef.current + speedRef.current) % 360;
      setRotation(currentRotationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const handleStop = (e?: React.MouseEvent | boolean, forceStopParam?: boolean) => {
    // 引数の処理: eがbooleanの場合は後方互換性のため forceStop として扱う
    let forceStop = false;
    if (typeof e === 'boolean') {
      forceStop = e;
    } else {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      forceStop = forceStopParam || false;
    }

    console.log('[Dice3D] handleStop() called - canStop:', canStop, 'isSpinning:', isSpinning, 'isSpinningRef:', isSpinningRef.current, 'forceStop:', forceStop);

    // isSpinningRefを使って同期的にチェック
    if (!isSpinningRef.current) {
      console.log('[Dice3D] handleStop() returning early - not spinning (ref check)');
      return;
    }

    if (!forceStop && !canStop) {
      console.log('[Dice3D] handleStop() returning early - canStop is false');
      return;
    }

    console.log('[Dice3D] handleStop() proceeding with deceleration');
    setCanStop(false);

    // アニメーションを停止
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 自然な減速アニメーション
    const decelerate = () => {
      // 速度を減速率で減らす
      speedRef.current *= decelerationRate.current;

      // 回転を更新
      currentRotationRef.current += speedRef.current;
      setRotation(currentRotationRef.current % 360);

      // 速度が十分に遅くなったら停止
      if (Math.abs(speedRef.current) < 0.1) {
        // 完全に停止
        speedRef.current = 0;
        setIsSpinning(false);
        isSpinningRef.current = false; // 同期的に追跡

        // 停止位置から数字を判定（新しいシンプルな方法）
        const finalRotation = currentRotationRef.current % 360;
        const arrowAngle = 270; // 矢印の固定位置

        // 各数字の現在位置を計算し、矢印に最も近い数字を見つける
        let closestNumber = 1;
        let minDistance = 360;

        numbers.forEach((num, index) => {
          // CSSでは rotate(angle)deg translateY(-140px) で配置
          // これは270度（上側）から時計回りに配置される
          // 数字の初期位置は 270度 + (index * 60度)
          const numberInitialAngle = 270 + (index * anglePerNumber);
          // ルーレットの回転を加える
          const numberCurrentAngle = (numberInitialAngle + finalRotation) % 360;

          // 矢印との距離を計算（最短距離を考慮）
          let distance = Math.abs(numberCurrentAngle - arrowAngle);
          if (distance > 180) {
            distance = 360 - distance;
          }

          // 最も近い数字を記録
          if (distance < minDistance) {
            minDistance = distance;
            closestNumber = num;
          }

          console.log(`数字${num}: 初期${numberInitialAngle}度 → 現在${numberCurrentAngle.toFixed(1)}度, 矢印との距離${distance.toFixed(1)}度`);
        });

        const finalNumber = closestNumber;
        console.log('停止位置:', finalRotation.toFixed(1), '度');
        console.log('判定された数字:', finalNumber, '(距離:', minDistance.toFixed(1), '度)');

        // デバッグ情報を画面に表示
        setDebugInfo(`停止: ${finalRotation.toFixed(1)}° | 判定: 数字${finalNumber} (距離: ${minDistance.toFixed(1)}°)`);

        // 結果を表示
        setResult(finalNumber);
        setShowZoom(true);

        // 2.5秒後にズームを閉じる
        setTimeout(() => {
          setShowZoom(false);
        }, 2500);

        // 少し遅れてコールバック
        setTimeout(() => {
          onRollComplete(finalNumber);
        }, 1500);
      } else {
        // 継続
        animationRef.current = requestAnimationFrame(decelerate);
      }
    };

    decelerate();
  };

  // autoPlay時の自動実行（マウント時のみ）
  useEffect(() => {
    // autoPlayが有効で、まだ実行していない場合のみ実行
    if (autoPlay && !autoPlayExecutedRef.current) {
      console.log('AutoPlay: Starting dice roll');
      autoPlayExecutedRef.current = true; // 実行済みフラグを立てる

      // 少し待機してから自動スタート
      const startTimer = setTimeout(() => {
        console.log('AutoPlay: Calling handleStart()');
        handleStart();

        // 1-2秒後に自動ストップ
        const stopDelay = 1000 + Math.random() * 1000;
        console.log('AutoPlay: Will auto-stop after', stopDelay, 'ms');
        autoPlayTimerRef.current = setTimeout(() => {
          console.log('AutoPlay: Calling handleStop() with forceStop=true');
          handleStop(true); // forceStop=trueで強制停止
        }, stopDelay);
      }, 500);

      return () => {
        console.log('AutoPlay: Cleanup called');
        clearTimeout(startTimer);
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
          autoPlayTimerRef.current = null;
        }
        // isSpinningRefをリセット
        isSpinningRef.current = false;
        // NOTE: autoPlayExecutedRefはリセットしない（厳格モードでの2重実行を防ぐため）
      };
    }
  }, [autoPlay]); // autoPlayのみに依存

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      // コンポーネントアンマウント時にフラグをリセット
      autoPlayExecutedRef.current = false;
      isSpinningRef.current = false;
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {/* 左右のスワイプインジケーター */}
      <div className="fixed left-0 top-0 bottom-0 w-6 z-20 pointer-events-none">
        <div className="h-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-blue-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-transparent animate-pulse" />
          {/* スワイプ方向インジケーター */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-white/60 text-2xl animate-bounce">
            ◀
          </div>
        </div>
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-6 z-20 pointer-events-none">
        <div className="h-full relative">
          <div className="absolute inset-0 bg-gradient-to-l from-green-600/40 via-green-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-green-400/30 to-transparent animate-pulse" />
          {/* スワイプ方向インジケーター */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 text-2xl animate-bounce">
            ▶
          </div>
        </div>
      </div>

      {/* ボタン - autoPlay時は非表示 */}
      {!autoPlay && (
        <>
          {!isSpinning ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dice3D] Start button clicked');
                handleStart();
              }}
              disabled={disabled}
              size="lg"
              type="button"
              className="touch-target text-2xl font-bold px-12 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-green-400 relative z-50"
            >
              ▶️ スタート
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Dice3D] Stop button clicked - canStop:', canStop);
                handleStop();
              }}
              disabled={!canStop}
              size="lg"
              type="button"
              className="touch-target text-2xl font-bold px-12 py-6 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-red-400 relative z-50"
            >
              ⏹️ ストップ
            </Button>
          )}
        </>
      )}

      {/* autoPlay時のメッセージ */}
      {autoPlay && isSpinning && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="text-lg font-semibold flex items-center gap-2">
            <span className="animate-spin">⚙️</span>
            <span>フリーマンがルーレットを回しています...</span>
          </p>
        </div>
      )}

      {/* デバッグ情報 */}
      {debugInfo && (
        <div className="bg-blue-900 text-white px-4 py-2 rounded text-sm font-mono">
          {debugInfo}
        </div>
      )}

      {/* ルーレット表示エリア */}
      <div className="relative w-full max-w-xs mx-auto px-2" style={{ perspective: '1500px' }}>
        {/* 上部の矢印インジケーター - 改善版 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-30">
          <div
            className="relative"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            }}
          >
            {/* 矢印の背景光 */}
            <div
              className="absolute inset-0 blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
            />
            <div className="text-5xl animate-bounce relative">
              ⬇️
            </div>
          </div>
        </div>

        {/* ルーレット本体 */}
        <div
          className="relative mx-auto w-full aspect-square"
          style={{
            maxWidth: '320px',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(15deg)',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
          }}
        >
          {/* 外枠 - 豪華な装飾 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f9d67a 25%, #d4af37 50%, #b8941e 75%, #d4af37 100%)',
              boxShadow: `
                0 0 0 8px #b8941e,
                0 0 0 12px #d4af37,
                0 0 0 16px #8b7355,
                inset 0 4px 12px rgba(0,0,0,0.4),
                inset 0 -4px 12px rgba(255,255,255,0.3),
                0 25px 50px rgba(0,0,0,0.5)
              `,
            }}
          />

          {/* 装飾的なリベット */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={`rivet-${angle}`}
              className="absolute"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #e5c77a, #8b7355)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px)`,
              }}
            />
          ))}

          {/* 回転するルーレット盤 */}
          <div
            className="absolute inset-4 rounded-full overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: !isSpinning ? 'none' : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* ルーレットの背景 - リッチな質感 */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  linear-gradient(135deg, #1a5c3a 0%, #0d4d2a 50%, #1a5c3a 100%)
                `,
                boxShadow: `
                  inset 0 0 60px rgba(0,0,0,0.5),
                  inset 0 0 30px rgba(0,100,0,0.3)
                `,
              }}
            >
              {/* フェルトのようなテクスチャ */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.03) 10px, transparent 20px)
                  `,
                  opacity: 0.3,
                }}
              />
            </div>

            {/* 数字を円周上に配置 */}
            {numbers.map((num, index) => {
              const angle = index * anglePerNumber;
              // 12個の数字の場合はサイズを小さく
              const numberSize = maxNumber > 6 ? 45 : 60;
              const numberRadius = maxNumber > 6 ? 110 : 105;
              const fontSize = maxNumber > 6 ? 'text-2xl' : 'text-3xl';
              return (
                <div key={num}>
                  {/* 数字 */}
                  <div
                    className="absolute top-1/2 left-1/2 origin-center"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-${numberRadius}px)`,
                      width: `${numberSize}px`,
                      height: `${numberSize}px`,
                      marginLeft: `-${numberSize / 2}px`,
                      marginTop: `-${numberSize / 2}px`,
                    }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center rounded-full"
                      style={{
                        transform: `rotate(${-angle - rotation}deg)`,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%)',
                        boxShadow: `
                          0 3px 6px rgba(0,0,0,0.3),
                          inset 0 1px 3px rgba(255,255,255,0.8),
                          inset 0 -1px 3px rgba(0,0,0,0.2),
                          0 0 0 ${maxNumber > 6 ? 2 : 3}px #ffd700,
                          0 0 0 ${maxNumber > 6 ? 3 : 4}px #d4af37
                        `,
                      }}
                    >
                      <span
                        className={`${fontSize} font-black`}
                        style={{
                          background: 'linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))',
                        }}
                      >
                        {num}
                      </span>
                    </div>
                  </div>

                  {/* 区切り線（数字の後ろ、次の数字との間） - 豪華版 */}
                  <div
                    className="absolute top-1/2 left-1/2 origin-center"
                    style={{
                      transform: `rotate(${angle + anglePerNumber / 2}deg) translateY(-120px)`,
                      width: '4px',
                      height: '35px',
                      marginLeft: '-2px',
                      marginTop: '-17.5px',
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: 'linear-gradient(90deg, #b8941e 0%, #ffd700 50%, #b8941e 100%)',
                        boxShadow: `
                          0 0 6px rgba(255,215,0,0.6),
                          inset 0 1px 2px rgba(255,255,255,0.5),
                          inset 0 -1px 2px rgba(0,0,0,0.3)
                        `,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* 中央の装飾 - 豪華な中心飾り */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '75px',
                height: '75px',
              }}
            >
              {/* 外側の輪 */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #ffd700, #ffed4e, #ffd700, #d4af37, #ffd700)',
                  boxShadow: `
                    0 0 20px rgba(255,215,0,0.8),
                    inset 0 2px 8px rgba(255,255,255,0.6),
                    inset 0 -2px 8px rgba(0,0,0,0.4)
                  `,
                  animation: 'spin 20s linear infinite',
                }}
              />
              {/* 内側の円 */}
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #f9d67a, #d4af37, #8b7355)',
                  boxShadow: `
                    inset 0 4px 8px rgba(0,0,0,0.5),
                    0 2px 4px rgba(255,255,255,0.3)
                  `,
                }}
              />
              {/* 中心の宝石 */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '22px',
                  height: '22px',
                  background: 'radial-gradient(circle at 30% 30%, #fff, #ffd700, #d4af37)',
                  boxShadow: `
                    0 0 12px rgba(255,255,255,0.8),
                    inset 0 1px 3px rgba(255,255,255,0.6),
                    0 3px 6px rgba(0,0,0,0.3)
                  `,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 結果表示 - ズームイン */}
      {showZoom && result !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          style={{
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div
            className="text-center"
            style={{
              animation: 'zoomIn 0.5s ease-out',
            }}
          >
            {/* 大きな数字 */}
            <div
              className="text-[20rem] font-black text-white mb-8"
              style={{
                textShadow: '0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,215,0,0.6), 0 0 120px rgba(255,165,0,0.4)',
                animation: 'zoomIn 0.5s ease-out, pulse 1s ease-in-out infinite 0.5s',
              }}
            >
              {result}
            </div>

            {/* メッセージ */}
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white px-12 py-6 rounded-2xl shadow-2xl border-4 border-yellow-400">
              <p className="text-4xl font-bold">
                🎯 {result}マス進む！
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* 通常の結果表示（ズーム後） */}
      {result !== null && !isSpinning && !showZoom && (
        <div className="animate-fade-in">
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white px-8 py-4 rounded-xl shadow-xl border-4 border-yellow-400">
            <p className="text-2xl font-bold">
              🎯 {result}マス進む！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
