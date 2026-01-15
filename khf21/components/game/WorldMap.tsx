"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Airport } from "@/types/database.types";
import type { GamePlayer } from "@/types/multiplayer.types";

interface WorldMapProps {
  currentAirport: Airport;
  destinationAirport?: Airport;
  visitedAirports?: string[]; // airport codes
  showRoute?: boolean;
  playerNickname?: string;
  playerColor?: string; // 'red', 'blue', 'green', 'yellow', 'purple', 'orange'
  routeSpaces?: Array<{ lat: number; lng: number; spaceNumber: number }>;
  currentSpace?: number; // 現在のマス位置（1から始まる）
  // 複数プレイヤー対応
  players?: GamePlayer[];
  currentPlayer?: GamePlayer;
  airports?: Airport[]; // 全空港リスト（プレイヤー位置表示用）
  destinationNumber?: number; // 目的地の順番（1, 2, 3...）
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
  players = [],
  currentPlayer,
  airports = [],
  destinationNumber = 0,
}: WorldMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [planeIcon, setPlaneIcon] = useState<any>(null);
  const [planeIcons, setPlaneIcons] = useState<Map<string, any>>(new Map());

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

  // 各プレイヤー用の飛行機アイコンを生成
  useEffect(() => {
    if (typeof window !== "undefined" && players.length > 0) {
      import("leaflet").then((L) => {
        const newIcons = new Map<string, any>();

        players.forEach((player) => {
          // プレイヤーカラーを取得
          const playerColorHex = player.player_color || '#3b82f6';

          // プレイヤータイプに応じた色設定
          let primary: string;
          let shadow: string;
          let glow: string;

          if (player.player_type === 'freeman_d' || player.player_type === 'freeman_s') {
            // フリーマンは赤系（より目立つ色）
            primary = '#ef4444'; // 明るい赤
            shadow = '#991b1b'; // 濃い赤
            glow = '#fca5a5'; // グロー赤
          } else {
            // 人間プレイヤーは青系
            primary = '#3b82f6'; // 青
            shadow = '#1e3a8a'; // 濃い青
            glow = '#93c5fd'; // グロー青
          }

          const icon = L.divIcon({
            html: `
              <div style="transform: rotate(45deg); filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));">
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <!-- グロー効果 -->
                  <circle cx="20" cy="20" r="18" fill="${glow}" opacity="0.3"/>
                  <!-- 飛行機本体 -->
                  <g transform="translate(20, 20)">
                    <!-- 機体 -->
                    <ellipse cx="0" cy="0" rx="3" ry="8" fill="${primary}" stroke="${shadow}" stroke-width="1"/>
                    <!-- 主翼 -->
                    <rect x="-12" y="-2" width="24" height="4" rx="2" fill="${primary}" stroke="${shadow}" stroke-width="1"/>
                    <!-- 尾翼 -->
                    <polygon points="-4,6 0,10 4,6" fill="${primary}" stroke="${shadow}" stroke-width="1"/>
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

          newIcons.set(player.id, icon);
        });

        setPlaneIcons(newIcons);
      });
    }
  }, [players]);

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


  // マップの中心とズームを計算（全プレイヤーの経路全体が表示されるように）
  const mapCenterAndZoom = useMemo(() => {
    // 全プレイヤーの位置を収集
    const allLats: number[] = [];
    const allLngs: number[] = [];

    // 全プレイヤーのルートから座標を取得
    if (players && players.length > 0) {
      players.forEach((player) => {
        if (player.route_spaces && player.route_spaces.length > 0) {
          player.route_spaces.forEach((space) => {
            allLats.push(space.lat);
            allLngs.push(space.lng);
          });
        }
      });
    }

    // フォールバック：プレイヤーがいない場合は従来の計算
    if (allLats.length === 0) {
      allLats.push(currentLat);
      allLngs.push(currentLng);
      if (destinationAirport) {
        allLats.push(getCoordinate(destinationAirport.latitude));
        allLngs.push(getCoordinate(destinationAirport.longitude));
      }
    }

    // バウンディングボックスを計算
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);

    // 中心点を計算
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // 範囲を計算（十分な余白を持たせる）
    const latDiff = Math.abs(maxLat - minLat) * 1.6; // 60%の余白

    // 経度差を計算（180度をまたぐケースも考慮）
    let lngDiff = Math.abs(maxLng - minLng);
    // 180度をまたぐ場合は、逆回りの差分を使う
    if (lngDiff > 180) {
      lngDiff = 360 - lngDiff;
    }
    lngDiff = lngDiff * 1.6; // 60%の余白

    const maxDiff = Math.max(latDiff, lngDiff);

    // 距離に応じてズームレベルを調整（より広い範囲に対応）
    let zoom = 2; // デフォルト（より引いた視点）
    if (maxDiff < 0.5) zoom = 10;       // ~55km: 非常に近い
    else if (maxDiff < 1) zoom = 9;     // ~111km: とても近い
    else if (maxDiff < 2) zoom = 8;     // ~222km: 近い
    else if (maxDiff < 3) zoom = 7;     // ~333km: やや近い
    else if (maxDiff < 5) zoom = 6;     // ~555km: 中近距離
    else if (maxDiff < 10) zoom = 5;    // ~1110km: 中距離
    else if (maxDiff < 20) zoom = 4;    // ~2220km: やや長距離
    else if (maxDiff < 40) zoom = 3;    // ~4440km: 長距離
    else if (maxDiff < 80) zoom = 2;    // ~8880km: 超長距離
    else if (maxDiff < 160) zoom = 1;   // ~17760km: 極長距離
    else zoom = 1;                      // それ以上（最小ズーム）

    return { center: [centerLat, centerLng] as [number, number], zoom };
  }, [currentLat, currentLng, destinationAirport, players]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-[#1a365d] to-[#0f2744] flex items-center justify-center">
        <div className="text-white text-lg">地図を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
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
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg p-2.5 shadow-lg text-[10px] max-h-[40vh] overflow-y-auto">
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
          {players && players.length > 0 && players.some(p => p.route_spaces && p.route_spaces.length > 0) && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFEB3B] border-2 border-[#F9A825] shadow"></span>
                <span>目的地</span>
              </div>
              <div className="border-t border-gray-300 my-1 pt-1">
                <p className="font-bold mb-1 text-gray-700">イベントマス</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#34d399] border-2 border-[#10b981]"></span>
                <span>⭐ 感動体験</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#fde047] border-2 border-[#eab308]"></span>
                <span>🎁 喜び提供</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#fca5a5] border-2 border-[#ef4444]"></span>
                <span>⚠️ トラブル</span>
              </div>
            </>
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
        minZoom={1}
        maxZoom={10}
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={true}
      >
        {/* CartoDB Voyager - 美しくモダンな地図タイル */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* 各プレイヤーの経路を表示 */}
        {players && players.length > 0 && players.map((player) => {
          // プレイヤーがルートを持っている場合のみ表示
          if (!player.route_spaces || player.route_spaces.length === 0) return null;

          // route_spacesから出発地と目的地を取得
          const startSpace = player.route_spaces[0];
          const endSpace = player.route_spaces[player.route_spaces.length - 1];

          if (!startSpace || !endSpace) return null;

          // プレイヤータイプに応じた色設定
          const playerRouteColor = player.player_type === 'freeman_d' || player.player_type === 'freeman_s'
            ? { primary: '#ef4444', glow: '#fca5a5' }  // 赤系
            : { primary: '#3b82f6', glow: '#93c5fd' };  // 青系

          const routeLine = [
            [startSpace.lat, startSpace.lng] as [number, number],
            [endSpace.lat, endSpace.lng] as [number, number],
          ];

          return (
            <div key={`route-${player.id}`}>
              {/* ルートライン - 背景（グロー効果） */}
              <Polyline
                positions={routeLine}
                color={playerRouteColor.glow}
                weight={8}
                opacity={0.3}
              />
              <Polyline
                positions={routeLine}
                color={playerRouteColor.primary}
                weight={4}
                opacity={0.9}
                dashArray="10, 5"
              />

              {/* 経路上のマス目（500kmごと） */}
              {player.route_spaces && player.route_spaces.map((space) => {
                const isPassed = player.current_space_number > space.spaceNumber;
                const isCurrent = player.current_space_number === space.spaceNumber;

                // イベントタイプに応じた色設定
                const EVENT_COLORS = {
                  star: { border: '#10b981', fill: '#34d399' },                    // 緑（感動）
                  encouragement_gratitude: { border: '#10b981', fill: '#34d399' }, // 緑（感動）
                  giver: { border: '#eab308', fill: '#fde047' },                   // 黄色（喜び）
                  trouble: { border: '#ef4444', fill: '#fca5a5' },                 // 赤（トラブル）
                };

                // マスの色を決定（優先順位: 現在地 > イベント > 通過済み > 未通過）
                let borderColor = '#9ca3af'; // デフォルト（未通過）
                let fillColor = '#d1d5db';   // デフォルト（未通過）

                if (isCurrent) {
                  // 現在地: プレイヤーカラー
                  borderColor = playerRouteColor.primary;
                  fillColor = playerRouteColor.glow;
                } else if (isPassed && space.eventType && EVENT_COLORS[space.eventType]) {
                  // 通過済み + イベント発生: イベントカラー
                  borderColor = EVENT_COLORS[space.eventType].border;
                  fillColor = EVENT_COLORS[space.eventType].fill;
                } else if (isPassed) {
                  // 通過済み（イベントなし）: 緑
                  borderColor = '#10b981';
                  fillColor = '#34d399';
                }

                // イベント絵文字のマッピング
                const EVENT_EMOJIS = {
                  star: '⭐',
                  encouragement_gratitude: '💚',
                  giver: '🎁',
                  trouble: '⚠️',
                };

                return (
                  <CircleMarker
                    key={`space-${player.id}-${space.spaceNumber}`}
                    center={[space.lat, space.lng]}
                    radius={isCurrent ? 10 : 6}
                    color={borderColor}
                    fillColor={fillColor}
                    fillOpacity={isCurrent ? 1 : 0.8}
                    weight={isCurrent ? 3 : 2}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                      <div className="text-center text-xs">
                        <div className="font-bold">{player.player_nickname}</div>
                        <div className="font-bold">マス {space.spaceNumber}</div>
                        {isCurrent && <div className="text-green-600">現在地</div>}
                        {isPassed && !space.eventType && <div className="text-gray-500">通過済み</div>}
                        {isPassed && space.eventType && (
                          <div className="text-purple-600 font-bold">
                            {EVENT_EMOJIS[space.eventType]} イベント発生
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </div>
          );
        })}

        {/* 全プレイヤーマーカー（マルチプレイヤー対応） */}
        {players && players.length > 0 && (() => {
          // プレイヤーの位置を計算し、同じ位置のプレイヤーをグループ化
          const playerPositions: Map<string, Array<{ player: GamePlayer; lat: number; lng: number }>> = new Map();

          players.forEach((player) => {
            // プレイヤー専用のアイコンを取得
            const playerPlaneIcon = planeIcons.get(player.id);
            if (!playerPlaneIcon) return;

            // プレイヤーの現在位置を計算
            let playerLat: number | undefined;
            let playerLng: number | undefined;

            if (player.current_space_number > 0 && player.route_spaces && player.route_spaces.length > 0) {
              // 移動中: ルート上の位置
              const spaceIndex = player.current_space_number - 1;
              if (spaceIndex >= 0 && spaceIndex < player.route_spaces.length) {
                playerLat = player.route_spaces[spaceIndex].lat;
                playerLng = player.route_spaces[spaceIndex].lng;
              } else {
                // 目的地に到達している場合 - 共通目的地を使用
                if (destinationAirport) {
                  playerLat = getCoordinate(destinationAirport.latitude);
                  playerLng = getCoordinate(destinationAirport.longitude);
                }
              }
            } else {
              // 空港にいる: プレイヤーの現在地空港を取得
              const playerAirport = airports.find(a => a.id === player.current_airport_id);
              if (playerAirport) {
                playerLat = getCoordinate(playerAirport.latitude);
                playerLng = getCoordinate(playerAirport.longitude);
              } else {
                console.warn(`プレイヤー ${player.player_nickname} (${player.id}) の空港が見つかりません:`, {
                  current_airport_id: player.current_airport_id,
                  current_space_number: player.current_space_number,
                  available_airports: airports.length
                });
              }
            }

            // 位置が特定できない場合はスキップ
            if (playerLat === undefined || playerLng === undefined) return;

            // 位置キーを作成（小数点3桁で丸めて同じ位置を検出）
            const posKey = `${playerLat.toFixed(3)},${playerLng.toFixed(3)}`;

            if (!playerPositions.has(posKey)) {
              playerPositions.set(posKey, []);
            }
            playerPositions.get(posKey)!.push({ player, lat: playerLat, lng: playerLng });
          });

          // 各位置のプレイヤーにオフセットを適用してマーカーを配置
          const markers: React.JSX.Element[] = [];

          playerPositions.forEach((playersAtPos) => {
            const count = playersAtPos.length;

            playersAtPos.forEach((playerData, index) => {
              const { player, lat, lng } = playerData;
              const playerPlaneIcon = planeIcons.get(player.id);
              if (!playerPlaneIcon) return;

              // 複数プレイヤーが同じ位置にいる場合、円形に配置
              let offsetLat = 0;
              let offsetLng = 0;

              if (count > 1) {
                // 円形配置のための角度計算（360度 / プレイヤー数）
                const angle = (index * 360) / count;
                const angleRad = (angle * Math.PI) / 180;

                // オフセットの半径（緯度経度単位で約0.3度 ≈ 33km）
                // ズームレベルに応じて調整可能
                const radius = 0.3;

                offsetLat = radius * Math.cos(angleRad);
                offsetLng = radius * Math.sin(angleRad);

                console.log(`[WorldMap] プレイヤー ${player.player_nickname} - 同じ位置に${count}人 - オフセット適用 (${index}/${count}): angle=${angle}°, offset=(${offsetLat.toFixed(3)}, ${offsetLng.toFixed(3)})`);
              }

              const finalLat = lat + offsetLat;
              const finalLng = lng + offsetLng;

              // プレイヤーのアイコンを決定
              const playerIcon = player.player_type === 'human' ? '👤' :
                                 player.player_type === 'freeman_d' ? '🤖' : '🤝';

              markers.push(
                <Marker
                  key={player.id}
                  position={[finalLat, finalLng]}
                  icon={playerPlaneIcon}
                >
                  <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                    <div className="text-center">
                      <div className="font-bold mb-1" style={{ color: player.player_color }}>
                        {playerIcon} {player.player_nickname}
                      </div>
                      <div className="text-xs">
                        ポイント: {player.total_points}
                      </div>
                      {player.current_space_number > 0 ? (
                        <div className="text-xs text-gray-600">
                          移動中 ({player.current_space_number}/{player.route_spaces?.length || 0}マス)
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          空港
                        </div>
                      )}
                      {count > 1 && (
                        <div className="text-xs text-purple-600 font-bold mt-1">
                          同じマスに{count}人
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </Marker>
              );
            });
          });

          return markers;
        })()}

        {/* 各プレイヤーの目的地マーカー（黄色い○） */}
        {players && players.length > 0 && (() => {
          // 各プレイヤーの目的地を取得してグループ化
          const destinationMap: Map<string, Array<{ player: GamePlayer; lat: number; lng: number; airport: string; destNumber: number }>> = new Map();

          console.log(`[WorldMap] 目的地マーカー生成開始 - プレイヤー数: ${players.length}`);
          console.log(`[WorldMap] players配列の詳細:`, players.map(p => ({
            id: p.id,
            nickname: p.player_nickname,
            route_spaces_length: p.route_spaces?.length || 0,
            route_spaces_exists: !!p.route_spaces,
            current_space: p.current_space_number,
          })));

          players.forEach((player) => {
            console.log(`[WorldMap] ${player.player_nickname}: destination_airport_id=${player.destination_airport_id || 'なし'}, route_spaces=${player.route_spaces?.length || 0}マス, visit_history=${player.visit_history?.length || 0}箇所, current_space=${player.current_space_number}`);

            // destination_airport_idを使用して目的地を取得
            if (player.destination_airport_id) {
              const destAirport = airports.find(a => a.id === player.destination_airport_id);

              if (destAirport) {
                const lat = getCoordinate(destAirport.latitude);
                const lng = getCoordinate(destAirport.longitude);
                console.log(`[WorldMap] ${player.player_nickname}の目的地座標: lat=${lat.toFixed(3)}, lng=${lng.toFixed(3)}`);
                const posKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;

                if (!destinationMap.has(posKey)) {
                  destinationMap.set(posKey, []);
                }

                console.log(`[WorldMap] ${player.player_nickname}の空港検索結果: ${destAirport.city} (${destAirport.code})`);

                destinationMap.get(posKey)!.push({
                  player,
                  lat,
                  lng,
                  airport: destAirport.city,
                  destNumber: (player.visit_history?.length || 0) + 1, // 訪問履歴 + 1 = 現在の目的地番号
                });

                console.log(`[WorldMap] ${player.player_nickname}の目的地マーカー追加: ${destAirport.city} (目的地${(player.visit_history?.length || 0) + 1})`);
              } else {
                console.log(`[WorldMap] ${player.player_nickname}: destination_airport_id=${player.destination_airport_id}の空港が見つかりません`);
              }
            } else {
              console.log(`[WorldMap] ${player.player_nickname}: destination_airport_idが設定されていないため目的地マーカーをスキップ`);
            }
          });

          console.log(`[WorldMap] 目的地マーカー数: ${destinationMap.size}`);

          // 各目的地にマーカーを表示
          const markers: React.JSX.Element[] = [];

          destinationMap.forEach((playersAtDest) => {
            const { lat, lng, airport, destNumber } = playersAtDest[0];
            const playerCount = playersAtDest.length;

            console.log(`[WorldMap] 目的地マーカー作成: ${airport} (目的地${destNumber}) - ${playerCount}人の目的地`);

            markers.push(
              <div key={`dest-${lat}-${lng}`}>
                {/* パルスアニメーション効果 */}
                <CircleMarker
                  center={[lat, lng]}
                  radius={20}
                  color="#FFEB3B"
                  fillColor="#FFF9C4"
                  fillOpacity={0.3}
                  weight={2}
                  className="destination-pulse"
                />
                {/* メイン目的地マーカー */}
                <CircleMarker
                  center={[lat, lng]}
                  radius={14}
                  color="#F9A825"
                  fillColor="#FFEB3B"
                  fillOpacity={1}
                  weight={4}
                >
                  <Tooltip direction="bottom" offset={[0, 25]} opacity={0.95} permanent>
                    <div className="text-center">
                      <div className="font-bold text-sm">🎯 {airport}</div>
                      {destNumber > 0 && (
                        <div className="text-xs text-amber-600 font-semibold">
                          目的地{destNumber}
                        </div>
                      )}
                      {playerCount > 1 ? (
                        <div className="text-xs text-purple-600 font-bold mt-1">
                          {playerCount}人の目的地
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          {playersAtDest[0].player.player_nickname}の目的地
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              </div>
            );
          });

          console.log(`[WorldMap] 生成されたマーカー数: ${markers.length}`);

          return markers;
        })()}
      </MapContainer>
    </div>
  );
}
