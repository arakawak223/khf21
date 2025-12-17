/**
 * Web Audio API ベースの音声生成システム
 * MP3ファイルが利用できない場合のフォールバック
 */

type NoteFrequency = number;

// 音階周波数マップ (C2 ~ G5) ※フラット含む
const NOTES: Record<string, NoteFrequency> = {
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.0, Ab2: 103.83, A2: 110.0, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.0, Ab3: 207.65, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.0, Ab4: 415.30, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99,
};

interface MelodyPattern {
  notes: string[];
  durations: number[];
  tempo: number;
  waveType?: OscillatorType;
  hasRhythm?: boolean;
}

// ゲームシーン別のメロディパターン
const MELODIES: Record<string, MelodyPattern> = {
  // タイトル/マップ画面 - 明るく軽快
  title: {
    notes: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'G3'],
    durations: [0.4, 0.2, 0.2, 0.4, 0.2, 0.2, 0.4, 0.4],
    tempo: 80,
    waveType: 'triangle',
    hasRhythm: true,
  },

  // 目的地ルーレット - ワクワク感
  roulette: {
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4'],
    durations: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5],
    tempo: 100,
    waveType: 'sine',
    hasRhythm: true,
  },

  // サイコロ待機 - 期待感
  dice_wait: {
    notes: ['G3', 'B3', 'D4', 'G4', 'D4', 'B3'],
    durations: [0.3, 0.3, 0.3, 0.6, 0.3, 0.6],
    tempo: 90,
    waveType: 'sine',
  },

  // 飛行中 - エンジン音（startEngineSoundで処理）
  flying: {
    notes: ['C3', 'G3', 'C3', 'G3'],
    durations: [1.0, 1.0, 1.0, 1.0],
    tempo: 60,
    waveType: 'sine',
  },

  // 名所/星マス - 明るく軽快なピアノ
  attraction: {
    notes: ['C4', 'E4', 'G4', 'C5', 'E5', 'C5', 'G4', 'E4', 'C4', 'G3', 'C4', 'E4'],
    durations: [0.3, 0.3, 0.3, 0.6, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.6, 0.6],
    tempo: 100,
    waveType: 'sine',
    hasRhythm: true,
  },

  // アート/グルメ/人マス - 癒される優しいピアノ
  calm: {
    notes: ['C4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    durations: [0.5, 0.5, 0.5, 0.5, 0.8, 0.5, 0.5, 0.5, 0.5, 1.0],
    tempo: 70,
    waveType: 'sine',
  },

  // トラブルマス - 重低音で暗く物悲しい
  trouble: {
    notes: ['C3', 'Eb3', 'F3', 'G3', 'Ab3', 'G3', 'F3', 'Eb3'],
    durations: [0.6, 0.6, 0.6, 0.6, 0.8, 0.6, 0.6, 0.8],
    tempo: 60,
    waveType: 'sawtooth',
    hasRhythm: true,
  },

  // 目的地到着 - 華やかで元気なファンファーレ
  arrival: {
    notes: ['C5', 'C5', 'G4', 'G4', 'C5', 'E5', 'G5', 'C5', 'E5', 'G5', 'E5', 'C5', 'G5', 'C5', 'C5', 'C5'],
    durations: [0.15, 0.15, 0.15, 0.15, 0.3, 0.3, 0.6, 0.15, 0.15, 0.3, 0.15, 0.15, 0.6, 0.2, 0.2, 0.8],
    tempo: 140,
    waveType: 'sine',
    hasRhythm: true,
  },

  // ゲーム終了 - 華やかなエンディング
  ending: {
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'],
    durations: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.5, 1.0],
    tempo: 110,
    waveType: 'sine',
    hasRhythm: true,
  },
};

