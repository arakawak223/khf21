'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// BGMファイルのリスト
const bgmList = [
  { id: 'title', name: 'タイトル画面BGM', path: '/audio/bgm/title.mp3', description: 'ゲーム開始時に流れる華やかな音楽' },
  { id: 'map', name: 'マップ画面BGM', path: '/audio/bgm/map.mp3', description: '目的地選択時の落ち着いた音楽' },
  { id: 'roulette', name: 'ルーレットBGM', path: '/audio/bgm/roulette.mp3', description: 'ルーレット回転時の緊張感ある音楽' },
  { id: 'dice_wait', name: 'サイコロ待機BGM', path: '/audio/bgm/dice_wait.mp3', description: 'ルーレット待機時の音楽' },
  { id: 'event', name: 'イベントBGM', path: '/audio/bgm/event.mp3', description: '一般的なイベント発生時の音楽' },
  { id: 'cheerful', name: '明るいイベントBGM', path: '/audio/bgm/cheerful.mp3', description: '名所・グルメ・アートなどのポジティブなイベント' },
  { id: 'calm', name: '穏やかなBGM', path: '/audio/bgm/calm.mp3', description: '感動的・感謝のイベント時の音楽' },
  { id: 'trouble', name: 'トラブルBGM', path: '/audio/bgm/trouble.mp3', description: 'トラブルイベント発生時の緊迫した音楽' },
  { id: 'giver', name: '喜び提供BGM', path: '/audio/bgm/giver.mp3', description: '誰かに喜びを提供するイベントの音楽' },
  { id: 'encouragement', name: '元気づけBGM', path: '/audio/bgm/encouragement.mp3', description: '元気づけ・感謝イベントの温かい音楽' },
];

export default function BgmTestPage() {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playBGM = (bgm: typeof bgmList[0]) => {
    // 現在再生中の音楽を停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 新しい音楽を再生
    const audio = new Audio(bgm.path);
    audio.volume = volume;
    audio.loop = true;

    audio.onerror = () => {
      setError(`エラー: ${bgm.name} が見つかりません (${bgm.path})`);
      setCurrentPlaying(null);
    };

    audio.oncanplay = () => {
      setError(null);
    };

    audio.play().catch((err) => {
      console.error('再生エラー:', err);
      setError(`再生エラー: ${err.message}`);
      setCurrentPlaying(null);
    });

    audioRef.current = audio;
    setCurrentPlaying(bgm.id);
  };

  const stopBGM = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentPlaying(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            🎵 BGM管理・テストページ
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300">
            各BGMの再生テストができます
          </p>
        </div>

        {/* コントロールパネル */}
        <Card className="p-6 mb-6 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔊 音量: {Math.round(volume * 100)}%
                </label>
                <Button onClick={stopBGM} variant="outline" size="sm" disabled={!currentPlaying}>
                  ⏹️ 停止
                </Button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {currentPlaying && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ▶️ 再生中: {bgmList.find(b => b.id === currentPlaying)?.name}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* BGMリスト */}
        <div className="grid gap-4">
          {bgmList.map((bgm) => (
            <Card
              key={bgm.id}
              className={`p-5 transition-all duration-200 ${
                currentPlaying === bgm.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600 shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {currentPlaying === bgm.id && '▶️ '}
                    {bgm.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {bgm.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    📁 {bgm.path}
                  </p>
                </div>
                <Button
                  onClick={() => playBGM(bgm)}
                  disabled={currentPlaying === bgm.id}
                  size="lg"
                  className="min-w-[100px]"
                >
                  {currentPlaying === bgm.id ? '再生中' : '▶️ 再生'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 使用方法 */}
        <Card className="mt-8 p-6 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            💡 BGMファイルの配置方法
          </h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>1. <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">public/audio/bgm/</code> ディレクトリを作成</p>
            <p>2. 各BGMファイル（MP3形式）を配置</p>
            <p>3. ファイル名は上記のパスと一致させる（例: title.mp3）</p>
            <p className="pt-3 border-t border-gray-300 dark:border-gray-600">
              <strong>推奨仕様:</strong> MP3形式、128-192kbps、ステレオ、ループ対応
            </p>
          </div>
        </Card>

        {/* 戻るボタン */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            size="lg"
          >
            ← ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
