'use client';

import { useEffect, useState, useCallback } from 'react';
import { getBGMManager, BGMScene } from './bgmManager';

export function useAudio() {
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMutedState] = useState(false);
  const [currentScene, setCurrentScene] = useState<BGMScene | null>(null);

  useEffect(() => {
    const manager = getBGMManager();
    setVolumeState(manager.getVolume());
    setIsMutedState(manager.getIsMuted());
    setCurrentScene(manager.getCurrentScene());
  }, []);

  const playBGM = useCallback(async (scene: BGMScene) => {
    const manager = getBGMManager();
    await manager.play(scene);
    setCurrentScene(scene);
  }, []);

  const stopBGM = useCallback(async () => {
    const manager = getBGMManager();
    await manager.stop();
    setCurrentScene(null);
  }, []);

  const playDiceSteps = useCallback(async (count: number) => {
    const manager = getBGMManager();
    const isMuted = manager.getIsMuted();
    console.log(`[DiceSteps] Muted: ${isMuted}, Count: ${count}`);
    // ミュート中は再生しない
    if (isMuted) {
      return;
    }
    await manager.playDiceSteps(count);
  }, []);

  const playFanfare = useCallback(async () => {
    const manager = getBGMManager();
    // ミュート中は再生しない - 早期リターン
    if (manager.getIsMuted()) {
      console.log('[Fanfare] Muted - not playing');
      return;
    }

    console.log('[Fanfare] Playing fanfare');

    // ファンファーレ音を再生（Web Audio APIで生成）
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 2; // 2秒

    // ファンファーレのメロディ: C-E-G-C5-E5-G5 (ドミソドミソ)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.3 },     // C5
      { freq: 659.25, time: 0.3, duration: 0.3 },   // E5
      { freq: 783.99, time: 0.6, duration: 0.3 },   // G5
      { freq: 1046.50, time: 0.9, duration: 0.3 },  // C6
      { freq: 1318.51, time: 1.2, duration: 0.3 },  // E6
      { freq: 1567.98, time: 1.5, duration: 0.5 },  // G6 (最後は長め)
    ];

    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle'; // 柔らかい音色

      // エンベロープ（音量変化）
      const now = audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // アタック
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.duration); // ディケイ

      oscillator.start(now);
      oscillator.stop(now + note.duration);
    });

    // 効果音が終わるまで待つ
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const manager = getBGMManager();
    manager.setVolume(vol);
    setVolumeState(vol);
  }, []);

  const toggleMute = useCallback(() => {
    console.log('[ToggleMute] Button clicked');
    const manager = getBGMManager();
    const newMuted = manager.toggleMute();
    console.log(`[ToggleMute] New muted state: ${newMuted}`);
    setIsMutedState(newMuted);
  }, []);

  return {
    playBGM,
    stopBGM,
    playDiceSteps,
    playFanfare,
    setVolume,
    toggleMute,
    volume,
    isMuted,
    currentScene,
  };
}
