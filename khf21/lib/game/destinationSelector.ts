// 目的地3択システムのロジック

import type { Airport } from '@/types/database.types';
import type { GamePlayer } from '@/types/multiplayer.types';
import type { DestinationCandidate, DestinationSpecialEffect, AirportGroup, GroupColor, AirportCharacteristics, RouteEffects, SeasonBonus } from '@/types/strategy.types';

// ===============================
// 空港特性評価システム
// ===============================

// 人気都市リスト（大都市、観光地）
const POPULAR_CITIES = [
  'tokyo', 'new york', 'london', 'paris', 'dubai', 'singapore', 'hong kong',
  'los angeles', 'bangkok', 'istanbul', 'rome', 'barcelona', 'amsterdam',
  'seoul', 'sydney', 'san francisco', 'las vegas', 'miami', 'toronto',
  'kuala lumpur', 'taipei', 'osaka', 'shanghai', 'beijing', 'delhi', 'mumbai'
];

// 冒険的な目的地（山岳、ジャングル、極地、砂漠など）
const ADVENTURE_KEYWORDS = [
  'mountain', 'jungle', 'desert', 'arctic', 'antarctic', 'peak', 'everest',
  'kilimanjaro', 'patagonia', 'amazon', 'sahara', 'kathmandu', 'cusco',
  'reykjavik', 'ushuaia', 'anchorage', 'fairbanks', 'queenstown', 'interlaken',
  'chamonix', 'zermatt', 'nepal', 'peru', 'chile', 'bolivia', 'tibet',
  'mongolia', 'iceland', 'greenland', 'alaska', 'yukon', 'norway', 'safari'
];

// 文化・歴史都市（世界遺産、美術館都市）
const CULTURAL_CITIES = [
  'rome', 'athens', 'cairo', 'jerusalem', 'kyoto', 'florence', 'venice',
  'prague', 'vienna', 'budapest', 'st petersburg', 'istanbul', 'agra',
  'delhi', 'varanasi', 'angkor', 'siem reap', 'luang prabang', 'barcelona',
  'madrid', 'lisbon', 'edinburgh', 'dublin', 'krakow', 'dubrovnik', 'santorini',
  'mexico city', 'cusco', 'machu picchu', 'petra', 'marrakech', 'fez',
  'tunis', 'damascus', 'baghdad', 'tehran', 'persepolis', 'samarkand'
];

// リゾート地（ビーチ、温泉、リラックス）
const RESORT_KEYWORDS = [
  'beach', 'resort', 'island', 'bali', 'maldives', 'seychelles', 'fiji',
  'tahiti', 'hawaii', 'caribbean', 'cancun', 'phuket', 'boracay', 'santorini',
  'mykonos', 'ibiza', 'mauritius', 'bora bora', 'palau', 'guam', 'saipan',
  'spa', 'hot spring', 'onsen', 'aruba', 'bahamas', 'barbados', 'costa rica',
  'turks', 'caicos', 'virgin', 'st lucia', 'antigua', 'grenada', 'dominica',
  // 追加のリゾート地11箇所
  'zanzibar', 'lombok', 'langkawi', 'koh samui', 'goa', 'belize',
  'french polynesia', 'new caledonia', 'cook islands', 'vanuatu', 'samoa'
];

// 空港の特性を評価する関数
function evaluateAirportCharacteristics(airport: Airport): AirportCharacteristics {
  const cityLower = (airport.city || '').toLowerCase();
  const nameLower = (airport.name || '').toLowerCase();
  const countryLower = (airport.country || '').toLowerCase();
  const searchText = `${cityLower} ${nameLower} ${countryLower}`;

  let popularity = 30; // ベース値
  let adventureLevel = 20; // ベース値
  let culturalValue = 30; // ベース値
  let resortLevel = 35; // ベース値（20→35に増加で緑グループを拡大）

  // 人気度の評価
  if (POPULAR_CITIES.some(city => searchText.includes(city))) {
    popularity = 90;
  } else if (cityLower.length > 0) {
    // 中規模都市
    popularity = 50;
  }

  // 冒険度の評価
  if (ADVENTURE_KEYWORDS.some(keyword => searchText.includes(keyword))) {
    adventureLevel = 85;
  }

  // 文化価値の評価
  if (CULTURAL_CITIES.some(city => searchText.includes(city))) {
    culturalValue = 90;
  }

  // リゾート度の評価
  if (RESORT_KEYWORDS.some(keyword => searchText.includes(keyword))) {
    resortLevel = 90; // 85 → 90 に増加
  }

  // 緯度に基づく調整（極地は冒険度UP、低緯度はリゾート度UP）
  const lat = Math.abs(getCoordinate(airport.latitude));
  if (lat > 60) {
    // 極地（北極圏・南極圏）
    adventureLevel = Math.min(100, adventureLevel + 20);
    resortLevel = Math.max(10, resortLevel - 20);
  } else if (lat < 23.5) {
    // 熱帯地域（赤道〜回帰線）: 最大ボーナス
    resortLevel = Math.min(100, resortLevel + 30);
  } else if (lat < 35) {
    // 亜熱帯地域: 大きなボーナス
    resortLevel = Math.min(100, resortLevel + 20);
  } else if (lat < 50) {
    // 温帖地域: 小さなボーナス
    resortLevel = Math.min(100, resortLevel + 10);
  }

  return {
    airportId: airport.id,
    popularity,
    adventureLevel,
    culturalValue,
    resortLevel,
  };
}

