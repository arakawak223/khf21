'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizablePanelsProps {
  topPanel: ReactNode;
  bottomPanel: ReactNode;
  initialTopHeight?: number; // percentage (0-100)
  minTopHeight?: number; // percentage
  maxTopHeight?: number; // percentage
}

export default function ResizablePanels({
  topPanel,
  bottomPanel,
  initialTopHeight = 25, // デフォルト25%
  minTopHeight = 15,
  maxTopHeight = 50,
}: ResizablePanelsProps) {
  const [topHeightPercent, setTopHeightPercent] = useState(initialTopHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const relativeY = clientY - containerRect.top;

      // パーセンテージに変換
      const newPercent = (relativeY / containerHeight) * 100;

      // 制限を適用
      const clampedPercent = Math.max(
        minTopHeight,
        Math.min(maxTopHeight, newPercent)
      );

      setTopHeightPercent(clampedPercent);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minTopHeight, maxTopHeight]);

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full overflow-hidden">
      {/* 上部パネル */}
      <div
        className="overflow-y-auto flex-shrink-0"
        style={{ height: `${topHeightPercent}%` }}
      >
        {topPanel}
      </div>

      {/* リサイズハンドル */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          relative w-full h-2 flex items-center justify-center cursor-ns-resize
          ${isDragging ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}
          transition-colors duration-200 z-10
        `}
        style={{
          touchAction: 'none',
        }}
      >
        {/* ドラッグアイコン */}
        <div className="flex flex-col gap-0.5">
          <div className={`w-12 h-0.5 rounded-full ${isDragging ? 'bg-white' : 'bg-gray-500'}`} />
          <div className={`w-12 h-0.5 rounded-full ${isDragging ? 'bg-white' : 'bg-gray-500'}`} />
        </div>
      </div>

      {/* 下部パネル */}
      <div
        className="flex-1 overflow-hidden"
        style={{ height: `${100 - topHeightPercent}%` }}
      >
        {bottomPanel}
      </div>
    </div>
  );
}