export class ToneGenerator {
  private ctx: AudioContext;
  private currentGain: GainNode | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;
  private loopTimeout: NodeJS.Timeout | null = null;
  private engineNodes: {
    noise: AudioBufferSourceNode;
    filter: BiquadFilterNode;
    gain: GainNode;
    oscillator: OscillatorNode;
  } | null = null;
  private engineInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  /**
   * リアルな飛行機エンジン通過音を生成
   * ブラウンノイズ + 低周波オシレーター + ドップラー効果
   */
  public startEngineSound(): void {
    if (this.engineNodes) {
      this.stopEngineSound();
    }

    // ブラウンノイズの生成
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      output[i] = lastOut * 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // ローパスフィルター（800Hz以下を通す）
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.0;

    // ゲインノード
    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;

    // 低周波オシレーター（エンジンの基本音）
    const oscillator = this.ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 80;

    const oscGain = this.ctx.createGain();
    oscGain.gain.value = 0.1;

    // 接続
    noise.connect(filter);
    filter.connect(gain);
    oscillator.connect(oscGain);
    oscGain.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    oscillator.start();

    this.engineNodes = { noise, filter, gain, oscillator };

    // 8秒周期で通過音を表現（ドップラー効果）
    let phase = 0;
    this.engineInterval = setInterval(() => {
      if (!this.engineNodes) return;

      phase = (phase + 0.1) % 8.0;

      // 0-3秒: 接近（音量↑、周波数↑）
      // 3-5秒: ピーク（最大音量）
      // 5-8秒: 遠ざかる（音量↓、周波数↓）
      let volume: number;
      let frequency: number;

      if (phase < 3) {
        // 接近
        volume = 0.05 + (phase / 3) * 0.15;
        frequency = 60 + (phase / 3) * 20;
      } else if (phase < 5) {
        // ピーク
        volume = 0.2;
        frequency = 80;
      } else {
        // 遠ざかる
        const t = (phase - 5) / 3;
        volume = 0.2 - t * 0.18;
        frequency = 80 - t * 35;
      }

      this.engineNodes.gain.gain.linearRampToValueAtTime(
        volume,
        this.ctx.currentTime + 0.1
      );
      this.engineNodes.oscillator.frequency.linearRampToValueAtTime(
        frequency,
        this.ctx.currentTime + 0.1
      );
    }, 100);
  }

  public stopEngineSound(): void {
    if (this.engineInterval) {
      clearInterval(this.engineInterval);
      this.engineInterval = null;
    }

    if (this.engineNodes) {
      try {
        this.engineNodes.noise.stop();
        this.engineNodes.oscillator.stop();
        this.engineNodes.gain.disconnect();
      } catch (e) {
        // Already stopped
      }
      this.engineNodes = null;
    }
  }

  /**
   * メロディを再生
   */
  public playMelody(scene: string, loop: boolean = true): void {
    this.stop();

    const melody = MELODIES[scene];
    if (!melody) {
      console.warn(`Melody not found for scene: ${scene}`);
      return;
    }

    this.isPlaying = true;

    const playSequence = () => {
      if (!this.isPlaying) return;

      this.currentOscillators = [];
      const masterGain = this.ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(this.ctx.destination);
      this.currentGain = masterGain;

      const beatDuration = 60 / melody.tempo;
      let currentTime = this.ctx.currentTime;

      melody.notes.forEach((note, i) => {
        const frequency = NOTES[note];
        if (!frequency) return;

        const duration = melody.durations[i] * beatDuration;

        // メインオシレーター
        const osc = this.ctx.createOscillator();
        osc.type = melody.waveType || 'sine';
        osc.frequency.value = frequency;

        const noteGain = this.ctx.createGain();

        // ADSRエンベロープ
        const attack = 0.02;
        const decay = 0.1;
        const sustain = 0.6;
        const release = 0.1;

        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(0.8, currentTime + attack);
        noteGain.gain.linearRampToValueAtTime(sustain, currentTime + attack + decay);
        noteGain.gain.setValueAtTime(sustain, currentTime + duration - release);
        noteGain.gain.linearRampToValueAtTime(0, currentTime + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(currentTime);
        osc.stop(currentTime + duration);
        this.currentOscillators.push(osc);

        // リズムセクション（ベース音）
        if (melody.hasRhythm && i % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          bassOsc.type = 'triangle';
          bassOsc.frequency.value = frequency / 4;

          const bassGain = this.ctx.createGain();
          bassGain.gain.setValueAtTime(0, currentTime);
          bassGain.gain.linearRampToValueAtTime(0.2, currentTime + 0.01);
          bassGain.gain.linearRampToValueAtTime(0, currentTime + 0.1);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);

          bassOsc.start(currentTime);
          bassOsc.stop(currentTime + 0.1);
          this.currentOscillators.push(bassOsc);
        }

        currentTime += duration;
      });

      // ループ処理
      if (loop) {
        const totalDuration = melody.notes.reduce(
          (sum, _, i) => sum + melody.durations[i] * beatDuration,
          0
        );
        this.loopTimeout = setTimeout(playSequence, totalDuration * 1000);
      }
    };

    playSequence();
  }

