'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AudioInitializerProps {
  onInitialized: () => void;
}

export default function AudioInitializer({ onInitialized }: AudioInitializerProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // ページ読み込み後、少し待ってから表示
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleInitialize = () => {
    // ダミーの音声を再生してブラウザのオーディオコンテキストを有効化
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // 短いサイレント音を再生
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);

    setShowPrompt(false);
    onInitialized();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md shadow-xl">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔊</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            BGMと効果音を有効にしますか？
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ゲームをより楽しむために、BGMと効果音を再生します。
            後から音量調整やミュートも可能です。
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleInitialize}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
              size="lg"
            >
              🎵 音声を有効にする
            </Button>
            <Button
              onClick={() => {
                setShowPrompt(false);
                onInitialized();
              }}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              🔇 ミュートで開始
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
