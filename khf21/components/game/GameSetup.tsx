'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GAME_PERIODS } from '@/lib/game/constants';
import type { Airport } from '@/types/database.types';

interface GameSetupProps {
  airports: Airport[];
  onStart: (periodDays: number, periodName: string, startingAirportId: string, nickname?: string) => void;
}

export default function GameSetup({ airports, onStart }: GameSetupProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('1week');
  const [selectedAirportId, setSelectedAirportId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [nickname, setNickname] = useState('');

  const selectedPeriodData = GAME_PERIODS.find((p) => p.value === selectedPeriod);

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

  const handleStart = () => {
    if (!selectedAirportId || !selectedPeriodData) return;
    onStart(selectedPeriodData.days, selectedPeriodData.label, selectedAirportId, nickname.trim() || undefined);
  };

  return (
    <div className="mobile-container py-6">
      <Card className="p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              世界旅行を始めよう
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              旅の期間と出発地を選択してください
            </p>
          </div>

          {/* ニックネーム入力 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              ニックネーム（任意）
            </Label>
            <input
              type="text"
              placeholder="入力しない場合は「プレイヤー1」になります"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              地図上で表示されます（最大20文字）
            </p>
          </div>

          {/* 期間選択 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              旅の期間を選択
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {GAME_PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`
                    touch-target p-4 rounded-lg border-2 transition-all
                    ${
                      selectedPeriod === period.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {period.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ({period.days}日間)
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 出発空港選択 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              出発地を選択
              {airports.length === 0 && (
                <span className="ml-2 text-sm font-normal text-orange-600">
                  (データ読み込み中...)
                </span>
              )}
            </Label>

            {/* 検索ボックス */}
            <input
              type="text"
              placeholder="空港名、都市名、国名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              disabled={airports.length === 0}
            />

            {/* 空港リスト */}
            <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              {airports.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  空港データを読み込み中...
                </div>
              ) : filteredAirports.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  検索結果が見つかりません
                </div>
              ) : (
                filteredAirports.map((airport) => (
                  <button
                    key={airport.id}
                    onClick={() => setSelectedAirportId(airport.id)}
                    className={`
                      w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                      ${
                        selectedAirportId === airport.id
                          ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500'
                          : ''
                      }
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

          {/* 開始ボタン */}
          <Button
            onClick={handleStart}
            disabled={!selectedAirportId}
            size="lg"
            className="touch-target text-xl font-bold py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            旅を始める
          </Button>

          {selectedPeriodData && selectedAirportId && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              <p>
                {selectedPeriodData.label}の旅に出発します
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
