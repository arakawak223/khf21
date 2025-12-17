"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Airport } from "@/types/database.types";

interface WorldMapProps {
  currentAirport: Airport;
  destinationAirport?: Airport;
  visitedAirports?: string[]; // airport codes
  showRoute?: boolean;
  playerNickname?: string;
  playerColor?: string; // 'red', 'blue', 'green', 'yellow', 'purple', 'orange'
  routeSpaces?: Array<{ lat: number; lng: number; spaceNumber: number }>;
  currentSpace?: number; // 現在のマス位置（1から始まる）
}

// Leaflet components loaded dynamically (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export default function WorldMap({
  currentAirport,
  destinationAirport,
  showRoute = false,
  playerNickname = 'プレイヤー1',
  playerColor = 'red',
  routeSpaces = [],
  currentSpace = 0,
}: WorldMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [planeIcon, setPlaneIcon] = useState<any>(null);

  // 緯度経度を数値として安全に取得（Supabaseは文字列で返すことがある）
  const getCoordinate = (value: any): number => {
    if (value === null || value === undefined) return 0;

    // 数値の場合はそのまま返す
    if (typeof value === 'number') return value;

    // 文字列の場合はparseFloatで変換
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  // プレイヤーカラーマッピング（メモ化して再生成を防ぐ）
  const colors = useMemo(() => {
    const colorMap: Record<string, { primary: string; shadow: string; glow: string }> = {
      red: { primary: '#ef4444', shadow: '#991b1b', glow: '#fca5a5' },
      blue: { primary: '#3b82f6', shadow: '#1e3a8a', glow: '#93c5fd' },
      green: { primary: '#22c55e', shadow: '#15803d', glow: '#86efac' },
      yellow: { primary: '#eab308', shadow: '#854d0e', glow: '#fde047' },
      purple: { primary: '#a855f7', shadow: '#6b21a8', glow: '#d8b4fe' },
      orange: { primary: '#f97316', shadow: '#9a3412', glow: '#fdba74' },
    };
    return colorMap[playerColor] || colorMap.red;
  }, [playerColor]);

  // 進行方向の角度を計算
  const rotation = useMemo(() => {
    if (!destinationAirport) return 0;

    const currentLat = getCoordinate(currentAirport.latitude);
    const currentLng = getCoordinate(currentAirport.longitude);
    const destLat = getCoordinate(destinationAirport.latitude);
    const destLng = getCoordinate(destinationAirport.longitude);

    // 方位角を計算（北を0度、時計回り）
    const dLng = destLng - currentLng;
    const dLat = destLat - currentLat;
    const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    return angle;
  }, [currentAirport, destinationAirport]);

  useEffect(() => {
    setIsClient(true);
    // 飛行機アイコンを作成
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const planeRotation = destinationAirport ? rotation : 45;
        const icon = L.divIcon({
          html: `
            <div style="transform: rotate(${planeRotation}deg); filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));">
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <!-- グロー効果 -->
                <circle cx="20" cy="20" r="18" fill="${colors.glow}" opacity="0.3"/>
                <!-- 飛行機本体 -->
                <g transform="translate(20, 20)">
                  <!-- 機体 -->
                  <ellipse cx="0" cy="0" rx="3" ry="8" fill="${colors.primary}" stroke="${colors.shadow}" stroke-width="1"/>
                  <!-- 主翼 -->
                  <rect x="-12" y="-2" width="24" height="4" rx="2" fill="${colors.primary}" stroke="${colors.shadow}" stroke-width="1"/>
                  <!-- 尾翼 -->
                  <polygon points="-4,6 0,10 4,6" fill="${colors.primary}" stroke="${colors.shadow}" stroke-width="1"/>
                  <!-- コックピット -->
                  <circle cx="0" cy="-5" r="2.5" fill="white" opacity="0.8"/>
                </g>
              </svg>
            </div>
          `,
          className: "plane-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
        setPlaneIcon(icon);
      });
    }
  }, [rotation, destinationAirport, colors]);

  const currentLat = getCoordinate(currentAirport.latitude);
  const currentLng = getCoordinate(currentAirport.longitude);

  // プレイヤーの実際の位置を計算（移動中は経路上のマスに表示）
  const playerPosition = useMemo(() => {
    // 移動中で、ルートが存在する場合
    if (currentSpace > 0 && routeSpaces.length > 0) {
      // 目的地に到達している場合
      if (currentSpace >= routeSpaces.length && destinationAirport) {
        return {
          lat: getCoordinate(destinationAirport.latitude),
          lng: getCoordinate(destinationAirport.longitude),
        };
      }
      // まだ移動中の場合は、現在のマス位置
      const spaceIndex = Math.min(currentSpace, routeSpaces.length) - 1;
      if (spaceIndex >= 0 && routeSpaces[spaceIndex]) {
        return {
          lat: routeSpaces[spaceIndex].lat,
          lng: routeSpaces[spaceIndex].lng,
        };
      }
    }
    // それ以外は出発地
    return {
      lat: currentLat,
      lng: currentLng,
    };
  }, [currentSpace, routeSpaces, currentLat, currentLng, destinationAirport]);

  // デバッグログ（コンソールで確認）
  useEffect(() => {
    console.log('=== 地図デバッグ情報 ===');
    console.log(`空港: ${currentAirport.code} - ${currentAirport.city}`);
    console.log(`データベース値: lat=${currentAirport.latitude}, lng=${currentAirport.longitude}`);
    console.log(`データ型: lat=${typeof currentAirport.latitude}, lng=${typeof currentAirport.longitude}`);
    console.log(`変換後: lat=${currentLat}, lng=${currentLng}`);
    console.log(`目的地: ${destinationAirport ? destinationAirport.city : 'なし'}`);
    console.log(`ルート表示: ${showRoute}`);
    console.log(`マス目数: ${routeSpaces.length}`);
    console.log(`現在のマス: ${currentSpace}`);
    console.log(`プレイヤー位置: lat=${playerPosition.lat}, lng=${playerPosition.lng}`);
  }, [currentAirport, currentLat, currentLng, destinationAirport, showRoute, routeSpaces, currentSpace, playerPosition]);

  // ルートライン（現在地から目的地）
  const routeLine = useMemo(() => {
    if (!showRoute || !destinationAirport) return null;

    const destLat = getCoordinate(destinationAirport.latitude);
    const destLng = getCoordinate(destinationAirport.longitude);

    return [
      [currentLat, currentLng] as [number, number],
      [destLat, destLng] as [number, number],
    ];
  }, [showRoute, currentLat, currentLng, destinationAirport]);

  // マップの中心とズームを計算（経路全体が表示されるように）
  const mapCenterAndZoom = useMemo(() => {
    if (destinationAirport && showRoute) {
      const destLat = getCoordinate(destinationAirport.latitude);
      const destLng = getCoordinate(destinationAirport.longitude);

      // 経路の中心点を計算
      const centerLat = (currentLat + destLat) / 2;
      const centerLng = (currentLng + destLng) / 2;

      // 距離に応じてズームレベルを調整
      const latDiff = Math.abs(currentLat - destLat);
      const lngDiff = Math.abs(currentLng - destLng);
      const maxDiff = Math.max(latDiff, lngDiff);

      let zoom = 5; // デフォルト
      if (maxDiff < 5) zoom = 6;
      else if (maxDiff < 10) zoom = 5;
      else if (maxDiff < 20) zoom = 4;
      else if (maxDiff < 40) zoom = 3;
      else zoom = 2;

      return { center: [centerLat, centerLng] as [number, number], zoom };
    }

    // 目的地がない場合は現在地中心
    return { center: [currentLat, currentLng] as [number, number], zoom: 4 };
  }, [currentLat, currentLng, destinationAirport, showRoute]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-[#1a365d] to-[#0f2744] flex items-center justify-center">
        <div className="text-white text-lg">地図を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '400px' }}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .plane-marker {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          background: #1a365d;
        }
        @keyframes pulse-destination {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
        .destination-pulse {
          animation: pulse-destination 2s ease-in-out infinite;
        }
      `}</style>

      {/* 凡例 */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg p-2.5 shadow-lg text-[10px]">
        <p className="font-bold mb-1.5 text-gray-800">凡例</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(20, 20) rotate(45)">
                  <ellipse cx="0" cy="0" rx="3" ry="8" fill={colors.primary} stroke={colors.shadow} strokeWidth="1"/>
                  <rect x="-12" y="-2" width="24" height="4" rx="2" fill={colors.primary} stroke={colors.shadow} strokeWidth="1"/>
                  <polygon points="-4,6 0,10 4,6" fill={colors.primary} stroke={colors.shadow} strokeWidth="1"/>
                  <circle cx="0" cy="-5" r="2.5" fill="white" opacity="0.8"/>
                </g>
              </svg>
            </div>
            <span>現在地 ({playerNickname})</span>
          </div>
          {destinationAirport && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-amber-600 shadow"></span>
              <span>目的地</span>
            </div>
          )}
        </div>
      </div>

      {/* 操作説明 */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 shadow-lg text-[10px]">
        <p>🖱️ ドラッグで移動 / ホイールでズーム</p>
      </div>

      <MapContainer
        center={mapCenterAndZoom.center}
        zoom={mapCenterAndZoom.zoom}
        key={`map-${destinationAirport?.id || 'none'}`}
        minZoom={2}
        maxZoom={10}
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={true}
      >
        {/* CartoDB Voyager - 美しくモダンな地図タイル */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* ルートライン - 背景（グロー効果） */}
        {routeLine && (
          <>
            <Polyline
              positions={routeLine}
              color="#60a5fa"
              weight={8}
              opacity={0.3}
            />
            <Polyline
              positions={routeLine}
              color="#3b82f6"
              weight={4}
              opacity={0.9}
              dashArray="10, 5"
            />
          </>
        )}

        {/* 経路上のマス目（500kmごと） */}
        {routeSpaces.map((space) => {
          const isPassed = currentSpace > space.spaceNumber;
          const isCurrent = currentSpace === space.spaceNumber;

          return (
            <CircleMarker
              key={`space-${space.spaceNumber}`}
              center={[space.lat, space.lng]}
              radius={isCurrent ? 10 : 6}
              color={isPassed ? '#10b981' : isCurrent ? colors.primary : '#9ca3af'}
              fillColor={isPassed ? '#34d399' : isCurrent ? colors.glow : '#d1d5db'}
              fillOpacity={isCurrent ? 1 : 0.8}
              weight={isCurrent ? 3 : 2}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-center text-xs">
                  <div className="font-bold">マス {space.spaceNumber}</div>
                  {isCurrent && <div className="text-green-600">現在地</div>}
                  {isPassed && <div className="text-gray-500">通過済み</div>}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* プレイヤーマーカー（飛行機アイコン） */}
        {planeIcon && (
          <Marker
            position={[playerPosition.lat, playerPosition.lng]}
            icon={planeIcon}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <div className="text-center">
                <div className="font-bold mb-1" style={{ color: colors.primary }}>👤 {playerNickname}</div>
                {currentSpace > 0 && routeSpaces.length > 0 ? (
                  <>
                    <div className="font-bold">🛫 移動中</div>
                    <div className="text-xs text-gray-600">
                      マス {currentSpace} / {routeSpaces.length}
                    </div>
                    <div className="text-xs font-bold" style={{ color: colors.primary }}>
                      目的地: {destinationAirport?.city || '不明'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold">✈️ {currentAirport.city}</div>
                    <div className="text-xs text-gray-600">{currentAirport.name_ja || currentAirport.name}</div>
                    <div className="text-xs text-gray-500">{currentAirport.code}</div>
                    <div className="text-xs font-bold" style={{ color: colors.primary }}>現在地</div>
                  </>
                )}
              </div>
            </Tooltip>
            <Popup>
              <div className="text-center">
                <div className="text-lg font-bold mb-1" style={{ color: colors.primary }}>👤 {playerNickname}</div>
                <div className="text-2xl mb-1">✈️</div>
                {currentSpace > 0 && routeSpaces.length > 0 ? (
                  <>
                    <div className="font-bold">移動中</div>
                    <div className="text-sm text-gray-600">
                      マス {currentSpace} / {routeSpaces.length}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold">{currentAirport.city}</div>
                    <div className="text-sm text-gray-600">現在地</div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* 目的地マーカー - 外側のパルス */}
        {destinationAirport && (
          <>
            <CircleMarker
              center={[
                getCoordinate(destinationAirport.latitude),
                getCoordinate(destinationAirport.longitude)
              ]}
              radius={20}
              color="#fbbf24"
              fillColor="#fef3c7"
              fillOpacity={0.3}
              weight={2}
              className="destination-pulse"
            />
            <CircleMarker
              center={[
                getCoordinate(destinationAirport.latitude),
                getCoordinate(destinationAirport.longitude)
              ]}
              radius={14}
              color="#d97706"
              fillColor="#fbbf24"
              fillOpacity={1}
              weight={4}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                <div className="text-center">
                  <div className="font-bold">🎯 {destinationAirport.city}</div>
                  <div className="text-xs text-gray-600">{destinationAirport.name_ja || destinationAirport.name}</div>
                  <div className="text-xs text-gray-500">{destinationAirport.code}</div>
                  <div className="text-xs text-amber-600 font-bold">目的地</div>
                </div>
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
