// 移動システムのヘルパー関数

import type { Airport } from '@/types/database.types';

/**
 * 2点間の距離を計算（ハバーサイン公式）
 */
export function calculateDistance(from: Airport, to: Airport): number {
  const R = 6371; // 地球の半径（km）

  // 緯度経度を数値に変換
  const lat1 = typeof from.latitude === 'string' ? parseFloat(from.latitude) : from.latitude;
  const lon1 = typeof from.longitude === 'string' ? parseFloat(from.longitude) : from.longitude;
  const lat2 = typeof to.latitude === 'string' ? parseFloat(to.latitude) : to.latitude;
  const lon2 = typeof to.longitude === 'string' ? parseFloat(to.longitude) : to.longitude;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * 距離から滞在日数を計算
 * ≤5000km: 2日
 * >5000km: 3日
 */
export function calculateStayDays(distanceKm: number): number {
  return distanceKm <= 5000 ? 2 : 3;
}

/**
 * ランダムに次の目的地空港を選択
 * 現在地以外の空港からランダムに選択
 */
export function selectRandomDestination(
  currentAirport: Airport,
  allAirports: Airport[]
): Airport | null {
  // 現在地以外の空港をフィルター
  const availableAirports = allAirports.filter(
    (airport) => airport.id !== currentAirport.id
  );

  if (availableAirports.length === 0) return null;

  // ランダムに選択
  const randomIndex = Math.floor(Math.random() * availableAirports.length);
  return availableAirports[randomIndex];
}

/**
 * ルーレット結果から最大移動距離を計算
 * 1マス = 500km
 */
export function calculateMaxDistance(rouletteResult: number): number {
  return rouletteResult * 500; // 1マス = 500km
}

/**
 * ルーレット結果に基づいて目的地を選択
 * ルーレット結果 × 500km 以内の空港を候補として選択
 */
export function selectDestinationByRouletteResult(
  currentAirport: Airport,
  allAirports: Airport[],
  rouletteResult: number
): Airport | null {
  const maxDistance = calculateMaxDistance(rouletteResult);
  const minDistance = Math.max(0, maxDistance - 500); // 1マス分の許容範囲

  // 距離範囲内の空港をフィルター
  const availableAirports = allAirports.filter((airport) => {
    if (airport.id === currentAirport.id) return false;

    const distance = calculateDistance(currentAirport, airport);
    return distance >= minDistance && distance <= maxDistance;
  });

  if (availableAirports.length === 0) {
    // 範囲内の空港がない場合は、最も近い空港を選択
    console.warn(`No airports found within ${minDistance}-${maxDistance}km range`);
    const nearbyAirports = allAirports
      .filter((a) => a.id !== currentAirport.id)
      .map((airport) => ({
        airport,
        distance: calculateDistance(currentAirport, airport),
      }))
      .sort((a, b) => Math.abs(a.distance - maxDistance) - Math.abs(b.distance - maxDistance));

    return nearbyAirports.length > 0 ? nearbyAirports[0].airport : null;
  }

  // ランダムに選択
  const randomIndex = Math.floor(Math.random() * availableAirports.length);
  return availableAirports[randomIndex];
}

/**
 * 経路上のマス目座標を計算（500kmごと）
 */
export function calculateRouteSpaces(
  from: Airport,
  to: Airport,
  spaceDistance: number = 500
): Array<{ lat: number; lng: number; spaceNumber: number }> {
  const lat1 = typeof from.latitude === 'string' ? parseFloat(from.latitude) : from.latitude;
  const lon1 = typeof from.longitude === 'string' ? parseFloat(from.longitude) : from.longitude;
  const lat2 = typeof to.latitude === 'string' ? parseFloat(to.latitude) : to.latitude;
  const lon2 = typeof to.longitude === 'string' ? parseFloat(to.longitude) : to.longitude;

  const totalDistance = calculateDistance(from, to);
  const numSpaces = Math.ceil(totalDistance / spaceDistance);

  console.log(`=== calculateRouteSpaces ===`);
  console.log(`From: ${from.city} (${lat1}, ${lon1})`);
  console.log(`To: ${to.city} (${lat2}, ${lon2})`);
  console.log(`Total distance: ${totalDistance}km`);
  console.log(`Space distance: ${spaceDistance}km`);
  console.log(`Calculated spaces: ${numSpaces}`);

  const spaces: Array<{ lat: number; lng: number; spaceNumber: number }> = [];

  for (let i = 1; i <= numSpaces; i++) {
    const ratio = i / numSpaces;
    // 線形補間で中間点を計算
    const lat = lat1 + (lat2 - lat1) * ratio;
    const lng = lon1 + (lon2 - lon1) * ratio;

    spaces.push({
      lat,
      lng,
      spaceNumber: i,
    });
  }

  console.log(`Generated ${spaces.length} route spaces`);
  console.log(`=============================`);

  return spaces;
}
