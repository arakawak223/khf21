/**
 * フリーマンが目的地を決定した際の発表コンポーネント
 */

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Airport } from '@/types/database.types';

interface FreemanDestinationAnnouncementProps {
  destination: Airport;
  freemanName: string;
  onContinue: () => void;
}

export default function FreemanDestinationAnnouncement({
  destination,
  freemanName,
  onContinue,
}: FreemanDestinationAnnouncementProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 100,
        }}
        className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="space-y-6 text-center">
          {/* アイコン */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-8xl"
          >
            🤖
          </motion.div>

          {/* タイトル */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {freemanName}が目的地を決定！
            </h2>
          </div>

          {/* 目的地表示 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg border-4 border-orange-300"
          >
            <div className="space-y-3">
              {/* 国旗・国名 */}
              {destination.country && (
                <div className="text-xl sm:text-2xl font-bold text-gray-700 break-words">
                  {destination.country}
                </div>
              )}

              {/* 都市名 */}
              <div className="text-3xl sm:text-5xl font-bold text-orange-600 break-words px-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {destination.city || destination.name}
              </div>

              {/* 空港名 */}
              <div className="text-base sm:text-lg text-gray-600 break-words px-2">
                {destination.name_ja || destination.name}
              </div>
            </div>
          </motion.div>

          {/* 説明 */}
          <div className="text-gray-600">
            <p className="font-bold text-orange-600 mt-2">
              🎯 {freemanName}の次の目的地が決定しました！
            </p>
          </div>

          {/* 続けるボタン */}
          <Button
            onClick={onContinue}
            className="w-full text-xl font-bold py-6 bg-gradient-to-r from-orange-500 to-red-600"
            size="lg"
          >
            出発する ✈️
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
