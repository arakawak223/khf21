'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CardEffectNotificationProps {
  message: string;
  onClose: () => void;
}

export default function CardEffectNotification({
  message,
  onClose,
}: CardEffectNotificationProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="space-y-6">
          {/* アイコン */}
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              カード効果発動！
            </h2>
          </div>

          {/* メッセージ */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {message}
            </p>
          </div>

          {/* 閉じるボタン */}
          <Button
            onClick={onClose}
            className="w-full text-xl font-bold py-6"
            size="lg"
          >
            OK
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
