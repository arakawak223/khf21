'use client';

import { useAudio } from '@/lib/game/useAudio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AudioControls() {
  const { volume, isMuted, setVolume, toggleMute } = useAudio();

  return (
    <Card className="p-3 shadow-md">
      <div className="flex items-center gap-3">
        {/* ミュートボタン */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[AudioControls] Mute button clicked');
            toggleMute();
          }}
          variant="outline"
          size="sm"
          className="touch-target relative z-50"
          aria-label={isMuted ? '音声をオンにする' : '音声をミュートする'}
          type="button"
        >
          {isMuted ? '🔇' : '🔊'}
        </Button>

        {/* 音量調整スライダー */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">🔉</span>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={(e) => {
              const newVolume = parseInt(e.target.value) / 100;
              setVolume(newVolume);
              if (isMuted && newVolume > 0) {
                toggleMute();
              }
            }}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={isMuted}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">🔊</span>
        </div>

        {/* 音量パーセント表示 */}
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[3ch]">
          {isMuted ? '0' : Math.round(volume * 100)}%
        </span>
      </div>
    </Card>
  );
}
