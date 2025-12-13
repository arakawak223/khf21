// ゲームロジック用ユーティリティ関数

/**
 * 移動距離から滞在日数を計算
 * 5000km以下: 2日間
 * 5000km超: 3日間
 */
export function calculateStayDays(distanceKm: number): number {
  if (distanceKm <= 5000) {
    return 2;
  }
  return 3;
}

/**
 * 空港間の距離からマス数を計算（500km = 1マス）
 */
export function calculateAirportSpaces(distanceKm: number): number {
  return Math.ceil(distanceKm / 500);
}

/**
 * 港間の距離からマス数を計算（100km = 1マス）
 */
export function calculatePortSpaces(distanceKm: number): number {
  return Math.ceil(distanceKm / 100);
}

/**
 * ゲーム期間から総日数を取得
 */
export function getPeriodDays(period: string): number {
  const periodMap: { [key: string]: number } = {
    '1week': 7,
    '2weeks': 14,
    '1month': 30,
    '2months': 60,
    '3months': 90,
    '6months': 180,
    '1year': 365,
  };
  return periodMap[period] || 7;
}

/**
 * ゲーム期間の日本語表示
 */
export function getPeriodNameJa(period: string): string {
  const periodMap: { [key: string]: string } = {
    '1week': '1週間',
    '2weeks': '2週間',
    '1month': '1か月',
    '2months': '2か月',
    '3months': '3か月',
    '6months': '6か月',
    '1year': '1年',
  };
  return periodMap[period] || '1週間';
}

/**
 * ルーレットの結果を生成（1-6の乱数）
 */
export function spinRoulette(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * イベント発生確率の判定
 * @param probability 0-100の確率（%）
 */
export function shouldEventOccur(probability: number): boolean {
  return Math.random() * 100 < probability;
}

/**
 * 配列からランダムに要素を選択
 */
export function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 経過日数からゲーム終了判定
 */
export function isGameOver(elapsedDays: number, totalDays: number): boolean {
  return elapsedDays >= totalDays;
}

/**
 * ポイントの合計計算
 */
export function calculateTotalPoints(impressedPoints: number, giverPoints: number): number {
  return impressedPoints + giverPoints;
}

/**
 * 2点間の距離を計算（Haversine公式）
 * @param lat1 緯度1（度）
 * @param lon1 経度1（度）
 * @param lat2 緯度2（度）
 * @param lon2 経度2（度）
 * @returns 距離（km）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 日付をフォーマット
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 経過日数と残り日数を表示用にフォーマット
 */
export function formatGameProgress(elapsedDays: number, totalDays: number): string {
  const remainingDays = totalDays - elapsedDays;
  return `経過: ${elapsedDays}日 / 残り: ${remainingDays}日`;
}