// 現在の季節を取得（北半球基準）
function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// 2点間の距離を計算（Haversine公式）
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 緯度経度を数値として取得
function getCoordinate(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// 報酬レベルを距離に基づいて計算
function calculateRewardLevel(distance: number): 1 | 2 | 3 | 4 | 5 {
  if (distance < 2000) return 1;
  if (distance < 5000) return 2;
  if (distance < 8000) return 3;
  if (distance < 12000) return 4;
  return 5;
}

// 移動日数を推定
function estimateTravelDays(distance: number): number {
  // 500kmごとに1日と仮定
  return Math.ceil(distance / 500);
}

// 特殊効果をランダムに生成（10%の確率）
function generateSpecialEffect(): DestinationSpecialEffect | undefined {
  const roll = Math.random();

  if (roll < 0.1) { // 10%の確率
    const effects: DestinationSpecialEffect[] = [
      {
        type: 'double_points',
        description: '到着時のポイントが2倍！',
        icon: '💎',
      },
      {
        type: 'card_bonus',
        description: 'カードを追加で1枚入手',
        icon: '🎴',
      },
      {
        type: 'mission_boost',
        description: 'ミッション進捗が2倍',
        icon: '⭐',
      },
      {
        type: 'safe_zone',
        description: '攻撃カード無効エリア',
        icon: '🛡️',
      },
      {
        type: 'danger_zone',
        description: 'トラブル発生率UP、でもポイント1.5倍',
        icon: '⚠️',
      },
    ];

    return effects[Math.floor(Math.random() * effects.length)];
  }

  return undefined;
}

// 他プレイヤーとの競合度を計算
function calculateCompetitionLevel(
  targetAirport: Airport,
  players: GamePlayer[],
  currentPlayerId: string
): 'low' | 'medium' | 'high' {
  // 他プレイヤーの目的地または現在地との距離を計算
  const targetLat = getCoordinate(targetAirport.latitude);
  const targetLng = getCoordinate(targetAirport.longitude);

  let nearbyCount = 0;

  players.forEach(player => {
    if (player.id === currentPlayerId) return;

    // プレイヤーの現在地を取得（簡易版）
    // 実際には route_spaces から位置を計算する必要がある
    const playerSpace = player.route_spaces?.[player.current_space_number - 1];
    if (playerSpace) {
      const distance = calculateDistance(
        targetLat,
        targetLng,
        playerSpace.lat,
        playerSpace.lng
      );

      // 3000km以内に他プレイヤーがいる場合
      if (distance < 3000) {
        nearbyCount++;
      }
    }
  });

  if (nearbyCount >= 2) return 'high';
  if (nearbyCount === 1) return 'medium';
  return 'low';
}

// 目的地候補を3つ生成
export function generateDestinationCandidates(
  currentAirport: Airport,
  allAirports: Airport[],
  visitedAirportCodes: string[],
  players: GamePlayer[],
  currentPlayerId: string,
  occupiedCities: Map<string, { playerId: string; level: number }>
): DestinationCandidate[] {
  const currentLat = getCoordinate(currentAirport.latitude);
  const currentLng = getCoordinate(currentAirport.longitude);

  // 訪問済みと現在地を除外
  const availableAirports = allAirports.filter(
    airport =>
      airport.code !== currentAirport.code &&
      !visitedAirportCodes.includes(airport.code)
  );

  if (availableAirports.length < 3) {
    console.warn('利用可能な空港が3つ未満です');
  }

  // 距離を計算してソート
  const airportsWithDistance = availableAirports.map(airport => {
    const distance = calculateDistance(
      currentLat,
      currentLng,
      getCoordinate(airport.latitude),
      getCoordinate(airport.longitude)
    );
    return { airport, distance };
  });

  // バランスよく選ぶ: 近距離1, 中距離1, 遠距離1
  airportsWithDistance.sort((a, b) => a.distance - b.distance);

  // 近距離: 1500km以上5000km未満（短すぎる距離を避ける）
  // 中距離: 5000km以上10000km未満
  // 遠距離: 10000km以上
  const nearRange = airportsWithDistance.filter(a => a.distance >= 1500 && a.distance < 5000);
  const midRange = airportsWithDistance.filter(a => a.distance >= 5000 && a.distance < 10000);
  const farRange = airportsWithDistance.filter(a => a.distance >= 10000);

  const selected: typeof airportsWithDistance = [];

  // 近距離から1つ
  if (nearRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(nearRange.length, 5));
    selected.push(nearRange[randomIndex]);
  }

  // 中距離から1つ
  if (midRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(midRange.length, 5));
    selected.push(midRange[randomIndex]);
  }

  // 遠距離から1つ
  if (farRange.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(farRange.length, 5));
    selected.push(farRange[randomIndex]);
  }

  // 3つに満たない場合は適当に追加
  while (selected.length < 3 && selected.length < airportsWithDistance.length) {
    const randomIndex = Math.floor(Math.random() * airportsWithDistance.length);
    const candidate = airportsWithDistance[randomIndex];
    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }

  // DestinationCandidate に変換
  return selected.map(({ airport, distance }) => {
    const rewardLevel = calculateRewardLevel(distance);
    const estimatedDays = estimateTravelDays(distance);
    const specialEffect = generateSpecialEffect();
    const competitionLevel = calculateCompetitionLevel(airport, players, currentPlayerId);

    const occupation = occupiedCities.get(airport.id);

    // 航空会社・便名を簡易的に割り当て（もじった名前）
    const { airlineName, airlineCode, flightNumber } = assignAirlineInfo(currentAirport, airport);

    return {
      airport,
      distance: Math.round(distance),
      estimatedDays,
      rewardLevel,
      specialEffect,
      competitionLevel,
      isOccupied: !!occupation,
      occupiedBy: occupation?.playerId,
      airlineName,
      airlineCode,
      flightNumber,
    };
  });
}

