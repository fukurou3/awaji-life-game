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

  // 折り返し明確な配置レイアウト（3-1-3-1-3...パターン）
  const arrangeFoldLayout = () => {
    const rows: Cell[][] = [];
    let cellIndex = 0;

    while (cellIndex < cells.length) {
      const rowType = Math.floor(rows.length) % 4;

      if (rowType === 0 || rowType === 2) {
        // 3マスの行（0, 2, 4, 6行目など）
        const row = cells.slice(cellIndex, cellIndex + 3);
        if (rowType === 2) {
          // 逆方向（折り返し）
          row.reverse();
        }
        rows.push(row);
        cellIndex += 3;
      } else {
        // 1マスの行（1, 3, 5行目など）- 折り返しポイント
        const row = cells.slice(cellIndex, cellIndex + 1);
        rows.push(row);
        cellIndex += 1;
      }
    }

    return rows;
  };

  const rows = arrangeFoldLayout();

  // 現在のセルがどの行にあるかを計算
  const getCurrentRow = () => {
    let cellCount = 0;
    for (let i = 0; i < rows.length; i++) {
      const rowCellCount = rows[i].length;
      if (currentIndex < cellCount + rowCellCount) {
        return i;
      }
      cellCount += rowCellCount;
    }
    return rows.length - 1;
  };

  const currentRow = getCurrentRow();

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

  // セルのインデックスを取得（折り返し配置を考慮）
  const getCellIndex = (cell: Cell) => {
    return cells.findIndex(c => c.id === cell.id);
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
                {/* 動的グリッド配置（3個または1個） */}
                <div className={`grid gap-2 ${row.length === 3 ? 'grid-cols-3' : 'grid-cols-1 justify-items-center'}`}>
                  {row.map((cell, colIndex) => {
                    const actualIndex = getCellIndex(cell);

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

                        {/* 横の接続線（3個の行のみ） */}
                        {row.length === 3 && colIndex < row.length - 1 && (
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