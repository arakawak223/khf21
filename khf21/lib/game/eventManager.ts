// イベント発生管理

import { shouldEventOccur, getRandomElement } from './utils';
import { EVENT_PROBABILITY } from './constants';
import {
  getRandomStar,
  getRandomTrouble,
  getTroubleResolution,
  getRandomEncouragementGratitudeScenario,
} from './api';
import { getRandomSpecialLifeEvent, type SpecialLifeEvent } from './specialLifeEvents';
import { getArrivalStarEncounter, type EncounterLocation } from './starEncounterScenarios';
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

export type EventType = 'attraction' | 'star' | 'art' | 'gourmet' | 'trouble' | 'giver' | 'encouragement_gratitude' | 'special_life_event';

export interface GameEvent {
  type: EventType;
  data: Attraction | Star | Art | Gourmet | Trouble | GiverScenario | EncouragementGratitudeScenario | SpecialLifeEvent;
  troubleResolution?: TroubleResolution;
  starLocation?: EncounterLocation; // スター遭遇の場所（到着時は多様な場所、移動中は'flight'）
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
      // 到着時は多様な場所でのスター遭遇（空港以外の場所も含む）
      const encounterLocation = determineArrivalEncounterLocation();
      events.push({
        type: 'star',
        data: star,
        starLocation: encounterLocation
      });
    }
  }

  // 特殊ライフイベント（5%の確率）
  // TODO: 表示コンポーネントが実装されるまで一時的に無効化
  // if (Math.random() < 0.05) {
  //   const specialEvent = getRandomSpecialLifeEvent();
  //   events.push({ type: 'special_life_event', data: specialEvent });
  // }

  return events;
}

/**
 * 到着時のスター遭遇場所を決定（starEncounterScenarios.tsのgetArrivalStarEncounterと同じ確率分布）
 */
function determineArrivalEncounterLocation(): EncounterLocation {
  const rand = Math.random();

  if (rand < 0.10) return 'airport_lounge';      // 10%
  else if (rand < 0.15) return 'airport_gate';   // 5%
  else if (rand < 0.28) return 'hotel';          // 13%
  else if (rand < 0.40) return 'restaurant';     // 12%
  else if (rand < 0.55) return 'tourist_attraction'; // 15%
  else if (rand < 0.68) return 'bar';            // 13%
  else if (rand < 0.78) return 'street';         // 10%
  else if (rand < 0.87) return 'museum';         // 9%
  else if (rand < 0.94) return 'cafe';           // 7%
  else return 'theater';                          // 6%
}

/**
 * 移動中にイベントを生成（機内イベント）
 */
export async function generateTravelEvents(): Promise<GameEvent[]> {
  const events: GameEvent[] = [];

  const eventRoll = Math.random();

  // 機内で著名人との出会い（25%の確率）
  if (eventRoll < 0.25) {
    const star = await getRandomStar();
    if (star) {
      events.push({
        type: 'star',
        data: star,
        starLocation: 'flight' // 移動中は必ず機内
      });
    }
  } else if (eventRoll < 0.35) {
    // 10%: トラブルイベント
    const trouble = await getRandomTrouble();
    if (trouble) {
      const resolution = await getTroubleResolution(trouble.id);
      events.push({
        type: 'trouble',
        data: trouble,
        troubleResolution: resolution || undefined,
      });
    }
  } else if (eventRoll < 0.55) {
    // 20%: 喜び提供イベント
    const giverScenario = generateGiverScenario();
    events.push({ type: 'giver', data: giverScenario });
  } else if (eventRoll < 0.70) {
    // 15%: 元気づけ/感謝イベント
    const scenario = await getRandomEncouragementGratitudeScenario();
    if (scenario) {
      events.push({ type: 'encouragement_gratitude', data: scenario });
    }
  } // TODO: 表示コンポーネントが実装されるまで一時的に無効化
  // else if (eventRoll < 0.78) {
  //   // 8%: 特殊ライフイベント
  //   const specialEvent = getRandomSpecialLifeEvent();
  //   events.push({ type: 'special_life_event', data: specialEvent });
  // }

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
        { text: '道案内をしてあげる', points: 25 },
        { text: '地図アプリで場所を調べてあげる', points: 25 },
        { text: '声をかけて励ます', points: 25 },
      ],
      giver_points: 25,
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
        { text: '客室乗務員を呼んであげる', points: 25 },
        { text: '励ましの声をかける', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '「本当に助かりました。ありがとう。」高齢者は安心した様子で席に座りました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-3',
      title: '機内で落ち込んでいる乗客',
      location_type: 'flight' as const,
      situation_text:
        '機内で、窓際の席に座りながら悲しそうな表情でずっと外を見つめている人がいます。',
      action_options: [
        { text: '優しく声をかけて話を聞いてあげる', points: 25 },
        { text: '笑顔で挨拶をして励ます', points: 25 },
        { text: '客室乗務員に温かい飲み物を頼んであげる', points: 25 },
      ],
      giver_points: 25,
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
        { text: '通訳を手伝ってあげる', points: 25 },
        { text: '翻訳アプリを使って助ける', points: 25 },
        { text: '笑顔でジェスチャーを教える', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '店員とお客さん両方から感謝されました。「あなたのおかげで注文できました！」',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-5',
      title: '迷子の子ども',
      location_type: 'airport' as const,
      situation_text:
        '空港で、泣きながら親を探している小さな子どもがいます。',
      action_options: [
        { text: '優しく声をかけて一緒に親を探す', points: 25 },
        { text: '空港スタッフに連絡する', points: 25 },
        { text: '落ち着かせて待つように励ます', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '無事に親が見つかり、親子で涙を流しながら「本当にありがとうございました！」と感謝されました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-6',
      title: '体調不良の乗客',
      location_type: 'flight' as const,
      situation_text:
        '機内で、隣の席の人が気分が悪そうにしています。顔色が優れません。',
      action_options: [
        { text: 'すぐに客室乗務員を呼ぶ', points: 25 },
        { text: '水を持ってきてあげる', points: 25 },
        { text: '優しく声をかけて様子を聞く', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '乗務員の迅速な対応で無事に回復しました。「あなたのおかげで助かりました」と感謝されました。',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-7',
      title: '落とし物を見つける',
      location_type: 'airport' as const,
      situation_text:
        '空港の待合室で、誰かが大切そうな財布を落としているのを見つけました。',
      action_options: [
        { text: 'すぐに空港の遺失物センターに届ける', points: 25 },
        { text: '周りの人に声をかけて持ち主を探す', points: 25 },
        { text: 'アナウンスを依頼する', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '持ち主が見つかり、大変感謝されました。「正直に届けてくれて本当にありがとう！」',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'temp-8',
      title: '車椅子の方の手助け',
      location_type: 'airport' as const,
      situation_text:
        '空港で、車椅子の方が段差の前で困っています。',
      action_options: [
        { text: '車椅子を押して段差を越える手伝いをする', points: 25 },
        { text: 'スタッフを呼んで専門的な援助を依頼する', points: 25 },
        { text: '声をかけて何か手伝えることがないか聞く', points: 25 },
      ],
      giver_points: 25,
      feedback_text:
        '「優しく声をかけてくれてありがとう。助かりました」と笑顔で感謝されました。',
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
    case 'special_life_event':
      const specialEvent = event.data as SpecialLifeEvent;
      impressed = specialEvent.impressedPoints;
      giver = specialEvent.giverPoints;
      break;
  }

  return { impressed, giver };
}