// 航空会社・便名を割り当てる関数（もじった名前）
function assignAirlineInfo(
  origin: Airport,
  destination: Airport
): { airlineName: string; airlineCode: string; flightNumber: string } {
  // 航空会社リスト（もじった名前）
  const airlines = [
    { name: '日空航空', code: 'JAL', country: 'Japan', nameEn: 'Japan Air Sky' },
    { name: '全日輸送', code: 'ANA', country: 'Japan', nameEn: 'All Nippon Transport' },
    { name: 'ユナイテッドエア', code: 'UAL', country: 'USA', nameEn: 'United Air' },
    { name: 'アメリカンエア', code: 'AAL', country: 'USA', nameEn: 'American Air' },
    { name: 'ブリティッシュウイングス', code: 'BAW', country: 'UK', nameEn: 'British Wings' },
    { name: 'フランスエア', code: 'AFR', country: 'France', nameEn: 'France Air' },
    { name: 'ジャーマンウイングス', code: 'DLH', country: 'Germany', nameEn: 'German Wings' },
    { name: 'ライオンエア', code: 'SIA', country: 'Singapore', nameEn: 'Lion Air' },
    { name: 'エミレーツエア', code: 'EK', country: 'UAE', nameEn: 'Emirates Air' },
    { name: 'オージーウイングス', code: 'QFA', country: 'Australia', nameEn: 'Aussie Wings' },
  ];

  // 出発地または目的地の国に基づいて航空会社を選択
  let selectedAirline = airlines[Math.floor(Math.random() * airlines.length)];

  // 日本発の場合はJAL/ANAを優先
  if (origin.country === 'Japan' || destination.country === 'Japan') {
    const japaneseAirlines = airlines.filter(a => a.country === 'Japan');
    if (Math.random() > 0.3) {
      selectedAirline = japaneseAirlines[Math.floor(Math.random() * japaneseAirlines.length)];
    }
  }
  // アメリカ発着の場合はUAL/AALを優先
  else if (origin.country === 'USA' || destination.country === 'USA') {
    const usAirlines = airlines.filter(a => a.country === 'USA');
    if (Math.random() > 0.4) {
      selectedAirline = usAirlines[Math.floor(Math.random() * usAirlines.length)];
    }
  }
  // ヨーロッパ発着の場合はヨーロッパ系を優先
  else if (['UK', 'France', 'Germany'].includes(origin.country) || ['UK', 'France', 'Germany'].includes(destination.country)) {
    const europeanAirlines = airlines.filter(a => ['UK', 'France', 'Germany'].includes(a.country));
    if (Math.random() > 0.4 && europeanAirlines.length > 0) {
      selectedAirline = europeanAirlines[Math.floor(Math.random() * europeanAirlines.length)];
    }
  }

  // 便名を生成（航空会社コード + ランダムな数字）
  const flightNumber = selectedAirline.code + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');

  return {
    airlineName: selectedAirline.name,
    airlineCode: selectedAirline.code,
    flightNumber,
  };
}

