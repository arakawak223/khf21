'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DESTINATION_COUNTS, BGM_URLS } from '@/lib/game/constants';
import { getBGMManager } from '@/lib/game/bgmManager';
import type { Airport } from '@/types/database.types';

interface GameSetupProps {
  airports: Airport[];
  onStart: (
    destinationCount: number,
    destinationLabel: string,
    startingAirportId: string,
    nickname?: string,
    isMultiplayer?: boolean,
    includeFreeman?: boolean,
    isOnlineMultiplayer?: boolean
  ) => void;
}

// BGM選択肢の情報
const BGM_OPTIONS = [
  { url: BGM_URLS.GAME_START[0], name: 'フィールド音楽', description: '広大な大地を旅するイメージ' },
  { url: BGM_URLS.GAME_START[1], name: 'タウン音楽', description: '街を散策するイメージ' },
  { url: BGM_URLS.GAME_START[2], name: 'ハラッパ音楽', description: '爽やかな冒険のイメージ' },
];

export default function GameSetup({ airports, onStart }: GameSetupProps) {
  const [selectedDestinationCount, setSelectedDestinationCount] = useState('5destinations');
  const [selectedAirportId, setSelectedAirportId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedBGM, setSelectedBGM] = useState(BGM_OPTIONS[0].url);
  const [gameMode, setGameMode] = useState<'single' | 'online'>('single'); // シングル=AI対戦、オンライン=人間対戦

  const handleGuideOpen = () => {
    window.open('/card-guide', '_blank');
  };

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

  const handleStart = () => {
    console.log('=== handleStart called ===');
    console.log('gameMode:', gameMode);
    console.log('selectedAirportId:', selectedAirportId);
    console.log('selectedDestinationData:', selectedDestinationData);
    console.log('selectedBGM:', selectedBGM);

    // 選択されたBGMを保存
    try {
      const bgmManager = getBGMManager();
      bgmManager.setStartBGM(selectedBGM);
      console.log('BGM saved successfully');
    } catch (error) {
      console.error('Error saving BGM:', error);
    }

    if (gameMode === 'online') {
      // オンラインマルチプレイヤーの場合
      console.log('Starting online multiplayer...');
      onStart(0, '', '', nickname.trim() || undefined, true, false, true);
    } else {
      // シングルプレイ（AI対戦）の場合
      if (!selectedAirportId || !selectedDestinationData) {
        console.error('Cannot start: missing airportId or destinationData');
        return;
      }
      console.log('Starting single player (AI battle)...');
      onStart(
        selectedDestinationData.count,
        selectedDestinationData.label,
        selectedAirportId,
        nickname.trim() || undefined,
        true, // isMultiplayer = true (AI対戦)
        true, // includeFreeman = true (Dフリーマンと対戦)
        false // isOnlineMultiplayer = false
      );
    }
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              訪問する目的地の数と出発地を選択してください
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGuideOpen}
              className="text-purple-600 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              🎯 ミッション&カードガイドを見る
            </Button>
          </div>

          {/* ゲームモード選択 */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              🎮 ゲームモード
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGameMode('single')}
                className={`
                  touch-target p-4 rounded-lg border-2 transition-all
                  ${
                    gameMode === 'single'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }
                `}
              >
                <div className="text-center">
                  <p className="text-2xl mb-1">🤖</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    シングルプレイ
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    AI対戦
                  </p>
                </div>
              </button>
              <button
                onClick={() => setGameMode('online')}
                className={`
                  touch-target p-4 rounded-lg border-2 transition-all
                  ${
                    gameMode === 'online'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }
                `}
              >
                <div className="text-center">
                  <p className="text-2xl mb-1">🌐</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    マルチプレイ
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    オンライン対戦
                  </p>
                </div>
              </button>
            </div>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <span className="font-bold">💡 モード説明</span><br />
                {gameMode === 'single' ? (
                  <>・Dフリーマン（AI）との対戦<br />・追い越すとペナルティ、追い越されるとSフリーマン（サポート型）に変化</>
                ) : (
                  <>・他の人間プレイヤーとリアルタイムで対戦<br />・ルームコードで友達を招待できます</>
                )}
              </p>
            </div>
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

          {/* シングルプレイのみ表示する設定 */}
          {gameMode === 'single' && (
            <>
              {/* BGM選択 */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  🎵 ゲーム中のBGMを選択
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {BGM_OPTIONS.map((bgm) => (
                    <button
                      key={bgm.url}
                      onClick={() => setSelectedBGM(bgm.url)}
                      className={`
                        touch-target p-4 rounded-lg border-2 transition-all text-left
                        ${
                          selectedBGM === bgm.url
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                        }
                      `}
                    >
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {bgm.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {bgm.description}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  各シーンに応じて自動的にBGMが切り替わります
                </p>
              </div>

              {/* 目的地数選択 */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  訪問する目的地の数を選択
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {DESTINATION_COUNTS.map((destination) => (
                    <button
                      key={destination.value}
                      onClick={() => setSelectedDestinationCount(destination.value)}
                      className={`
                        touch-target p-4 rounded-lg border-2 transition-all
                        ${
                          selectedDestinationCount === destination.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }
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
            </>
          )}

          {/* 開始ボタン */}
          <Button
            onClick={handleStart}
            disabled={gameMode === 'single' && !selectedAirportId}
            size="lg"
            className="touch-target text-xl font-bold py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {gameMode === 'online' ? 'オンライン対戦を始める' : '旅を始める'}
          </Button>

          {gameMode === 'single' && selectedDestinationData && selectedAirportId && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              <p>
                {selectedDestinationData.label}を訪問する旅に出発します
              </p>
            </div>
          )}

          {gameMode === 'online' && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              <p>
                ルームを作成して友達を招待するか、既存のルームに参加できます
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
