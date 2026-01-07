/**
 * BGM管理システム
 * MP3ファイルを優先的に使用し、利用できない場合はToneGeneratorにフォールバック
 */

import { ToneGenerator, DiceSoundGenerator } from './toneGenerator';
import { BGM_URLS } from './constants';

export type BGMScene =
  | 'title'           // タイトル/マップ画面
  | 'roulette'        // 目的地ルーレット
  | 'dice_wait'       // ルーレット待機
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
  src: string | string[] | readonly string[]; // 単一のURLまたは複数のURLから選択
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
    src: BGM_URLS.GAME_START,
    volume: 0.6,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  roulette: {
    scene: 'roulette',
    name: 'ルーレット',
    description: 'ワクワク感のあるメロディ',
    src: BGM_URLS.DESTINATION_ROULETTE,
    volume: 0.5,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,
  },
  dice_wait: {
    scene: 'dice_wait',
    name: 'ルーレット待機',
    description: '期待感のあるメロディ',
    src: BGM_URLS.DICE_ROULETTE,
    volume: 0.5,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,
  },
  flying: {
    scene: 'flying',
    name: '飛行中',
    description: '飛行機のエンジン音',
    src: BGM_URLS.FLYING,
    volume: 0.4,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 2000,
  },
  attraction: {
    scene: 'attraction',
    name: '名所マス',
    description: '明るく軽快なメロディ',
    src: BGM_URLS.BRIGHT,
    volume: 0.6,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  calm: {
    scene: 'calm',
    name: 'アート/グルメマス',
    description: '癒される優しいメロディ',
    src: BGM_URLS.WARM,
    volume: 0.5,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
  },
  trouble: {
    scene: 'trouble',
    name: 'トラブルマス',
    description: '暗く重いメロディ',
    src: BGM_URLS.TROUBLE,
    volume: 0.6,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 1000,
  },
  arrival: {
    scene: 'arrival',
    name: '到着',
    description: '達成感のあるメロディ',
    src: BGM_URLS.BRIGHT,
    volume: 0.7,
    loop: false,
    fadeInDuration: 500,
    fadeOutDuration: 1000,
  },
  ending: {
    scene: 'ending',
    name: 'エンディング',
    description: '華やかなエンディング',
    src: BGM_URLS.BRIGHT,
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
  private selectedStartBGM: string | null = null; // ゲーム開始時に選択されたBGM
  private sfxAudio: HTMLAudioElement | null = null; // 効果音用のAudioオブジェクト

  constructor() {
    this.toneGenerator = new ToneGenerator();
    this.diceSoundGenerator = new DiceSoundGenerator();
    this.loadSettings();
    // 初期化時に移動音の音量とミュート状態を設定
    this.diceSoundGenerator.setVolumeAndMute(this.volume * 0.4, this.isMuted);
  }

  /**
   * ゲーム開始時のBGMを設定
   */
  public setStartBGM(url: string): void {
    this.selectedStartBGM = url;
    try {
      localStorage.setItem('selected_start_bgm', url);
    } catch (e) {
      console.warn('Failed to save start BGM:', e);
    }
  }

  /**
   * ゲーム開始時のBGMを取得
   */
  public getStartBGM(): string | null {
    return this.selectedStartBGM;
  }

  /**
   * LocalStorageから設定を読み込み
   */
  private loadSettings(): void {
    try {
      const savedVolume = localStorage.getItem('bgm_volume');
      const savedMuted = localStorage.getItem('bgm_muted');
      const savedStartBGM = localStorage.getItem('selected_start_bgm');

      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }
      if (savedStartBGM !== null) {
        this.selectedStartBGM = savedStartBGM;
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
   * 配列からランダムにURLを選択
   */
  private selectRandomURL(src: string | string[] | readonly string[], scene: BGMScene): string {
    if (typeof src === 'string') {
      return src;
    }
    // タイトルシーンかつ選択されたBGMがある場合はそれを使用
    if (scene === 'title' && this.selectedStartBGM) {
      return this.selectedStartBGM;
    }
    // ランダムに選択
    return src[Math.floor(Math.random() * src.length)];
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

    // trackが存在しない場合のチェック
    if (!track) {
      console.warn(`No BGM track found for scene: ${scene}`);
      return;
    }

    // MP3ファイルの読み込みを試行
    try {
      this.useToneGenerator = false;
      const selectedURL = this.selectRandomURL(track.src, scene);
      const audio = new Audio(selectedURL);
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

    // 効果音も音量を更新
    if (this.sfxAudio) {
      this.sfxAudio.volume = this.isMuted ? 0 : this.volume * 0.8;
    }

    // 移動音も音量を更新
    this.diceSoundGenerator.setVolumeAndMute(this.volume * 0.4, this.isMuted);
  }

  /**
   * ミュート切り替え
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    console.log(`[BGMManager] toggleMute called - new state: ${this.isMuted}`);

    // フェードインターバルをクリアして即座に音量を適用
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
      console.log(`[BGMManager] Cleared fade interval to apply mute immediately`);
    }

    if (this.useToneGenerator) {
      this.toneGenerator.setVolume(this.isMuted ? 0 : this.volume);
    } else if (this.currentAudio && this.currentScene) {
      const track = BGM_TRACKS[this.currentScene];
      this.currentAudio.volume = this.isMuted ? 0 : this.volume * track.volume;
      console.log(`[BGMManager] Set audio volume to: ${this.currentAudio.volume} (muted: ${this.isMuted})`);
    }

    // 効果音も音量を更新
    if (this.sfxAudio) {
      this.sfxAudio.volume = this.isMuted ? 0 : this.volume * 0.8;
    }

    // 移動音も音量を更新
    this.diceSoundGenerator.setVolumeAndMute(this.volume * 0.4, this.isMuted);
    console.log(`[BGMManager] DiceSoundGenerator updated - volume: ${this.volume * 0.4}, muted: ${this.isMuted}`);

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
   * ルーレット移動音を再生
   */
  public async playDiceSteps(count: number): Promise<void> {
    // ミュート中は再生しない
    if (this.isMuted) {
      return;
    }
    await this.diceSoundGenerator.playDiceSteps(count);
  }

  /**
   * ファンファーレ効果音を再生
   */
  public async playFanfare(): Promise<void> {
    // ミュート中は再生しない
    if (this.isMuted) {
      console.log('[Fanfare] Muted - not playing');
      return;
    }

    console.log('[Fanfare] Playing fanfare from audio file');

    try {
      // 既存の効果音を停止
      if (this.sfxAudio) {
        this.sfxAudio.pause();
        this.sfxAudio.currentTime = 0;
        this.sfxAudio = null;
      }

      // 効果音ファイルを再生
      const fanfareAudio = new Audio('/audio/sfx/fanfare.mp3');
      fanfareAudio.volume = this.isMuted ? 0 : this.volume * 0.8; // 効果音は少し控えめに
      this.sfxAudio = fanfareAudio;

      // エラーハンドリング
      fanfareAudio.onerror = () => {
        console.warn('Failed to load fanfare.mp3, using fallback tone');
        this.sfxAudio = null;
        this.playFanfareFallback();
      };

      await fanfareAudio.play();

      // 効果音が終わるまで待つ（約3秒）
      await new Promise(resolve => {
        fanfareAudio.onended = () => {
          this.sfxAudio = null;
          resolve(undefined);
        };
        // タイムアウトも設定（念のため）
        setTimeout(() => {
          this.sfxAudio = null;
          resolve(undefined);
        }, 5000);
      });
    } catch (error) {
      console.warn('Failed to play fanfare, using fallback:', error);
      this.sfxAudio = null;
      this.playFanfareFallback();
    }
  }

  /**
   * フォールバック用のファンファーレ音（Web Audio API）
   */
  private playFanfareFallback(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // ファンファーレのメロディ: C-E-G-C5-E5-G5
      const notes = [
        { freq: 523.25, time: 0, duration: 0.3 },     // C5
        { freq: 659.25, time: 0.3, duration: 0.3 },   // E5
        { freq: 783.99, time: 0.6, duration: 0.3 },   // G5
        { freq: 1046.50, time: 0.9, duration: 0.3 },  // C6
        { freq: 1318.51, time: 1.2, duration: 0.3 },  // E6
        { freq: 1567.98, time: 1.5, duration: 0.5 },  // G6
      ];

      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'triangle';

        const now = audioContext.currentTime + note.time;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.duration);

        oscillator.start(now);
        oscillator.stop(now + note.duration);
      });
    } catch (error) {
      console.error('Failed to play fallback fanfare:', error);
    }
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
  movement_roulette: 'dice_wait',   // 移動ルーレット
  movement: 'flying',               // 移動中（飛行中）
  arrival_selection: 'arrival',     // 目的地到着
  events: 'none',                   // イベント画面（EVENT_BGM_MAPで処理）
  completed: 'ending',              // ゲーム終了
};

export default BGMManager;
