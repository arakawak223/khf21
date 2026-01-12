'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Attraction, Art, Gourmet } from '@/types/database.types';

type SelectionOption = {
  type: 'attraction' | 'art' | 'gourmet';
  data: Attraction | Art | Gourmet;
};

interface ArrivalSelectionProps {
  cityName: string;
  countryName: string;
  attraction: Attraction | null;
  art: Art | null;
  gourmet: Gourmet | null;
  destinationNumber: number; // 目的地の順番（1, 2, 3...）
  playerName: string; // プレイヤー名
  onSelect: (option: SelectionOption) => void;
  selectedAttractionId?: string | null;
  selectedArtId?: string | null;
  selectedGourmetId?: string | null;
}

export default function ArrivalSelection({
  cityName,
  countryName,
  attraction,
  art,
  gourmet,
  destinationNumber,
  playerName,
  onSelect,
  selectedAttractionId,
  selectedArtId,
  selectedGourmetId,
}: ArrivalSelectionProps) {
  const options: SelectionOption[] = [];

  if (attraction) {
    options.push({ type: 'attraction', data: attraction });
  }
  if (art) {
    options.push({ type: 'art', data: art });
  }
  if (gourmet) {
    options.push({ type: 'gourmet', data: gourmet });
  }

  const getOptionEmoji = (type: string) => {
    switch (type) {
      case 'attraction':
        return '🏛️';
      case 'art':
        return '🎨';
      case 'gourmet':
        return '🍽️';
      default:
        return '✨';
    }
  };

  const getOptionLabel = (type: string) => {
    switch (type) {
      case 'attraction':
        return '名所';
      case 'art':
        return 'アート';
      case 'gourmet':
        return 'グルメ';
      default:
        return '';
    }
  };

  const getOptionColor = (type: string) => {
    switch (type) {
      case 'attraction':
        return 'from-blue-500 to-purple-600';
      case 'art':
        return 'from-pink-500 to-rose-600';
      case 'gourmet':
        return 'from-orange-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPoints = (data: Attraction | Art | Gourmet) => {
    return data.impressed_points || 0;
  };

  const getName = (data: Attraction | Art | Gourmet) => {
    if ('name_ja' in data && data.name_ja) return data.name_ja;
    if ('name' in data) return data.name;
    return '不明';
  };

  const getDescription = (data: Attraction | Art | Gourmet) => {
    if ('description' in data && data.description) {
      // 最初の100文字まで表示
      return data.description.length > 100
        ? data.description.substring(0, 100) + '...'
        : data.description;
    }
    return '';
  };

  const isOptionSelected = (option: SelectionOption): boolean => {
    switch (option.type) {
      case 'attraction':
        return selectedAttractionId === option.data.id;
      case 'art':
        return selectedArtId === option.data.id;
      case 'gourmet':
        return selectedGourmetId === option.data.id;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* お祝いメッセージ */}
          <div className="text-center space-y-4">
            <div className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-2">
              🎯 目的地{destinationNumber}
            </div>
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {playerName} が到着！
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {cityName}, {countryName}
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                この街での体験を1つ選んでください
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                選んだ体験に応じて感動ポイントを獲得できます
              </p>
            </div>
          </div>

          {/* 選択肢 */}
          <div className="space-y-4">
            {options.map((option, index) => {
              const isSelected = isOptionSelected(option);
              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 opacity-60'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-4xl ${isSelected ? 'grayscale' : ''}`}>
                          {getOptionEmoji(option.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 bg-gradient-to-r ${getOptionColor(option.type)} text-white rounded text-xs font-bold ${isSelected ? 'opacity-50' : ''}`}>
                              {getOptionLabel(option.type)}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
                                選択済み
                              </span>
                            )}
                          </div>
                          <h3 className={`text-lg font-bold mt-1 ${isSelected ? 'text-gray-500 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>
                            {getName(option.data)}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${isSelected ? 'text-gray-400 dark:text-gray-600' : 'text-purple-600 dark:text-purple-400'}`}>
                          +{getPoints(option.data)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          感動ポイント
                        </div>
                      </div>
                    </div>

                    {/* 説明文 */}
                    {getDescription(option.data) && (
                      <p className={`text-sm line-clamp-2 ${isSelected ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {getDescription(option.data)}
                      </p>
                    )}

                    {/* 選択ボタン */}
                    <Button
                      onClick={() => onSelect(option)}
                      disabled={isSelected}
                      className={`w-full ${
                        isSelected
                          ? 'bg-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${getOptionColor(option.type)} hover:opacity-90`
                      }`}
                      size="lg"
                    >
                      {isSelected ? (
                        <>🚫 先行到達者が選択済み</>
                      ) : (
                        <>{getOptionEmoji(option.type)} {getOptionLabel(option.type)}を体験する</>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 選択肢がない場合 */}
          {options.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                この街には体験できる場所がありません
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
