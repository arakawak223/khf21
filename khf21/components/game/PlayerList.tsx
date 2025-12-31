/**
 * プレイヤー一覧コンポーネント
 * 全プレイヤーの順位、ポイント、状態を表示
 */

'use client';

import { motion } from 'framer-motion';
import type { GamePlayer } from '@/types/multiplayer.types';
import type { Airport } from '@/types/database.types';
import { ResourcePointsDisplay } from './ResourcePointsDisplay';

interface PlayerListProps {
  players: GamePlayer[];
  currentTurnPlayer: GamePlayer | null;
  airports: Airport[];
  destinationAirport: Airport | null;
}

export function PlayerList({ players, currentTurnPlayer, airports, destinationAirport }: PlayerListProps) {
  // ポイント順にソート（降順）
  const sortedPlayers = [...players].sort((a, b) => b.total_points - a.total_points);

  const getPlayerIcon = (playerType: string): string => {
    switch (playerType) {
      case 'human':
        return '👤';
      case 'freeman_d':
        return '🤖';
      case 'freeman_s':
        return '🤝';
      default:
        return '🎮';
    }
  };

  const getPlayerTypeLabel = (playerType: string): string => {
    switch (playerType) {
      case 'human':
        return '人間';
      case 'freeman_d':
        return 'Dフリーマン';
      case 'freeman_s':
        return 'Sフリーマン';
      default:
        return 'プレイヤー';
    }
  };

  const getRankBadge = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}位`;
    }
  };

  const getRouteInfo = (player: GamePlayer): { departure: string; destination: string; progress: string } | null => {
    // ルート情報がない場合
    if (!player.route_spaces || player.route_spaces.length === 0) {
      return null;
    }

    // 出発地（現在の空港）を取得
    const departureAirport = airports.find(a => a.id === player.current_airport_id);
    const departureName = departureAirport ? (departureAirport.city || departureAirport.name) : '不明';

    // 目的地を取得（共通の目的地または route_spaces の最終地点）
    let destinationName = '不明';
    if (destinationAirport) {
      destinationName = destinationAirport.city || destinationAirport.name;
    } else if (player.route_spaces.length > 0) {
      // route_spaces の最終地点から最も近い空港を見つける
      const finalSpace = player.route_spaces[player.route_spaces.length - 1];
      const nearestAirport = airports.reduce((nearest, airport) => {
        const distToCurrent = Math.sqrt(
          Math.pow(airport.latitude - finalSpace.lat, 2) +
          Math.pow(airport.longitude - finalSpace.lng, 2)
        );
        const distToNearest = Math.sqrt(
          Math.pow(nearest.latitude - finalSpace.lat, 2) +
          Math.pow(nearest.longitude - finalSpace.lng, 2)
        );
        return distToCurrent < distToNearest ? airport : nearest;
      }, airports[0]);
      destinationName = nearestAirport ? (nearestAirport.city || nearestAirport.name) : '不明';
    }

    // 進捗状況（現在地）
    const currentSpace = player.current_space_number;
    const totalSpaces = player.route_spaces.length;
    const progress = `${currentSpace}/${totalSpaces}マス`;

    return {
      departure: departureName,
      destination: destinationName,
      progress,
    };
  };

  const getLocationLabel = (player: GamePlayer): string => {
    const routeInfo = getRouteInfo(player);

    if (!routeInfo) {
      if (player.current_location_type === 'airport') {
        return '空港';
      }
      return '-';
    }

    // 移動中の場合
    if (player.current_space_number > 0 && player.current_space_number < (player.route_spaces?.length || 0)) {
      return `${routeInfo.departure} ➔ ${routeInfo.destination} (${routeInfo.progress})`;
    }

    // 空港にいる場合
    if (player.current_space_number === 0) {
      return `${routeInfo.departure} にて待機`;
    }

    // 到着した場合
    if (player.current_space_number >= (player.route_spaces?.length || 0)) {
      return `${routeInfo.destination} に到着`;
    }

    return `${routeInfo.departure} ➔ ${routeInfo.destination}`;
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-1">
        <span>🏆</span>
        <span>順位</span>
      </h3>

      <div className="space-y-1">
        {sortedPlayers.map((player, index) => {
          const rank = index + 1;
          const isCurrentTurn = currentTurnPlayer?.id === player.id;

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white rounded-lg shadow-sm p-2 border transition-all
                ${isCurrentTurn ? 'border-blue-400' : 'border-gray-200'}
              `}
            >
              <div className="flex flex-col gap-1">
                {/* 第1行：順位、アイコン、名前、ポイント */}
                <div className="flex items-center gap-2">
                  {/* 順位バッジ */}
                  <div className="flex-shrink-0 w-6 text-center text-xs">
                    {getRankBadge(rank)}
                  </div>

                  {/* プレイヤーアイコン */}
                  <div className="flex-shrink-0 text-lg">
                    {getPlayerIcon(player.player_type)}
                  </div>

                  {/* プレイヤー情報 */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-gray-800 truncate">
                        {player.player_nickname}
                      </h4>
                      {isCurrentTurn && (
                        <span className="text-[10px] bg-blue-500 text-white px-1 rounded">
                          ターン
                        </span>
                      )}
                      {player.is_skipping_turn && (
                        <span className="text-sm">😴</span>
                      )}
                    </div>
                  </div>

                  {/* ポイント表示 */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-bold text-gray-800">
                      {player.total_points}
                    </div>
                    <div className="text-[10px] text-gray-500">pt</div>
                  </div>
                </div>

                {/* 第2行：現在地・経路情報 */}
                <div className="pl-8 text-[10px] text-gray-600 truncate">
                  {getLocationLabel(player)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
