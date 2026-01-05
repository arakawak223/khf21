'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DESTINATION_COUNTS } from '@/lib/game/constants';
import type { Airport } from '@/types/database.types';

interface CreateRoomScreenProps {
  airports: Airport[];
  onCreateRoom: (settings: {
    roomName: string;
    playerNickname: string;
    destinationCount: number;
    destinationLabel: string;
    startingAirportId: string;
    maxPlayers: number;
  }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function CreateRoomScreen({
  airports,
  onCreateRoom,
  onBack,
  isLoading = false,
}: CreateRoomScreenProps) {
  const [roomName, setRoomName] = useState('');
  const [playerNickname, setPlayerNickname] = useState('');
  const [selectedDestinationCount, setSelectedDestinationCount] = useState('5destinations');
  const [selectedAirportId, setSelectedAirportId] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDestinationData = DESTINATION_COUNTS.find((d) => d.value === selectedDestinationCount);

  // 空港検索フィルター
  const filteredAirports = airports.filter((airport) => {
    const search = searchTerm.toLowerCase();
    return (
      airport.name.toLowerCase().includes(search) ||
      airport.name_ja?.toLowerCase().includes(search) ||
      airport.city.toLowerCase().includes(search) ||
      airport.country.toLowerCase().includes(search) ||
      airport.code.toLowerCase().includes(search)
    );
  });

  const handleCreate = () => {
    if (!selectedAirportId || !selectedDestinationData || !playerNickname.trim()) {
      return;
    }

    onCreateRoom({
      roomName: roomName.trim() || `${playerNickname}のルーム`,
      playerNickname: playerNickname.trim(),
      destinationCount: selectedDestinationData.count,
      destinationLabel: selectedDestinationData.label,
      startingAirportId: selectedAirportId,
      maxPlayers,
    });
  };

  const canCreate = selectedAirportId && playerNickname.trim();

  return (
    <div className="mobile-container py-6">
      <Card className="p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              ルームを作成
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              フレンドと一緒に世界旅行に出かけよう
            </p>
          </div>

          {/* ルーム名 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              ルーム名（任意）
            </Label>
            <input
              type="text"
              placeholder="入力しない場合は自動生成されます"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={30}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
              disabled={isLoading}
            />
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

          {/* 最大プレイヤー数 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              最大プレイヤー数
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  disabled={isLoading}
                  className={`
                    touch-target p-3 rounded-lg border-2 transition-all
                    ${
                      maxPlayers === num
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {num}人
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 目的地数選択 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              訪問する目的地の数
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {DESTINATION_COUNTS.map((destination) => (
                <button
                  key={destination.value}
                  onClick={() => setSelectedDestinationCount(destination.value)}
                  disabled={isLoading}
                  className={`
                    touch-target p-4 rounded-lg border-2 transition-all
                    ${
                      selectedDestinationCount === destination.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {destination.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ({destination.count}箇所訪問)
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 出発空港選択 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              出発地を選択 *
            </Label>

            {/* 検索ボックス */}
            <input
              type="text"
              placeholder="空港名、都市名、国名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              disabled={airports.length === 0 || isLoading}
            />

            {/* 空港リスト */}
            <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              {filteredAirports.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  検索結果が見つかりません
                </div>
              ) : (
                filteredAirports.slice(0, 50).map((airport) => (
                  <button
                    key={airport.id}
                    onClick={() => setSelectedAirportId(airport.id)}
                    disabled={isLoading}
                    className={`
                      w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                      ${
                        selectedAirportId === airport.id
                          ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500'
                          : ''
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {airport.name_ja || airport.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {airport.city}, {airport.country}
                        </p>
                      </div>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {airport.code}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
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
              onClick={handleCreate}
              disabled={!canCreate || isLoading}
              size="lg"
              className="flex-1 touch-target bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isLoading ? '作成中...' : 'ルームを作成'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
