// マス効果の実行ロジック

import type { SpaceType, SpaceEffect, RouteSpace } from '@/types/strategy.types';
import type { GamePlayer } from '@/types/multiplayer.types';
import { drawRandomPlayerCards } from './strategyData';
import { getSpaceTypeDescription } from './spaceManager';

// ===============================
// マス効果実行結果
// ===============================

export interface SpaceEffectResult {
  success: boolean;
  message: string;
  updatedPlayer?: GamePlayer;
  newCards?: import('@/types/strategy.types').PlayerCard[];
  pointsGained?: {
    impressed: number;
    giver: number;
  };
  forceEvent?: {
    type: 'star' | 'attraction' | 'gourmet' | 'art';
  };
}

// ===============================
// マス効果実行
// ===============================

/**
 * マスに止まった時の効果を実行
 */
export async function executeSpaceEffect(
  space: RouteSpace,
  player: GamePlayer
): Promise<SpaceEffectResult> {
  if (!space.type || space.type === 'normal') {
    return {
      success: true,
      message: '',
    };
  }

  console.log(`[SpaceEffect] ${player.player_nickname} が ${space.type}マス（#${space.spaceNumber}）に止まりました`);

  switch (space.type) {
    case 'card':
      return executeCardSpace(space, player);

    case 'bonus':
      return executeBonusSpace(space, player);

    case 'event':
      return executeEventSpace(space, player);

    // 第2段階で実装
    case 'trap':
      return executeTrapSpace(space, player);

    case 'warp':
      return executeWarpSpace(space, player);

    case 'safe':
      return executeSafeSpace(space, player);

    // 第3段階で実装
    case 'lucky':
      return executeLuckySpace(space, player);

    case 'mission':
      return executeMissionSpace(space, player);

    default:
      return {
        success: false,
        message: '不明なマスタイプです',
      };
  }
}

// ===============================
// 第1段階: カード・ボーナス・イベント
// ===============================

/**
 * カードマス: カードを確定獲得
 */
function executeCardSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  const effect = space.effect || {};
  const cardCount = effect.cardCount || 1;
  const rarity = effect.cardRarity;

  // カードを引く（レアリティ指定がある場合は考慮）
  const newCards = drawRandomPlayerCards(cardCount);

  // TODO: レアリティ指定の実装は後で拡張可能
  // 現在はdrawRandomPlayerCardsがレアリティを考慮して抽選

  const rarityText = rarity === 3 ? '超レア' : rarity === 2 ? 'レア' : 'コモン';
  const message = `🎴 カードマス！\n${rarityText}カードを${cardCount}枚獲得しました！`;

  console.log(`[CardSpace] ${player.player_nickname} がカード${cardCount}枚を獲得`);

  return {
    success: true,
    message,
    newCards,
  };
}

/**
 * ボーナスマス: ポイントを獲得
 */
function executeBonusSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  const effect = space.effect || {};
  const bonusPoints = effect.bonusPoints || 0;
  const pointsType = effect.pointsType || 'impressed';

  const pointsGained = {
    impressed: pointsType === 'impressed' ? bonusPoints : 0,
    giver: pointsType === 'giver' ? bonusPoints : 0,
  };

  const pointTypeName = pointsType === 'impressed' ? 'Impressed' : 'Giver';
  const message = `💎 ボーナスマス！\n${pointTypeName}ポイント+${bonusPoints}pt獲得！`;

  console.log(`[BonusSpace] ${player.player_nickname} が${pointTypeName}ポイント${bonusPoints}ptを獲得`);

  return {
    success: true,
    message,
    pointsGained,
  };
}

/**
 * イベントマス: イベントを強制発生
 */
function executeEventSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  const effect = space.effect || {};
  const eventType = effect.forceEventType || 'star';

  const eventTypeMap = {
    star: 'スター遭遇',
    attraction: '名所訪問',
    gourmet: 'グルメ体験',
    art: 'アート鑑賞',
  };

  const eventName = eventTypeMap[eventType];
  const message = `⭐ イベントマス！\n${eventName}イベントが発生します！`;

  console.log(`[EventSpace] ${player.player_nickname} に${eventName}イベントが発生`);

  return {
    success: true,
    message,
    forceEvent: {
      type: eventType,
    },
  };
}

// ===============================
// 第2段階: トラップ・ワープ・セーフ（未実装）
// ===============================

function executeTrapSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  // TODO: 第2段階で実装
  return {
    success: true,
    message: '💣 トラップマス（未実装）',
  };
}

function executeWarpSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  // TODO: 第2段階で実装
  return {
    success: true,
    message: '🌀 ワープマス（未実装）',
  };
}

function executeSafeSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  // TODO: 第2段階で実装
  return {
    success: true,
    message: '🛡️ セーフマス（未実装）',
  };
}

// ===============================
// 第3段階: ラッキー・ミッション（未実装）
// ===============================

function executeLuckySpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  // TODO: 第3段階で実装
  return {
    success: true,
    message: '🍀 ラッキーマス（未実装）',
  };
}

function executeMissionSpace(space: RouteSpace, player: GamePlayer): SpaceEffectResult {
  // TODO: 第3段階で実装
  return {
    success: true,
    message: '🎯 ミッションマス（未実装）',
  };
}

// ===============================
// ヘルパー関数
// ===============================

/**
 * マス効果の説明を取得
 */
export function getSpaceEffectDescription(space: RouteSpace): string {
  if (!space.type || space.type === 'normal') {
    return '';
  }
  return getSpaceTypeDescription(space.type, space.effect);
}
