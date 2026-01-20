// 戦略的ゲーム要素のマスターデータ

import type { GameCard, Mission } from '@/types/strategy.types';

// ===============================
// カードマスターデータ（10種類）
// ===============================

export const GAME_CARDS: GameCard[] = [
  // 攻撃カード（3種類）
  {
    id: 'card_attack_01',
    name: 'Road Block',
    nameJa: '📉 進路妨害',
    description: '相手プレイヤーを2マス戻す',
    category: 'attack',
    icon: '🚧',
    rarity: 2,
    effect: {
      type: 'move_back',
      value: 2,
      target: 'opponent',
    },
  },
  {
    id: 'card_attack_02',
    name: 'Point Theft',
    nameJa: '💸 ポイント略奪',
    description: '相手のポイントを15%奪う',
    category: 'attack',
    icon: '💰',
    rarity: 3,
    effect: {
      type: 'steal_points',
      value: 15,
      target: 'opponent',
    },
  },
  {
    id: 'card_attack_03',
    name: 'Freeze',
    nameJa: '❄️ 凍結',
    description: '相手を1ターン動けなくする',
    category: 'attack',
    icon: '🧊',
    rarity: 3,
    effect: {
      type: 'freeze',
      duration: 1,
      target: 'opponent',
    },
  },

  // 防御カード（2種類）
  {
    id: 'card_defense_01',
    name: 'Shield',
    nameJa: '🛡️ バリア',
    description: '2ターンの間、攻撃を無効化',
    category: 'defense',
    icon: '🛡️',
    rarity: 2,
    effect: {
      type: 'barrier',
      duration: 2,
      target: 'self',
    },
  },
  {
    id: 'card_defense_02',
    name: 'Counter Attack',
    nameJa: '🔄 カウンター',
    description: '次の攻撃を跳ね返す',
    category: 'defense',
    icon: '↩️',
    rarity: 3,
    effect: {
      type: 'counter',
      duration: 1,
      target: 'self',
    },
  },

  // ブーストカード（5種類）
  {
    id: 'card_boost_01',
    name: 'Turbo Move',
    nameJa: '🚀 倍速移動',
    description: 'サイコロを2回振れる',
    category: 'boost',
    icon: '⚡',
    rarity: 2,
    effect: {
      type: 'double_move',
      value: 2,
      target: 'self',
    },
  },
  {
    id: 'card_boost_02',
    name: 'Lucky Bonus',
    nameJa: '💎 ポイント2倍',
    description: '次の到着で獲得ポイントが2倍',
    category: 'boost',
    icon: '✨',
    rarity: 2,
    effect: {
      type: 'double_points',
      duration: 1,
      target: 'self',
    },
  },
  {
    id: 'card_boost_03',
    name: 'Card Draw',
    nameJa: '🎴 追加カード',
    description: 'カードを追加で2枚引く',
    category: 'boost',
    icon: '🎁',
    rarity: 1,
    effect: {
      type: 'extra_card',
      value: 2,
      target: 'self',
    },
  },
  {
    id: 'card_boost_04',
    name: 'Teleport',
    nameJa: '🌀 テレポート',
    description: '任意の都市に瞬間移動',
    category: 'boost',
    icon: '🔮',
    rarity: 3,
    effect: {
      type: 'teleport',
      target: 'self',
    },
  },
  {
    id: 'card_boost_05',
    name: 'Express Pass',
    nameJa: '🎫 特急券',
    description: '目的地まで一気に進む（距離の50%）',
    category: 'boost',
    icon: '🚄',
    rarity: 2,
    effect: {
      type: 'double_move',
      value: 999, // 特殊処理で距離の50%進む
      target: 'self',
    },
  },
];

// ===============================
// ミッションマスターデータ
// ===============================

