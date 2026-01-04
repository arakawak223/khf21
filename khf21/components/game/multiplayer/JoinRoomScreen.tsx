'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface JoinRoomScreenProps {
  onJoinRoom: (roomCode: string, playerNickname: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function JoinRoomScreen({
  onJoinRoom,
  onBack,
  isLoading = false,
  error = null,
}: JoinRoomScreenProps) {
  const [roomCode, setRoomCode] = useState('');
  const [playerNickname, setPlayerNickname] = useState('');

  const handleJoin = () => {
    if (!roomCode.trim() || !playerNickname.trim()) {
      return;
    }

    onJoinRoom(roomCode.trim().toUpperCase(), playerNickname.trim());
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 英数字のみ、6文字まで、自動的に大文字に変換
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(value);
  };

  const canJoin = roomCode.length === 6 && playerNickname.trim();

  return (
    <div className="mobile-container py-6">
      <Card className="p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              ルームに参加
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              フレンドから共有されたルームコードを入力
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                ❌ {error}
              </p>
            </div>
          )}

          {/* ルームコード入力 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              ルームコード *
            </Label>
            <input
              type="text"
              placeholder="ABC123"
              value={roomCode}
              onChange={handleRoomCodeChange}
              maxLength={6}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 text-center text-2xl font-mono tracking-wider uppercase"
              disabled={isLoading}
              autoCapitalize="characters"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              6文字の英数字コード
            </p>
          </div>

          {/* プレイヤー名 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              あなたのニックネーム *
            </Label>
            <input
              type="text"
              placeholder="プレイヤー名を入力"
              value={playerNickname}
              onChange={(e) => setPlayerNickname(e.target.value)}
              maxLength={20}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex-1 touch-target"
              disabled={isLoading}
            >
              戻る
            </Button>
            <Button
              onClick={handleJoin}
              disabled={!canJoin || isLoading}
              size="lg"
              className="flex-1 touch-target bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              {isLoading ? '参加中...' : '参加する'}
            </Button>
          </div>

          {/* 説明 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <span className="font-bold">💡 ヒント</span><br />
              ルームコードはホストプレイヤーから共有されます。<br />
              例: ABC123, XYZ789
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