// AIがランダムに選択権を持つプレイヤーを決定
export function selectRandomChooser(players: GamePlayer[]): GamePlayer {
  const humanPlayers = players.filter(p => p.player_type === 'human');

  // 人間プレイヤーが複数いる場合はその中から、いなければ全プレイヤーから
  const eligiblePlayers = humanPlayers.length > 0 ? humanPlayers : players;

  const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
  return eligiblePlayers[randomIndex];
}

// 目的地選択の基準をスコア化（AI用）
export function scoreDestination(candidate: DestinationCandidate): number {
  let score = 0;

  // 報酬レベルに応じてスコア
  score += candidate.rewardLevel * 100;

  // 特殊効果があれば加点
  if (candidate.specialEffect) {
    score += 150;
  }

  // 競合度によるスコア調整
  if (candidate.competitionLevel === 'low') {
    score += 50; // 競争が少ないほうが安全
  } else if (candidate.competitionLevel === 'high') {
    score -= 30; // 競争が激しいのはリスク
  }

  // 占有されている場合は減点
  if (candidate.isOccupied) {
    score -= 100;
  }

  // 距離に応じた調整（遠すぎると減点）
  if (candidate.distance > 15000) {
    score -= 50;
  }

  return score;
}

// 戦略的グループ分け（競合度 × 観光スタイル × 季節）
export function generateRandomGroups(
  allAirports: Airport[],
  currentAirportId: string,
  visitedAirportIds: string[],
  players?: GamePlayer[],
  currentPlayerId?: string,
  occupiedCities?: Map<string, { playerId: string; level: number }>
): AirportGroup[] {
  // 現在地の空港を取得
  const currentAirport = allAirports.find(a => a.id === currentAirportId);
  if (!currentAirport) {
    console.error('現在地の空港が見つかりません');
    return generateFallbackGroups(allAirports, currentAirportId, visitedAirportIds);
  }

  const currentLat = getCoordinate(currentAirport.latitude);
  const currentLng = getCoordinate(currentAirport.longitude);

  // 訪問済みと現在地を除外
  let availableAirports = allAirports.filter(
    airport =>
      airport.id !== currentAirportId &&
      !visitedAirportIds.includes(airport.id)
  );

  // 全空港訪問済みの場合は現在地以外を許可
  if (availableAirports.length === 0) {
    console.warn('全空港訪問済み - 再訪問を許可');
    availableAirports = allAirports.filter(airport => airport.id !== currentAirportId);
  }

  // 各空港の特性を評価
  const airportsWithCharacteristics = availableAirports.map(airport => {
    const distance = calculateDistance(
      currentLat,
      currentLng,
      getCoordinate(airport.latitude),
      getCoordinate(airport.longitude)
    );
    const characteristics = evaluateAirportCharacteristics(airport);

    // 競合度を計算
    let competitionScore = characteristics.popularity;
    if (occupiedCities?.has(airport.id)) {
      competitionScore += 20; // 占有されている都市は競合度UP
    }
    if (players && currentPlayerId) {
      // 他プレイヤーとの距離で競合度を調整
      const nearbyPlayers = players.filter(p => {
        if (p.id === currentPlayerId) return false;
        const playerSpace = p.route_spaces?.[p.current_space_number - 1];
        if (!playerSpace) return false;
        const distToPlayer = calculateDistance(
          getCoordinate(airport.latitude),
          getCoordinate(airport.longitude),
          playerSpace.lat,
          playerSpace.lng
        );
        return distToPlayer < 3000;
      }).length;
      competitionScore += nearbyPlayers * 15;
    }

    return {
      airport,
      distance,
      characteristics,
      competitionScore: Math.min(100, competitionScore),
    };
  });

  // 3つのグループに分類
  const adventurerGroup: typeof airportsWithCharacteristics = [];
  const culturalGroup: typeof airportsWithCharacteristics = [];
  const explorerGroup: typeof airportsWithCharacteristics = [];

  airportsWithCharacteristics.forEach(item => {
    const { characteristics, competitionScore } = item;

    // スコアリング（メリハリ強化版）
    // 赤（冒険者）: 冒険度を重視、競争と人気も加味
    const adventurerScore = (characteristics.adventureLevel * 0.6) + (competitionScore * 0.25) + (characteristics.popularity * 0.15);

    // 青（文化人）: 文化価値を最重視、人気度も重要
    const culturalScore = (characteristics.culturalValue * 0.65) + (characteristics.popularity * 0.25) + (competitionScore * 0.1);

    // 緑（探求者）: リゾート度を最重視、穴場（低競争・低人気）を好む
    const explorerScore = (characteristics.resortLevel * 0.7) + ((100 - competitionScore) * 0.2) + ((100 - characteristics.popularity) * 0.1);

    // 最も高いスコアのグループに振り分け
    const maxScore = Math.max(adventurerScore, culturalScore, explorerScore);

    if (maxScore === adventurerScore) {
      adventurerGroup.push(item);
    } else if (maxScore === culturalScore) {
      culturalGroup.push(item);
    } else {
      explorerGroup.push(item);
    }
  });

  // グループが偏りすぎた場合の調整
  const totalCount = airportsWithCharacteristics.length;
  const minGroupSize = Math.floor(totalCount * 0.2); // 最低20%

  // 小さすぎるグループを調整
  if (adventurerGroup.length < minGroupSize && totalCount > 6) {
    const needed = minGroupSize - adventurerGroup.length;
    const largest = [culturalGroup, explorerGroup].sort((a, b) => b.length - a.length)[0];
    adventurerGroup.push(...largest.splice(0, needed));
  }
  if (culturalGroup.length < minGroupSize && totalCount > 6) {
    const needed = minGroupSize - culturalGroup.length;
    const largest = [adventurerGroup, explorerGroup].sort((a, b) => b.length - a.length)[0];
    culturalGroup.push(...largest.splice(0, needed));
  }
  if (explorerGroup.length < minGroupSize && totalCount > 6) {
    const needed = minGroupSize - explorerGroup.length;
    const largest = [adventurerGroup, culturalGroup].sort((a, b) => b.length - a.length)[0];
    explorerGroup.push(...largest.splice(0, needed));
  }

  // 季節ボーナスを計算
  const currentSeason = getCurrentSeason();

  const adventurerSeasonBonus: SeasonBonus = {
    season: currentSeason,
    bonusDescription: currentSeason === 'summer' ? '☀️ 夏の冒険シーズン！ボーナス+20%' : '',
    bonusMultiplier: currentSeason === 'summer' ? 1.2 : 1.0,
  };

  const culturalSeasonBonus: SeasonBonus = {
    season: currentSeason,
    bonusDescription: (currentSeason === 'spring' || currentSeason === 'autumn') ? '🍂 文化祭シーズン！ボーナス+20%' : '',
    bonusMultiplier: (currentSeason === 'spring' || currentSeason === 'autumn') ? 1.2 : 1.0,
  };

  const explorerSeasonBonus: SeasonBonus = {
    season: currentSeason,
    bonusDescription: currentSeason === 'winter' ? '❄️ 冬の穴場シーズン！ボーナス+20%' : '',
    bonusMultiplier: currentSeason === 'winter' ? 1.2 : 1.0,
  };

  // ルート効果を定義
  const adventurerEffects: RouteEffects = {
    firstArrivalBonus: 30,
    specialCardRate: 2.0,
    rareCardRate: 1.0,
    troubleRateModifier: 15,
    impressedPointsModifier: 0,
    eventRates: {
      discovery: 20,
      attraction: 10,
    },
    exclusiveCards: ['adventure_instinct', 'pioneer_pride'],
  };

  const culturalEffects: RouteEffects = {
    firstArrivalBonus: 0,
    specialCardRate: 1.0,
    rareCardRate: 1.0,
    troubleRateModifier: 0,
    impressedPointsModifier: 25,
    eventRates: {
      art: 30,
      star: 20,
      attraction: 15,
    },
    exclusiveCards: ['artist_sensitivity', 'historian_knowledge'],
  };

  const explorerEffects: RouteEffects = {
    firstArrivalBonus: 20,
    specialCardRate: 1.0,
    rareCardRate: 1.15,
    troubleRateModifier: -10,
    impressedPointsModifier: 0,
    eventRates: {
      gourmet: 30,
    },
    exclusiveCards: ['explorer_intuition', 'healing_spa'],
  };

  const groups: AirportGroup[] = [
    {
      color: 'red' as GroupColor,
      colorName: '冒険者ルート',
      emoji: '🔴',
      description: 'リスクを取って栄光を掴め！',
      airports: adventurerGroup.map(a => a.airport),
      count: adventurerGroup.length,
      seasonBonus: adventurerSeasonBonus,
      effects: adventurerEffects,
    },
    {
      color: 'blue' as GroupColor,
      colorName: '文化人ルート',
      emoji: '🔵',
      description: '知性と教養で着実に',
      airports: culturalGroup.map(a => a.airport),
      count: culturalGroup.length,
      seasonBonus: culturalSeasonBonus,
      effects: culturalEffects,
    },
    {
      color: 'green' as GroupColor,
      colorName: '探求者ルート',
      emoji: '🟢',
      description: '秘境で心と体を癒す',
      airports: explorerGroup.map(a => a.airport),
      count: explorerGroup.length,
      seasonBonus: explorerSeasonBonus,
      effects: explorerEffects,
    },
  ];

  console.log(
    `戦略的グループ生成: ${groups.map(g => `${g.emoji} ${g.colorName} ${g.count}空港`).join(', ')}`
  );

  return groups;
}

