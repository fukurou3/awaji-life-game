import React, { useEffect, useRef } from 'react';
import { Cell } from '../types/game';
import { CellCard } from './CellCard';
import { CurrentMarker } from './CurrentMarker';

interface BoardViewProps {
  cells: Cell[];
  currentIndex: number;
  visitedIndices: number[];
  isMoving: boolean;
  className?: string;
}

export const BoardView: React.FC<BoardViewProps> = ({
  cells,
  currentIndex,
  visitedIndices,
  isMoving,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentCellRef = useRef<HTMLDivElement>(null);

  // 現在位置にスクロール
  useEffect(() => {
    if (currentCellRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentCell = currentCellRef.current;

      const containerWidth = container.clientWidth;
      const cellLeft = currentCell.offsetLeft;
      const cellWidth = currentCell.clientWidth;

      // セルを中央に配置するようにスクロール
      const scrollPosition = cellLeft - (containerWidth / 2) + (cellWidth / 2);

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className={`w-full ${className}`}>
      {/* ボードタイトル */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-gray-800">淡路人生ゲーム盤面</h3>
        <p className="text-sm text-gray-600">
          全30マス • 現在: {currentIndex + 1}マス目
        </p>
      </div>

      {/* スクロール可能なボード */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* セルコンテナ */}
        <div className="flex gap-3 min-w-max px-4">
          {cells.map((cell, index) => (
            <div
              key={cell.id}
              ref={index === currentIndex ? currentCellRef : undefined}
              className="relative"
            >
              <CellCard
                cell={cell}
                isCurrentPosition={index === currentIndex}
                isVisited={visitedIndices.includes(index)}
              />

              {/* 現在位置マーカー */}
              {index === currentIndex && (
                <CurrentMarker
                  isVisible={true}
                  isMoving={isMoving}
                />
              )}

              {/* 接続線 */}
              {index < cells.length - 1 && (
                <div className="absolute top-1/2 -right-1.5 w-3 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 進行状況バー */}
      <div className="mt-4 px-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(((currentIndex + 1) / cells.length) * 100, 100)}%`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>スタート</span>
          <span>{Math.round(((currentIndex + 1) / cells.length) * 100)}%</span>
          <span>ゴール</span>
        </div>
      </div>

      {/* ルート表示（分岐後） */}
      {cells.length > 13 && cells[13] && (
        <div className="mt-3 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            cells[13].route === 'tokyo'
              ? 'bg-sky-100 text-sky-800 border border-sky-200'
              : 'bg-orange-100 text-orange-800 border border-orange-200'
          }`}>
            {cells[13].route === 'tokyo' ? '🏙️ 東京ルート' : '🏠 移住ルート'}
          </span>
        </div>
      )}
    </div>
  );
};