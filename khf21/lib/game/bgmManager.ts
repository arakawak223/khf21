/**
 * BGM管理システム
 * MP3ファイルを優先的に使用し、利用できない場合はToneGeneratorにフォールバック
 */

import { ToneGenerator, DiceSoundGenerator } from './toneGenerator';

export type BGMScene =
  | 'title'           // タイトル/マップ画面
  | 'roulette'        // 目的地ルーレット
  | 'dice_wait'       // サイコロ待機
  | 'flying'          // 飛行中
  | 'attraction'      // 名所/星マス（明るく軽快）
  | 'calm'            // アート/グルメ/人マス（癒し）
  | 'trouble'         // トラブルマス（暗く重い）
  | 'arrival'         // 目的地到着
  | 'ending';         // ゲーム終了/結果発表

export interface BGMTrack {
  scene: BGMScene;
  name: string;
  description: string;
  src: string;
  volume: number;
  loop: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

// BGMトラック定義
const BGM_TRACKS: Record<BGMScene, BGMTrack> = {
  title: {
    scene: 'title',
    name: 'タイトル',
    description: '明るく軽快なメロディ',
    src: '/audio/bgm/title.mp3',
    volume: 0.6,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  roulette: {
    scene: 'roulette',
    name: 'ルーレット',
    description: 'ワクワク感のあるメロディ',
    src: '/audio/bgm/roulette.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,
  },
  dice_wait: {
    scene: 'dice_wait',
    name: 'サイコロ待機',
    description: '期待感のあるメロディ',
    src: '/audio/bgm/dice_wait.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,
  },
  flying: {
    scene: 'flying',
    name: '飛行中',
    description: 'リアルなジェットエンジン音',
    src: '/audio/bgm/flying.mp3',
    volume: 0.4,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 2000,
  },
  attraction: {
    scene: 'attraction',
    name: '名所マス',
    description: '明るく軽快なピアノ',
    src: '/audio/bgm/attraction.mp3',
    volume: 0.6,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  calm: {
    scene: 'calm',
    name: 'アート/グルメマス',
    description: '癒される優しいピアノ',
    src: '/audio/bgm/calm.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  trouble: {
    scene: 'trouble',
    name: 'トラブルマス',
    description: '重低音で暗く物悲しいピアノ',
    src: '/audio/bgm/trouble.mp3',
    volume: 0.6,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 1000,
  },
  arrival: {
    scene: 'arrival',
    name: '到着',
    description: '達成感のあるメロディ',
    src: '/audio/bgm/arrival.mp3',
    volume: 0.7,
    loop: false,
    fadeInDuration: 500,
    fadeOutDuration: 1000,
  },
  ending: {
    scene: 'ending',
    name: 'エンディング',
    description: '華やかなエンディング',
    src: '/audio/bgm/ending.mp3',
    volume: 0.7,
    loop: false,
    fadeInDuration: 1000,
    fadeOutDuration: 2000,
  },
};

class BGMManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentScene: BGMScene | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private toneGenerator: ToneGenerator;
  private diceSoundGenerator: DiceSoundGenerator;
  private useToneGenerator: boolean = false;

  constructor() {
    this.toneGenerator = new ToneGenerator();
    this.diceSoundGenerator = new DiceSoundGenerator();
    this.loadSettings();
  }

  /**
   * LocalStorageから設定を読み込み
   */
  private loadSettings(): void {
    try {
      const savedVolume = localStorage.getItem('bgm_volume');
      const savedMuted = localStorage.getItem('bgm_muted');

      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e);
    }
  }

  /**
   * LocalStorageに設定を保存
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('bgm_volume', this.volume.toString());
      localStorage.setItem('bgm_muted', this.isMuted.toString());
    } catch (e) {
      console.warn('Failed to save audio settings:', e);
    }
  }

  /**
   * BGMを再生
   */
  public async play(scene: BGMScene): Promise<void> {
    // 同じシーンが既に再生中の場合はスキップ
    if (this.currentScene === scene) {
      return;
    }

    // 飛行中シーンの特別処理（エンジン音を維持）
    if (this.currentScene === 'flying' && scene === 'flying') {
      return;
    }

    // 現在のBGMを停止
    await this.stop();

    this.currentScene = scene;
    const track = BGM_TRACKS[scene];

    // 飛行中はエンジン音を生成
    if (scene === 'flying') {
      this.useToneGenerator = true;
      this.toneGenerator.startEngineSound();
      this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
      return;
    }

    // MP3ファイルの読み込みを試行
    try {
      this.useToneGenerator = false;
      const audio = new Audio(track.src);
      audio.loop = track.loop;
      audio.volume = 0;

      // エラーハンドリング
      audio.onerror = () => {
        console.warn(`Failed to load ${track.name}, using tone generator`);
        this.useToneGenerator = true;
        this.toneGenerator.playMelody(scene, track.loop);
        this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
      };

      // 再生開始
      await audio.play();
      this.currentAudio = audio;

      // フェードイン
      if (track.fadeInDuration) {
        await this.fadeIn(track.fadeInDuration, track.volume);
      } else {
        audio.volume = this.isMuted ? 0 : this.volume * track.volume;
      }
    } catch (error) {
      console.warn(`Failed to play ${track.name}, using tone generator:`, error);
      this.useToneGenerator = true;
      this.toneGenerator.playMelody(scene, track.loop);
      this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
    }
  }

  /**
   * BGMを停止
   */
  public async stop(): Promise<void> {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.useToneGenerator) {
      this.toneGenerator.stop();
      this.toneGenerator.stopEngineSound();
      this.useToneGenerator = false;
    }

    if (this.currentAudio) {
      const track = this.currentScene ? BGM_TRACKS[this.currentScene] : null;
      if (track?.fadeOutDuration) {
        await this.fadeOut(track.fadeOutDuration);
      }

      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    this.currentScene = null;
  }

  /**
   * フェードイン
   */
  private fadeIn(duration: number, targetVolume: number): Promise<void> {
    return new Promise(resolve => {
      if (!this.currentAudio) {
        resolve();
        return;
      }

      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = (targetVolume * this.volume) / steps;
      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        if (!this.currentAudio || currentStep >= steps) {
          if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
          resolve();
          return;
        }

        currentStep++;
        const newVolume = this.isMuted ? 0 : volumeStep * currentStep;
        this.currentAudio.volume = Math.min(newVolume, targetVolume * this.volume);
      }, stepDuration);
    });
  }

  /**
   * フェードアウト
   */
  private fadeOut(duration: number): Promise<void> {
    return new Promise(resolve => {
      if (!this.currentAudio) {
        resolve();
        return;
      }

      const steps = 20;
      const stepDuration = duration / steps;
      const startVolume = this.currentAudio.volume;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        if (!this.currentAudio || currentStep >= steps) {
          if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
          resolve();
          return;
        }

        currentStep++;
        this.currentAudio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
      }, stepDuration);
    });
  }

  /**
   * 音量設定
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();

    if (this.useToneGenerator) {
      this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
    } else if (this.currentAudio && this.currentScene) {
      const track = BGM_TRACKS[this.currentScene];
      this.currentAudio.volume = this.isMuted ? 0 : this.volume * track.volume;
    }
  }

  /**
   * ミュート切り替え
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();

    if (this.useToneGenerator) {
      this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
    } else if (this.currentAudio && this.currentScene) {
      const track = BGM_TRACKS[this.currentScene];
      this.currentAudio.volume = this.isMuted ? 0 : this.volume * track.volume;
    }

    return this.isMuted;
  }

  /**
   * 現在の設定を取得
   */
  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentScene(): BGMScene | null {
    return this.currentScene;
  }

  /**
   * サイコロ移動音を再生
   */
  public async playDiceSteps(count: number): Promise<void> {
    await this.diceSoundGenerator.playDiceSteps(count);
  }
}

