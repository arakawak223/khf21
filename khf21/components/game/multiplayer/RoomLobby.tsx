'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { GameRoom, RoomPlayer } from '@/lib/game/roomManager';

interface RoomLobbyProps {
  room: GameRoom;
  players: RoomPlayer[];
  currentUserId: string;
  onReady: (isReady: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  isStarting?: boolean;
}

export default function RoomLobby({
  room,
  players,
  currentUserId,
  onReady,
  onStartGame,
  onLeaveRoom,
  isStarting = false,
}: RoomLobbyProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const currentPlayer = players.find((p) => p.user_id === currentUserId);
  const isHost = currentPlayer?.is_host || false;
  const allPlayersReady = players.length >= 2 && players.every((p) => p.is_ready || p.is_host);

  // ルームコードをコピー
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.room_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className="mobile-container py-6">
      <Card className="p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {room.room_name || 'ゲームルーム'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              プレイヤーを待っています...
            </p>
          </div>

          {/* ルームコード */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg border-2 border-purple-300 dark:border-purple-700">
            <p className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">
              ルームコード
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                {room.room_code}
              </p>
              <button
                onClick={copyRoomCode}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedCode ? '✓ コピー済み' : '📋 コピー'}
              </button>
            </div>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
              このコードを共有してフレンドを招待
            </p>
          </div>

          {/* ゲーム設定 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              ⚙️ ゲーム設定
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-200">
              <div>
                <span className="font-semibold">期間:</span> {room.game_settings.periodName}
              </div>
              <div>
                <span className="font-semibold">最大人数:</span> {room.max_players}人
              </div>
            </div>
          </div>

          {/* プレイヤーリスト */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              プレイヤー ({players.length}/{room.max_players})
            </p>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      player.user_id === currentUserId
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* プレイヤーカラー */}
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: player.player_color }}
                      />

                      {/* プレイヤー情報 */}
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">
                          {player.player_nickname}
                          {player.is_host && (
                            <span className="ml-2 text-xs px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full">
                              👑 ホスト
                            </span>
                          )}
                          {player.user_id === currentUserId && (
                            <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">
                              (あなた)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {player.connection_status === 'connected' ? '🟢 接続中' : '🔴 切断'}
                        </p>
                      </div>
                    </div>

                    {/* 準備状態 */}
                    <div>
                      {player.is_host ? (
                        <span className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          待機中
                        </span>
                      ) : player.is_ready ? (
                        <span className="text-sm px-3 py-1 bg-green-500 text-white rounded-full">
                          ✓ 準備OK
                        </span>
                      ) : (
                        <span className="text-sm px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                          準備中
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* 空きスロット */}
              {Array.from({ length: room.max_players - players.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                >
                  <p className="text-center text-gray-400 dark:text-gray-500">
                    参加者募集中...
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            {isHost ? (
              /* ホストの場合 */
              <>
                <Button
                  onClick={onStartGame}
                  disabled={!allPlayersReady || isStarting}
                  size="lg"
                  className="w-full touch-target bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isStarting ? '🚀 ゲーム開始中...' : '🎮 ゲーム開始'}
                </Button>
                {!allPlayersReady && (
                  <p className="text-xs text-center text-amber-600 dark:text-amber-400">
                    全員が準備完了するまで待ちましょう（最低2人必要）
                  </p>
                )}
              </>
            ) : (
              /* 参加者の場合 */
              <Button
                onClick={() => onReady(!currentPlayer?.is_ready)}
                disabled={isStarting}
                size="lg"
                className={`w-full touch-target ${
                  currentPlayer?.is_ready
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {currentPlayer?.is_ready ? '準備解除' : '準備完了'}
              </Button>
            )}

            <Button
              onClick={onLeaveRoom}
              variant="outline"
              size="lg"
              className="w-full touch-target"
              disabled={isStarting}
            >
              退室する
            </Button>
          </div>

          {/* 注意事項 */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-bold">💡 ゲーム開始前に</span><br />
              ・全員が準備完了してからホストがゲームを開始します<br />
              ・ゲーム開始後は途中退出できません<br />
              ・安定したネット接続を確保してください
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
