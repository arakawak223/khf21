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
 * マスタイプの配置パターンを生成（第1段階: カード・ボーナス・イベント）
 *
 * 配置ルール:
 * - 1-2マス目: 通常
 * - 3マス目: カード
 * - 4-5マス目: 通常
 * - 6マス目: ボーナス
 * - 7-8マス目: 通常
 * - 9マス目: イベント
 * - 以降、3マスごとに特殊マスを配置
 */
export function generateSpacePattern(totalSpaces: number): SpaceConfig[] {
  const configs: SpaceConfig[] = [];

  for (let i = 1; i <= totalSpaces; i++) {
    let type: SpaceType = 'normal';
    let effect: SpaceEffect | undefined;

    // 配置パターン（9マス周期）
    const position = i % 9;

    if (position === 3) {
      // 3マス目ごと: カードマス
      type = 'card';
      effect = {
        cardCount: 1,
        // レアリティはランダム（60% コモン、30% レア、10% 超レア）
        cardRarity: getRandomCardRarity(),
      };
    } else if (position === 6) {
      // 6マス目ごと: ボーナスマス
      type = 'bonus';
      effect = {
        bonusPoints: getRandomBonusPoints(i, totalSpaces),
        pointsType: Math.random() < 0.7 ? 'impressed' : 'giver',
      };
    } else if (position === 0) {
      // 9マス目ごと: イベントマス
      type = 'event';
      effect = {
        forceEventType: getRandomEventType(),
      };
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