// シングルトンインスタンス
let bgmManagerInstance: BGMManager | null = null;

export function getBGMManager(): BGMManager {
  if (!bgmManagerInstance) {
    bgmManagerInstance = new BGMManager();
  }
  return bgmManagerInstance;
}

/**
 * イベントタイプからBGMシーンへのマッピング
 */
export const EVENT_BGM_MAP: Record<string, BGMScene> = {
  attraction: 'attraction',  // 名所マス - 明るく軽快
  star: 'attraction',        // 星マス - 明るく軽快
  art: 'calm',              // アートマス - 癒し
  gourmet: 'calm',          // グルメマス - 癒し
  giver: 'calm',            // 人マス - 癒し
  trouble: 'trouble',       // トラブルマス - 暗く重い
  encouragement_gratitude: 'calm', // 元気づけ/感謝マス - 癒し
};

/**
 * 画面状態からBGMシーンへのマッピング
 */
export const SCREEN_BGM_MAP: Record<string, BGMScene | 'none'> = {
  map: 'title',                    // マップ画面
  destination_roulette: 'roulette', // 目的地ルーレット
  movement_roulette: 'dice_wait',   // 移動ルーレット（サイコロ）
  movement: 'flying',               // 移動中（飛行中）
  arrival_selection: 'arrival',     // 目的地到着
  events: 'none',                   // イベント画面（EVENT_BGM_MAPで処理）
  completed: 'ending',              // ゲーム終了
};

export default BGMManager;
