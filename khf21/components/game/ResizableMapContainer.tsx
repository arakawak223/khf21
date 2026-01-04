'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizableMapContainerProps {
  children: ReactNode;
  initialHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export default function ResizableMapContainer({
  children,
  initialHeight = 400,
  minHeight = 200,
  maxHeight = 600,
}: ResizableMapContainerProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = height;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startHeightRef.current + deltaY)
      );
      setHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      const deltaY = e.touches[0].clientY - startYRef.current;
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startHeightRef.current + deltaY)
      );
      setHeight(newHeight);
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
  }, [isDragging, minHeight, maxHeight]);

  return (
    <div ref={containerRef} className="relative">
      <div style={{ height: `${height}px` }}>
        {children}
      </div>

      {/* リサイズハンドル */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          relative w-full h-3 flex items-center justify-center cursor-ns-resize
          ${isDragging ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}
          transition-colors duration-200
        `}
        style={{
          touchAction: 'none',
        }}
      >
        {/* ドラッグアイコン */}
        <div className="flex flex-col gap-0.5">
          <div className={`w-8 h-0.5 rounded-full ${isDragging ? 'bg-white' : 'bg-gray-600'}`} />
          <div className={`w-8 h-0.5 rounded-full ${isDragging ? 'bg-white' : 'bg-gray-600'}`} />
        </div>

        {/* ヒントテキスト */}
        {!isDragging && (
          <span className="absolute right-2 text-xs text-gray-600">
            ドラッグで地図のサイズを調整
          </span>
        )}
      </div>
    </div>
  );
}
