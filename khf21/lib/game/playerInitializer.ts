// プレイヤー初期化時の戦略要素セットアップ

import type { GamePlayer } from '@/types/multiplayer.types';
import type { PlayerCard, PlayerMission, PlayerStatistics } from '@/types/strategy.types';
import { drawRandomCards, assignRandomMissions } from './strategyData';

// プレイヤーに初期カードとミッションを割り当て
export function initializePlayerStrategy(player: GamePlayer): GamePlayer {
  // 初期カードを3枚配布
  const initialCards = drawRandomCards(3);
  const cards: PlayerCard[] = initialCards.map(card => ({
    cardId: card.id,
    obtainedAt: new Date().toISOString(),
    used: false,
  }));

  // ミッションを3つ割り当て
  const missions = assignRandomMissions(3);
  const playerMissions: PlayerMission[] = missions.map(mission => ({
    missionId: mission.id,
    progress: 0,
    completed: false,
  }));

  // 統計情報の初期化
  const statistics: PlayerStatistics = {
    citiesVisited: [],
    continentsVisited: [],
    totalDistance: 0,
    overtakeCount: 0,
    overtakenCount: 0,
    cardsUsed: 0,
    missionsCompleted: 0,
  };

  return {
    ...player,
    cards,
    missions: playerMissions,
    occupied_cities: [],
    active_effects: [],
    statistics,
  };
}

// 複数プレイヤーを初期化
export function initializeAllPlayersStrategy(players: GamePlayer[]): GamePlayer[] {
  return players.map(player => initializePlayerStrategy(player));
}