  /**
   * 再生停止
   */
  public stop(): void {
    this.isPlaying = false;

    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }

    this.currentOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.currentOscillators = [];

    if (this.currentGain) {
      this.currentGain.disconnect();
      this.currentGain = null;
    }
  }

  /**
   * 音量設定
   */
  public setVolume(volume: number): void {
    if (this.currentGain) {
      this.currentGain.gain.value = volume * 0.3;
    }
    if (this.engineNodes) {
      this.engineNodes.gain.gain.value = volume * 0.15;
    }
  }
}

/**
 * サイコロ移動時のステップ音生成
 */
export class DiceSoundGenerator {
  private ctx: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private isLoading: boolean = false;
  private useFallback: boolean = false;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.loadAudioFile();
  }

  /**
   * 音声ファイルを読み込み
   */
  private async loadAudioFile(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const response = await fetch('/audio/bgm/passenger-plane-passing-close-by-2.mp3');
      if (!response.ok) {
        throw new Error('Failed to load audio file');
      }
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      console.log('Airplane sound effect loaded successfully');
    } catch (error) {
      console.warn('Failed to load airplane sound, using fallback:', error);
      this.useFallback = true;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 1マス移動ごとの音を再生（飛行機の通過音）
   */
  public async playDiceSteps(count: number): Promise<void> {
    console.log('[DiceSteps] Called with count:', count);
    console.log('[DiceSteps] isLoading:', this.isLoading);
    console.log('[DiceSteps] audioBuffer:', this.audioBuffer ? 'loaded' : 'not loaded');
    console.log('[DiceSteps] useFallback:', this.useFallback);

    // 音声ファイルの読み込みを待つ
    while (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 音声ファイルが利用できる場合は、それを使用
    if (this.audioBuffer && !this.useFallback) {
      console.log('[DiceSteps] Playing audio file');
      await this.playAudioFileSteps(count);
    } else {
      console.log('[DiceSteps] Playing fallback tone');
      // フォールバック: 既存の音階を使用
      await this.playToneSteps(count);
    }
  }

  /**
   * 音声ファイルを使用してステップ音を再生
   */
  private async playAudioFileSteps(count: number): Promise<void> {
    if (!this.audioBuffer) return;

    for (let i = 0; i < count; i++) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.audioBuffer;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.3; // 音量調整

      source.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      // 短く再生（0.3秒）
      source.stop(this.ctx.currentTime + 0.3);

      // 次のステップまで待機（400ms）
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }

  /**
   * フォールバック: 音階を使用してステップ音を再生
   */
  private async playToneSteps(count: number): Promise<void> {
    const notes = [
      NOTES.C5, NOTES.D5, NOTES.E5, NOTES.F5,
      NOTES.G5, NOTES.A5, NOTES.B5, NOTES.C5,
    ];

    for (let i = 0; i < count; i++) {
      const frequency = notes[i % notes.length];

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);

      await new Promise(resolve => setTimeout(resolve, 180));
    }
  }
}
