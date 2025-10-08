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
  const currentRowRef = useRef<HTMLDivElement>(null);

  // S字型レイアウト用のセル配置（3列×10行）
  const arrangeInSnakePattern = () => {
    const rows: Cell[][] = [];
    const cols = 3;

    for (let i = 0; i < cells.length; i += cols) {
      const row = cells.slice(i, i + cols);
      // 偶数行は逆順（S字型にするため）
      if (Math.floor(i / cols) % 2 === 1) {
        row.reverse();
      }
      rows.push(row);
    }

    return rows;
  };

  const rows = arrangeInSnakePattern();
  const currentRow = Math.floor(currentIndex / 3);

  // 現在の行が表示範囲に入るように自動スクロール
  useEffect(() => {
    if (currentRowRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetRow = currentRowRef.current;

      const containerHeight = container.clientHeight;
      const rowTop = targetRow.offsetTop;
      const rowHeight = targetRow.clientHeight;

      // 現在の行が中央付近に来るようにスクロール
      const scrollPosition = rowTop - (containerHeight / 2) + (rowHeight / 2);

      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // 現在のセルがどの行のどの位置にあるか判定
  const getCellIndex = (rowIndex: number, colIndex: number) => {
    if (rowIndex % 2 === 0) {
      // 偶数行：左から右
      return rowIndex * 3 + colIndex;
    } else {
      // 奇数行：右から左（S字型）
      return rowIndex * 3 + (2 - colIndex);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* ボードタイトル */}
      <div className="mb-2 text-center flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-800">淡路人生ゲーム盤面</h3>
        <p className="text-sm text-gray-600">
          全30マス • 現在: {currentIndex + 1}マス目
        </p>
      </div>

      {/* 縦スクロール可能なボード（7行表示） */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-2"
        style={{
          maxHeight: 'calc(100vh - 300px)',
          scrollbarWidth: 'thin'
        }}
      >
        <div className="max-w-sm mx-auto pb-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              ref={rowIndex === currentRow ? currentRowRef : undefined}
              className="relative mb-2"
            >
              {/* 行番号表示（デバッグ用、必要なら削除） */}
              {/* <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {rowIndex + 1}
              </div> */}

              {/* S字型の接続線 */}
              {rowIndex < rows.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-center">
                  <div className={`w-0.5 h-full bg-gray-300 ${
                    rowIndex % 2 === 0 ? 'ml-auto mr-[16.67%]' : 'mr-auto ml-[16.67%]'
                  }`} />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {row.map((cell, colIndex) => {
                  const actualIndex = getCellIndex(rowIndex, colIndex);
                  if (!cell) return <div key={colIndex} className="w-full aspect-square" />;

                  return (
                    <div
                      key={cell.id}
                      className="relative"
                    >
                      <CellCard
                        cell={cell}
                        isCurrentPosition={actualIndex === currentIndex}
                        isVisited={visitedIndices.includes(actualIndex)}
                      />

                      {/* 現在位置マーカー */}
                      {actualIndex === currentIndex && (
                        <CurrentMarker
                          isVisible={true}
                          isMoving={isMoving}
                        />
                      )}

                      {/* 横の接続線（S字型） */}
                      {colIndex < row.length - 1 && row[colIndex + 1] && (
                        <div className="absolute top-1/2 -right-1 w-2 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
                      )}
                    </div>
                  );
                })}
              </div>
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