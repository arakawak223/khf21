// マスタイプ配置システム

import type { SpaceType, SpaceConfig, SpaceEffect, RouteSpace } from '@/types/strategy.types';

// ===============================
// マスタイプのアイコンと色定義
// ===============================

const SPACE_TYPE_CONFIG: Record<SpaceType, { icon: string; colorClass: string; name: string }> = {
  normal: { icon: '⚪', colorClass: 'bg-gray-200', name: '通常' },
  card: { icon: '🎴', colorClass: 'bg-purple-400', name: 'カード' },
  bonus: { icon: '💎', colorClass: 'bg-yellow-400', name: 'ボーナス' },
  event: { icon: '⭐', colorClass: 'bg-blue-400', name: 'イベント' },
  trap: { icon: '💣', colorClass: 'bg-red-400', name: 'トラップ' },
  warp: { icon: '🌀', colorClass: 'bg-green-400', name: 'ワープ' },
  safe: { icon: '🛡️', colorClass: 'bg-cyan-400', name: 'セーフ' },
  lucky: { icon: '🍀', colorClass: 'bg-pink-400', name: 'ラッキー' },
  mission: { icon: '🎯', colorClass: 'bg-orange-400', name: 'ミッション' },
};

// ===============================
// 配置パターン定義
// ===============================

/**
 * マスタイプの配置パターンを生成（第2段階: 全6種類のマス）
 *
 * 配置ルール（12マス周期）:
 * - 3マス目: カードマス
 * - 4マス目: トラップマス（新規）
 * - 6マス目: ボーナスマス
 * - 8マス目: ワープマス（新規）
 * - 9マス目: イベントマス
 * - 11マス目: セーフマス（新規）
 * - 残り: 通常マス
 */
export function generateSpacePattern(totalSpaces: number): SpaceConfig[] {
  const configs: SpaceConfig[] = [];

  for (let i = 1; i <= totalSpaces; i++) {
    let type: SpaceType = 'normal';
    let effect: SpaceEffect | undefined;

    // 配置パターン（12マス周期）
    const position = i % 12;

    if (position === 3) {
      // 3マス目ごと: カードマス
      type = 'card';
      effect = {
        cardCount: 1,
        cardRarity: getRandomCardRarity(),
      };
    } else if (position === 4) {
      // 4マス目ごと: トラップマス
      type = 'trap';
      effect = {
        penaltyPoints: getRandomPenaltyPoints(i, totalSpaces),
        moveBack: Math.random() < 0.5 ? 1 : 2, // 50%で1マス、50%で2マス後退
      };
    } else if (position === 6) {
      // 6マス目ごと: ボーナスマス
      type = 'bonus';
      effect = {
        bonusPoints: getRandomBonusPoints(i, totalSpaces),
        pointsType: Math.random() < 0.7 ? 'impressed' : 'giver',
      };
    } else if (position === 8) {
      // 8マス目ごと: ワープマス
      type = 'warp';
      effect = {
        warpForward: Math.random() < 0.5 ? 2 : 3, // 50%で2マス、50%で3マス前進
      };
    } else if (position === 9) {
      // 9マス目ごと: イベントマス
      type = 'event';
      effect = {
        forceEventType: getRandomEventType(),
      };
    } else if (position === 11) {
      // 11マス目ごと: セーフマス
      type = 'safe';
      effect = {}; // セーフマスは特別な効果パラメータ不要
    }

    // 最終マス（到着地点）は必ずボーナス
    if (i === totalSpaces) {
      type = 'bonus';
      effect = {
        bonusPoints: 100, // 到着ボーナス
        pointsType: 'impressed',
      };
    }

    const config = SPACE_TYPE_CONFIG[type];
    configs.push({
      spaceNumber: i,
      type,
      effect,
      icon: config.icon,
      colorClass: config.colorClass,
    });
  }

  console.log(`Generated ${configs.length} space configs (${configs.filter(c => c.type !== 'normal').length} special spaces)`);
  return configs;
}

/**
 * ルートスペースにマスタイプを適用
 */
