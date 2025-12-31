/**
 * リソースポイント表示コンポーネント
 * プレイヤーの現在のリソースポイントを表示
 */

'use client';

import { motion } from 'framer-motion';

interface ResourcePointsDisplayProps {
  resourcePoints: number;
  totalSpent?: number;
  showSpent?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ResourcePointsDisplay({
  resourcePoints,
  totalSpent = 0,
  showSpent = false,
  size = 'medium',
}: ResourcePointsDisplayProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs px-2 py-1';
      case 'large':
        return 'text-lg px-4 py-2';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  // リソースポイントの色（残高に応じて変化）
  const getColorClass = () => {
    if (resourcePoints >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (resourcePoints >= 50) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (resourcePoints >= 20) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          ${getSizeClasses()}
          ${getColorClass()}
          rounded-full border-2 font-bold
          flex items-center gap-1
          shadow-sm
        `}
      >
        <span>💎</span>
        <span>{resourcePoints}</span>
        <span className="text-[10px] opacity-70">RP</span>
      </motion.div>

      {showSpent && totalSpent > 0 && (
        <div className="text-xs text-gray-500">
          (消費: {totalSpent}RP)
        </div>
      )}
    </div>
  );
}
