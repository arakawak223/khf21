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
    await manager.playDiceSteps(count);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const manager = getBGMManager();
    manager.setVolume(vol);
    setVolumeState(vol);
  }, []);

  const toggleMute = useCallback(() => {
    const manager = getBGMManager();
    const newMuted = manager.toggleMute();
    setIsMutedState(newMuted);
  }, []);

  return {
    playBGM,
    stopBGM,
    playDiceSteps,
    setVolume,
    toggleMute,
    volume,
    isMuted,
    currentScene,
  };
}