// フォールバック用のランダムグループ生成
function generateFallbackGroups(
  allAirports: Airport[],
  currentAirportId: string,
  visitedAirportIds: string[]
): AirportGroup[] {
  let availableAirports = allAirports.filter(
    airport =>
      airport.id !== currentAirportId &&
      !visitedAirportIds.includes(airport.id)
  );

  if (availableAirports.length === 0) {
    availableAirports = allAirports.filter(airport => airport.id !== currentAirportId);
  }

  // Fisher-Yatesアルゴリズムでシャッフル
  const shuffled = [...availableAirports];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const totalCount = shuffled.length;
  const baseSize = Math.floor(totalCount / 3);
  const remainder = totalCount % 3;

  const group1Size = baseSize + (remainder > 0 ? 1 : 0);
  const group2Size = baseSize + (remainder > 1 ? 1 : 0);
  const group3Size = baseSize;

  const currentSeason = getCurrentSeason();

  return [
    {
      color: 'red' as GroupColor,
      colorName: '冒険者ルート',
      emoji: '🔴',
      description: 'リスクを取って栄光を掴め！',
      airports: shuffled.slice(0, group1Size),
      count: group1Size,
      seasonBonus: {
        season: currentSeason,
        bonusDescription: currentSeason === 'summer' ? '☀️ 夏の冒険シーズン！' : '',
        bonusMultiplier: currentSeason === 'summer' ? 1.2 : 1.0,
      },
    },
    {
      color: 'blue' as GroupColor,
      colorName: '文化人ルート',
      emoji: '🔵',
      description: '知性と教養で着実に',
      airports: shuffled.slice(group1Size, group1Size + group2Size),
      count: group2Size,
      seasonBonus: {
        season: currentSeason,
        bonusDescription: (currentSeason === 'spring' || currentSeason === 'autumn') ? '🍂 文化祭シーズン！' : '',
        bonusMultiplier: (currentSeason === 'spring' || currentSeason === 'autumn') ? 1.2 : 1.0,
      },
    },
    {
      color: 'green' as GroupColor,
      colorName: '探求者ルート',
      emoji: '🟢',
      description: '秘境で心と体を癒す',
      airports: shuffled.slice(group1Size + group2Size),
      count: group3Size,
      seasonBonus: {
        season: currentSeason,
        bonusDescription: currentSeason === 'winter' ? '❄️ 冬の穴場シーズン！' : '',
        bonusMultiplier: currentSeason === 'winter' ? 1.2 : 1.0,
      },
    },
  ];
}