export function applySpaceTypesToRoute(
  routeSpaces: Array<{ lat: number; lng: number; spaceNumber: number }>,
  spaceConfigs: SpaceConfig[]
): RouteSpace[] {
  return routeSpaces.map((space) => {
    const config = spaceConfigs.find((c) => c.spaceNumber === space.spaceNumber);
    return {
      ...space,
      type: config?.type || 'normal',
      effect: config?.effect,
    };
  });
}

/**
 * ランダムなカードレアリティを取得
 */
function getRandomCardRarity(): 1 | 2 | 3 {
  const roll = Math.random() * 100;
  if (roll < 10) return 3;  // 10% 超レア
  if (roll < 40) return 2;  // 30% レア
  return 1;                 // 60% コモン
}

/**
 * ランダムなボーナスポイントを取得
 * 後半のマスほど高いポイント
 */
function getRandomBonusPoints(currentSpace: number, totalSpaces: number): number {
  const progress = currentSpace / totalSpaces;

  if (progress < 0.33) {
    // 前半: 20-40pt
    return 20 + Math.floor(Math.random() * 21);
  } else if (progress < 0.66) {
    // 中盤: 40-70pt
    return 40 + Math.floor(Math.random() * 31);
  } else {
    // 後半: 70-100pt
    return 70 + Math.floor(Math.random() * 31);
  }
}

/**
 * ランダムなペナルティポイントを取得
 * 後半のマスほど高いペナルティ
 */
function getRandomPenaltyPoints(currentSpace: number, totalSpaces: number): number {
  const progress = currentSpace / totalSpaces;

  if (progress < 0.33) {
    // 前半: 10-20pt
    return 10 + Math.floor(Math.random() * 11);
  } else if (progress < 0.66) {
    // 中盤: 20-35pt
    return 20 + Math.floor(Math.random() * 16);
  } else {
    // 後半: 35-50pt
    return 35 + Math.floor(Math.random() * 16);
  }
}

/**
 * ランダムなイベントタイプを取得
 */
function getRandomEventType(): 'star' | 'attraction' | 'gourmet' | 'art' {
  const types: Array<'star' | 'attraction' | 'gourmet' | 'art'> = ['star', 'attraction', 'gourmet', 'art'];
  const weights = [0.3, 0.4, 0.2, 0.1]; // 重み付け

  const roll = Math.random();
  let cumulative = 0;

  for (let i = 0; i < types.length; i++) {
    cumulative += weights[i];
    if (roll < cumulative) {
      return types[i];
    }
  }

  return 'star';
}

/**
 * 特定のマス番号の設定を取得
 */
export function getSpaceConfig(spaceNumber: number, configs: SpaceConfig[]): SpaceConfig | undefined {
  return configs.find((c) => c.spaceNumber === spaceNumber);
}

/**
 * マスタイプの表示情報を取得
 */
export function getSpaceTypeInfo(type: SpaceType): { icon: string; colorClass: string; name: string } {
  return SPACE_TYPE_CONFIG[type];
}

/**
 * マスタイプの説明テキストを取得
 */
export function getSpaceTypeDescription(type: SpaceType, effect?: SpaceEffect): string {
  switch (type) {
    case 'card':
      const rarity = effect?.cardRarity || 1;
      const rarityText = rarity === 3 ? '超レア' : rarity === 2 ? 'レア' : 'コモン';
      return `カードを${effect?.cardCount || 1}枚獲得！（${rarityText}）`;

    case 'bonus':
      const pointType = effect?.pointsType === 'giver' ? 'Giverポイント' : 'Impressedポイント';
      return `${pointType}+${effect?.bonusPoints || 0}pt獲得！`;

    case 'event':
      const eventTypeMap = {
        star: 'スター遭遇',
        attraction: '名所訪問',
        gourmet: 'グルメ体験',
        art: 'アート鑑賞',
      };
      const eventName = eventTypeMap[effect?.forceEventType || 'star'];
      return `${eventName}イベント発生！`;

    case 'trap':
      return `トラップ！${effect?.penaltyPoints || 0}pt減少`;

    case 'warp':
      return `ワープ！${effect?.warpForward || 0}マス前進`;

    case 'safe':
      return 'セーフゾーン！攻撃カード無効';

    case 'lucky':
      return 'ラッキー！良いことが起こる';

    case 'mission':
      return 'ミッションブースト！';

    default:
      return '';
  }
}
