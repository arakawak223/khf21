/**
 * 資源管理システムのオプション設定
 * フライトクラス、ホテルグレード、アクティビティ、キャラクター特性の定義
 */

import type {
  FlightClassOption,
  HotelGradeOption,
  ActivityOption,
  CharacterTraitOption,
} from '@/types/multiplayer.types';

/**
 * フライトクラスの選択肢
 */
export const FLIGHT_CLASS_OPTIONS: FlightClassOption[] = [
  {
    class: 'economy',
    name: 'エコノミー',
    description: '標準的なフライト',
    cost: 0,
    starEncounterBonus: 0,
    bonusPoints: 0,
    emoji: '✈️',
  },
  {
    class: 'business',
    name: 'ビジネス',
    description: 'スター遭遇率+20%',
    cost: 10,
    starEncounterBonus: 20,
    bonusPoints: 5,
    emoji: '🛫',
  },
  {
    class: 'first',
    name: 'ファースト',
    description: 'スター遭遇率+40%、ボーナスポイント+10',
    cost: 20,
    starEncounterBonus: 40,
    bonusPoints: 10,
    emoji: '🌟',
  },
];

/**
 * ホテルグレードの選択肢
 */
export const HOTEL_GRADE_OPTIONS: HotelGradeOption[] = [
  {
    grade: 'guesthouse',
    name: 'ゲストハウス',
    description: '手頃な宿泊施設',
    cost: 0,
    specialEventBonus: 0,
    starEncounterBonus: 0,
    emoji: '🏠',
  },
  {
    grade: 'standard',
    name: '3つ星ホテル',
    description: '特別イベント発生率+15%',
    cost: 5,
    specialEventBonus: 15,
    starEncounterBonus: 10,
    emoji: '🏨',
  },
  {
    grade: 'luxury',
    name: '5つ星ホテル',
    description: 'VIPラウンジアクセス、著名人遭遇率大幅UP',
    cost: 15,
    specialEventBonus: 30,
    starEncounterBonus: 35,
    emoji: '🏰',
  },
];

/**
 * 観光アクティビティの選択肢
 */
export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'museum',
    name: '美術館巡り',
    description: '芸術に触れる体験',
    cost: 5,
    pointsRange: [10, 25],
    emoji: '🎨',
  },
  {
    id: 'gourmet',
    name: 'グルメツアー',
    description: '現地の料理を堪能',
    cost: 8,
    pointsRange: [15, 35],
    emoji: '🍽️',
  },
  {
    id: 'adventure',
    name: 'アドベンチャー体験',
    description: 'スリリングなアクティビティ',
    cost: 12,
    pointsRange: [20, 50],
    emoji: '🏔️',
  },
  {
    id: 'cultural',
    name: '文化体験',
    description: '伝統文化に触れる',
    cost: 6,
    pointsRange: [12, 30],
    emoji: '🎭',
  },
];

/**
 * キャラクター特性の選択肢
 */
export const CHARACTER_TRAIT_OPTIONS: CharacterTraitOption[] = [
  {
    trait: 'adventurer',
    name: '冒険家タイプ',
    description: 'リスクを恐れず、大胆に行動',
    emoji: '🗺️',
    effects: {
      resourcePoints: 100,
      longDistanceBonus: 20,
      starEncounterRate: 10,
      eventRateModifier: 15, // イベント発生率+15%
      specialAbility: '長距離移動時ボーナス+20%、トラブルイベント遭遇率+15%',
    },
  },
  {
    trait: 'planner',
    name: '計画的タイプ',
    description: '堅実に予算を管理',
    emoji: '📋',
    effects: {
      resourcePoints: 120, // 初期リソース+20
      longDistanceBonus: -10,
      starEncounterRate: 0,
      eventRateModifier: 0,
      specialAbility: '初期資源ポイント+20、長距離移動時ボーナス-10%、安全ルートでも確実にポイント獲得',
    },
  },
  {
    trait: 'socialite',
    name: '社交的タイプ',
    description: '人との出会いを楽しむ',
    emoji: '🤝',
    effects: {
      resourcePoints: 100,
      longDistanceBonus: 0,
      starEncounterRate: 50, // スター遭遇率+50%
      eventRateModifier: -10, // 通常イベント発生率-10%
      specialAbility: 'スター遭遇時のポイント+50%、他プレイヤーとの相互作用ボーナス、単独行動時ボーナス-10%',
    },
  },
  {
    trait: 'efficient',
    name: '効率重視タイプ',
    description: '最短距離で目標達成',
    emoji: '⚡',
    effects: {
      resourcePoints: 110,
      longDistanceBonus: 0,
      starEncounterRate: 0,
      eventRateModifier: -20, // イベント発生率-20%
      specialAbility: 'サイコロ平均値+0.5、イベント発生率-20%、ボーナスポイント機会減',
    },
  },
  {
    trait: 'balanced',
    name: 'バランス型',
    description: 'バランスの取れたプレイスタイル',
    emoji: '⚖️',
    effects: {
      resourcePoints: 100,
      longDistanceBonus: 0,
      starEncounterRate: 0,
      eventRateModifier: 0,
      specialAbility: '特別なボーナス・ペナルティなし、安定したプレイが可能',
    },
  },
];

/**
 * フライトクラスを取得
 */
export function getFlightClassOption(flightClass: string): FlightClassOption | undefined {
  return FLIGHT_CLASS_OPTIONS.find(option => option.class === flightClass);
}

/**
 * ホテルグレードを取得
 */
export function getHotelGradeOption(hotelGrade: string): HotelGradeOption | undefined {
  return HOTEL_GRADE_OPTIONS.find(option => option.grade === hotelGrade);
}

/**
 * アクティビティを取得
 */
export function getActivityOption(activityId: string): ActivityOption | undefined {
  return ACTIVITY_OPTIONS.find(option => option.id === activityId);
}

/**
 * キャラクター特性を取得
 */
export function getCharacterTraitOption(trait: string): CharacterTraitOption | undefined {
  return CHARACTER_TRAIT_OPTIONS.find(option => option.trait === trait);
}

/**
 * フライトクラスアップグレードの可否をチェック
 */
export function canAffordFlightClass(
  currentResourcePoints: number,
  desiredClass: string
): boolean {
  const option = getFlightClassOption(desiredClass);
  if (!option) return false;
  return currentResourcePoints >= option.cost;
}

/**
 * ホテルグレードアップグレードの可否をチェック
 */
export function canAffordHotelGrade(
  currentResourcePoints: number,
  desiredGrade: string
): boolean {
  const option = getHotelGradeOption(desiredGrade);
  if (!option) return false;
  return currentResourcePoints >= option.cost;
}

/**
 * アクティビティ参加の可否をチェック
 */
export function canAffordActivity(
  currentResourcePoints: number,
  activityId: string
): boolean {
  const option = getActivityOption(activityId);
  if (!option) return false;
  return currentResourcePoints >= option.cost;
}
