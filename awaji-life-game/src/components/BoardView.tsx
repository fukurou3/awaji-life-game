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

  // 人生ゲーム風のS字型湾曲レイアウト配置
  const arrangeCurvedLayout = () => {
    const rows: Cell[][] = [];

    // 30マスを3列10行に配置（S字型）
    for (let i = 0; i < cells.length; i += 3) {
      const row = cells.slice(i, i + 3);
      const rowIndex = Math.floor(i / 3);

      // 奇数行（1, 3, 5, 7, 9行目）は逆順でS字型を作る
      if (rowIndex % 2 === 1) {
        row.reverse();
      }

      rows.push(row);
    }

    return rows;
  };

  const rows = arrangeCurvedLayout();
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

  // セルのインデックスを取得（S字型配置を考慮）
  const getCellIndex = (rowIndex: number, colIndex: number) => {
    if (rowIndex % 2 === 0) {
      // 偶数行：左から右へ進む
      return rowIndex * 3 + colIndex;
    } else {
      // 奇数行：右から左へ進む（S字型）
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

      {/* 縦スクロール可能なボード */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-2"
        style={{
          maxHeight: 'calc(100vh - 250px)',
          scrollbarWidth: 'thin'
        }}
      >
        <div className="max-w-sm mx-auto pb-20">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              ref={rowIndex === currentRow ? currentRowRef : undefined}
              className="relative mb-4"
            >
              {/* 湾曲接続線 */}
              {rowIndex < rows.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-center">
                  {/* 右から左への湾曲線 */}
                  {rowIndex % 2 === 0 ? (
                    <svg
                      className="absolute bottom-0"
                      width="100%"
                      height="16"
                      viewBox="0 0 300 16"
                      style={{ left: 0 }}
                    >
                      <path
                        d="M 250 0 Q 275 8 275 16"
                        stroke="#d1d5db"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="absolute bottom-0"
                      width="100%"
                      height="16"
                      viewBox="0 0 300 16"
                      style={{ left: 0 }}
                    >
                      <path
                        d="M 25 0 Q 0 8 0 16"
                        stroke="#d1d5db"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </div>
              )}

              <div className="relative px-2">
                {/* 3列のグリッド配置 */}
                <div className="grid grid-cols-3 gap-2">
                  {row.map((cell, colIndex) => {
                    const actualIndex = getCellIndex(rowIndex, colIndex);

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

                        {/* 横の接続線 */}
                        {colIndex < row.length - 1 && (
                          <div className="absolute top-1/2 -right-1 w-2 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
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