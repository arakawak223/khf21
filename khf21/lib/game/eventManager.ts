// イベント発生管理

import { shouldEventOccur, getRandomElement } from './utils';
import { EVENT_PROBABILITY } from './constants';
import {
  getRandomStar,
  getRandomTrouble,
  getTroubleResolution,
  getRandomEncouragementGratitudeScenario,
} from './api';
import type {
  Attraction,
  Star,
  Art,
  Gourmet,
  Trouble,
  TroubleResolution,
  GiverScenario,
  EncouragementGratitudeScenario,
} from '@/types/database.types';

export type EventType = 'attraction' | 'star' | 'art' | 'gourmet' | 'trouble' | 'giver' | 'encouragement_gratitude';

export interface GameEvent {
  type: EventType;
  data: Attraction | Star | Art | Gourmet | Trouble | GiverScenario | EncouragementGratitudeScenario;
  troubleResolution?: TroubleResolution;
}

/**
 * 目的地到着時にイベントを生成
 * 注：名所・アート・グルメは到着選択画面で選択するため、ここでは生成しない
 */
export async function generateArrivalEvents(): Promise<GameEvent[]> {
  const events: GameEvent[] = [];

  // スター遭遇イベント（30%の確率）
  if (shouldEventOccur(EVENT_PROBABILITY.STAR)) {
    const star = await getRandomStar();
    if (star) {
      events.push({ type: 'star', data: star });
    }
  }

  return events;
}

/**
 * 移動中にイベントを生成
 */
export async function generateTravelEvents(): Promise<GameEvent[]> {
  const events: GameEvent[] = [];

  // 【一時的に無効化】基本機能のテスト中のため、イベントを発生させない
  // TODO: 基本機能が安定したら再度有効化する

  /*
  const eventRoll = Math.random();

  if (eventRoll < 0.15) {
    // 15%: トラブルイベント
    const trouble = await getRandomTrouble();
    if (trouble) {
      const resolution = await getTroubleResolution(trouble.id);
      events.push({
        type: 'trouble',
        data: trouble,
        troubleResolution: resolution || undefined,
      });
    }
  } else if (eventRoll < 0.40) {
    // 25%: 喜び提供イベント
    const giverScenario = generateGiverScenario();
    events.push({ type: 'giver', data: giverScenario });
  } else if (eventRoll < 0.60) {
    // 20%: 元気づけ/感謝イベント
    const scenario = await getRandomEncouragementGratitudeScenario();
    if (scenario) {
      events.push({ type: 'encouragement_gratitude', data: scenario });
    }
  }
  */

  return events;
}

/**
 * 喜び提供シナリオを生成（一時的なモックデータ）
 */
function generateGiverScenario(): GiverScenario {
  const scenarios = [
    {
      id: 'temp-1',
      title: '困っている旅行者',
      location_type: 'airport' as const,
      situation_text:
        '空港で、地図を見ながら困っている外国人旅行者がいます。道に迷っているようです。',
      action_options: [
        { text: '道案内をしてあげる', points: 30 },
        { text: '地図アプリで場所を調べてあげる', points: 20 },
        { text: '声をかけて励ます', points: 10 },
      ],
      giver_points: 30,
      feedback_text:
        '「ありがとうございます！あなたのおかげで無事に目的地に着けそうです。」旅行者は笑顔で感謝してくれました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-2',
      title: '重い荷物を持つ高齢者',
      location_type: 'flight' as const,
      situation_text:
        '機内で、座席上の荷物棚に重いスーツケースを入れようとしている高齢者がいます。',
      action_options: [
        { text: '荷物を持ち上げて棚に入れてあげる', points: 25 },
        { text: '客室乗務員を呼んであげる', points: 15 },
        { text: '励ましの声をかける', points: 8 },
      ],
      giver_points: 25,
      feedback_text:
        '「本当に助かりました。ありがとう。」高齢者は安心した様子で席に座りました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-3',
      title: '落ち込んでいる人',
      location_type: 'restaurant' as const,
      situation_text:
        'レストランで、一人で食事をしながら悲しそうな表情をしている人がいます。',
      action_options: [
        { text: '優しく声をかけて話を聞いてあげる', points: 35 },
        { text: '笑顔で挨拶をする', points: 15 },
        { text: '温かい飲み物を差し入れる', points: 20 },
      ],
      giver_points: 35,
      feedback_text:
        '「話を聞いてくれてありがとう。少し気持ちが楽になりました。」その人は笑顔を取り戻しました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-4',
      title: '言葉の壁に困る店員',
      location_type: 'restaurant' as const,
      situation_text:
        'レストランで、外国人客と店員が言葉が通じずに困っています。',
      action_options: [
        { text: '通訳を手伝ってあげる', points: 40 },
        { text: '翻訳アプリを使って助ける', points: 25 },
        { text: '笑顔でジェスチャーを教える', points: 15 },
      ],
      giver_points: 40,
      feedback_text:
        '店員とお客さん両方から感謝されました。「あなたのおかげで注文できました！」',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return getRandomElement(scenarios) || scenarios[0];
}

/**
 * イベントから獲得ポイントを計算
 */
export function calculateEventPoints(event: GameEvent, giverPoints?: number): {
  impressed: number;
  giver: number;
} {
  let impressed = 0;
  let giver = 0;

  switch (event.type) {
    case 'attraction':
      impressed = (event.data as Attraction).impressed_points;
      break;
    case 'star':
      impressed = (event.data as Star).impressed_points;
      break;
    case 'art':
      impressed = (event.data as Art).impressed_points;
      break;
    case 'gourmet':
      impressed = (event.data as Gourmet).impressed_points;
      break;
    case 'trouble':
      const trouble = event.data as Trouble;
      // トラブル発生時はマイナスポイント
      impressed = trouble.impressed_points_loss;
      // トラブル解消時はプラスポイント
      if (event.troubleResolution) {
        impressed += event.troubleResolution.impressed_points;
      }
      break;
    case 'giver':
      giver = giverPoints || 0;
      break;
    case 'encouragement_gratitude':
      const scenario = event.data as EncouragementGratitudeScenario;
      impressed = scenario.impressed_points || 0;
      giver = scenario.giver_points || 0;
      break;
  }

  return { impressed, giver };
}
