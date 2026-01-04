/**
 * プレイヤーの接続状態を維持するハートビートフック
 */

import { useEffect, useRef } from 'react';
import { RoomManager } from '../roomManager';

const HEARTBEAT_INTERVAL = 30000; // 30秒ごとにピング

export function useHeartbeat(roomPlayerId: string | null) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const roomManager = useRef(new RoomManager());

  useEffect(() => {
    if (!roomPlayerId) {
      // ハートビート停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 初回ピング
    roomManager.current.updatePlayerPing(roomPlayerId);

    // 定期的にピング
    intervalRef.current = setInterval(() => {
      roomManager.current.updatePlayerPing(roomPlayerId);
      console.log(`Heartbeat sent for player: ${roomPlayerId}`);
    }, HEARTBEAT_INTERVAL);

    console.log(`Heartbeat started for player: ${roomPlayerId}`);

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log(`Heartbeat stopped for player: ${roomPlayerId}`);
      }
    };
  }, [roomPlayerId]);
}