export const MISSIONS: Mission[] = [
  // 訪問系ミッション
  {
    id: 'mission_01',
    name: 'World Tour',
    nameJa: '🌍 世界一周',
    description: '5大陸すべてを訪問する',
    type: 'visit_continents',
    icon: '🌎',
    targetValue: 5,
    rewardPoints: 500,
    rewardCards: 2,
    difficulty: 3,
  },
  {
    id: 'mission_02',
    name: 'Frequent Traveler',
    nameJa: '✈️ 旅行マニア',
    description: '10都市を訪問する',
    type: 'visit_count',
    icon: '🗺️',
    targetValue: 10,
    rewardPoints: 300,
    rewardCards: 1,
    difficulty: 2,
  },
  {
    id: 'mission_03',
    name: 'Art Collector',
    nameJa: '🎨 アート収集家',
    description: 'アートを5回選択する',
    type: 'collect_type',
    icon: '🖼️',
    targetValue: 5,
    rewardPoints: 200,
    difficulty: 1,
  },
  {
    id: 'mission_04',
    name: 'Gourmet Hunter',
    nameJa: '🍴 グルメハンター',
    description: 'グルメを5回選択する',
    type: 'collect_type',
    icon: '🍽️',
    targetValue: 5,
    rewardPoints: 200,
    difficulty: 1,
  },
  {
    id: 'mission_05',
    name: 'Speed Star',
    nameJa: '⚡ スピードスター',
    description: '最初の目的地に8ターン以内に到達',
    type: 'speed_challenge',
    icon: '⏱️',
    targetValue: 8,
    rewardPoints: 300,
    rewardCards: 1,
    difficulty: 2,
  },
  {
    id: 'mission_06',
    name: 'Millionaire',
    nameJa: '💰 大富豪',
    description: '1000ポイント達成',
    type: 'point_target',
    icon: '💎',
    targetValue: 1000,
    rewardPoints: 0, // 達成自体が目標
    rewardCards: 3,
    difficulty: 3,
  },
  {
    id: 'mission_07',
    name: 'Long Distance',
    nameJa: '🛫 長距離移動',
    description: '累計20,000km移動する',
    type: 'distance_travel',
    icon: '🌏',
    targetValue: 20000,
    rewardPoints: 400,
    rewardCards: 2,
    difficulty: 3,
  },
  {
    id: 'mission_08',
    name: 'Tourist Attraction Lover',
    nameJa: '🏛️ 名所マニア',
    description: '名所を5回選択する',
    type: 'collect_type',
    icon: '🗿',
    targetValue: 5,
    rewardPoints: 200,
    difficulty: 1,
  },
];

// ===============================
// ヘルパー関数
// ===============================

// ランダムにカードを取得
export function drawRandomCards(count: number, excludeIds: string[] = []): GameCard[] {
  const availableCards = GAME_CARDS.filter(card => !excludeIds.includes(card.id));
  const drawn: GameCard[] = [];

  // レアリティを考慮した抽選
  for (let i = 0; i < count; i++) {
    const roll = Math.random() * 100;
    let targetRarity: 1 | 2 | 3;

    if (roll < 10) {
      targetRarity = 3; // 10% 超レア
    } else if (roll < 40) {
      targetRarity = 2; // 30% レア
    } else {
      targetRarity = 1; // 60% コモン
    }

    const cardsOfRarity = availableCards.filter(c => c.rarity === targetRarity);
    if (cardsOfRarity.length > 0) {
      const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      drawn.push(randomCard);
    } else {
      // 該当レアリティがない場合は適当に選ぶ
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      drawn.push(randomCard);
    }
  }

  return drawn;
}

// ランダムにカードを取得（PlayerCard形式で）
export function drawRandomPlayerCards(count: number, excludeIds: string[] = []): import('@/types/strategy.types').PlayerCard[] {
  const cards = drawRandomCards(count, excludeIds);
  return cards.map(card => ({
    cardId: card.id,
    obtainedAt: new Date().toISOString(),
    used: false,
  }));
}

// プレイヤーにランダムなミッションを割り当て（3つ）
export function assignRandomMissions(count: number = 3): Mission[] {
  // 難易度をバランスよく選ぶ（簡単1、普通1、難しい1）
  const easyMissions = MISSIONS.filter(m => m.difficulty === 1);
  const mediumMissions = MISSIONS.filter(m => m.difficulty === 2);
  const hardMissions = MISSIONS.filter(m => m.difficulty === 3);

  const selected: Mission[] = [];

  if (count >= 1 && easyMissions.length > 0) {
    selected.push(easyMissions[Math.floor(Math.random() * easyMissions.length)]);
  }
  if (count >= 2 && mediumMissions.length > 0) {
    selected.push(mediumMissions[Math.floor(Math.random() * mediumMissions.length)]);
  }
  if (count >= 3 && hardMissions.length > 0) {
    selected.push(hardMissions[Math.floor(Math.random() * hardMissions.length)]);
  }

  return selected;
}

// カードIDからカード情報を取得
export function getCardById(cardId: string): GameCard | undefined {
  return GAME_CARDS.find(card => card.id === cardId);
}

// ミッションIDからミッション情報を取得
export function getMissionById(missionId: string): Mission | undefined {
  return MISSIONS.find(mission => mission.id === missionId);
}
