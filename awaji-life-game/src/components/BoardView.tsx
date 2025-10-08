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
  onCellClick?: (cell: Cell) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  cells,
  currentIndex,
  visitedIndices,
  isMoving,
  className = '',
  onCellClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLDivElement>(null);

  // 一行に2個のマス配置
  const arrangeFoldLayout = () => {
    const rows: Cell[][] = [];
    let i = 0;

    while (i < cells.length) {
      // 一行に2個ずつ配置
      const row = cells.slice(i, i + 2);
      rows.push(row);
      i += row.length;
    }

    return rows;
  };

  const rows = arrangeFoldLayout();

  // 現在の index がどの行にあるか（構築後の rows に対して）
  const getCurrentRow = () => {
    let count = 0;
    for (let r = 0; r < rows.length; r++) {
      const len = rows[r].length;
      if (currentIndex < count + len) return r;
      count += len;
    }
    return rows.length - 1;
  };

  const currentRow = getCurrentRow();

  // 現在の行が見えるよう自動スクロール（中央付近に寄せる）
  useEffect(() => {
    if (currentRowRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const target = currentRowRef.current;
      const containerHeight = container.clientHeight;
      const rowTop = target.offsetTop;
      const rowHeight = target.clientHeight;
      const scrollTop = rowTop - containerHeight / 2 + rowHeight / 2;
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [currentIndex]);

  // セル -> 元の直線 index を取得
  const getCellIndex = (cell: Cell) => cells.findIndex((c) => c.id === cell.id);

  // 行を2カラムのスロットに変換
  const buildSlotsForRow = (row: Cell[]): (Cell | null)[] => {
    const slots: (Cell | null)[] = [null, null];
    for (let i = 0; i < row.length && i < 2; i++) {
      slots[i] = row[i];
    }
    return slots;
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>

      {/* 盤面（縦スクロール） */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-2"
        style={{ maxHeight: 'calc(100vh - 250px)', scrollbarWidth: 'thin' }}
      >
        <div className="max-w-lg mx-auto pb-40">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              ref={rowIndex === currentRow ? currentRowRef : undefined}
              className="relative mb-4"
            >
              {/* 行間の接続線（垂直） */}
              {rowIndex < rows.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
              )}

              <div className="relative px-2">
                {/* 2カラム固定 */}
                <div className="grid grid-cols-2 gap-4">
                  {buildSlotsForRow(row).map((slotCell, slotIndex, slots) => {
                    if (!slotCell) {
                      return (
                        <div
                          key={`ph-${rowIndex}-${slotIndex}`}
                          className="relative w-full aspect-square invisible"
                        />
                      );
                    }

                    const actualIndex = getCellIndex(slotCell);

                    return (
                      <div key={slotCell.id} className="relative">
                        <CellCard
                          cell={slotCell}
                          isCurrentPosition={actualIndex === currentIndex}
                          isVisited={visitedIndices.includes(actualIndex)}
                          onClick={() => onCellClick?.(slotCell)}
                        />

                        {/* 現在位置マーカー */}
                        {actualIndex === currentIndex && (
                          <CurrentMarker isVisible={true} isMoving={isMoving} />
                        )}

                        {/* 同一行の隣接セル間のみ水平接続線 */}
                        {slotIndex < 1 && slots[slotIndex + 1] && (
                          <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
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

      {/* 分岐ルート表示 */}
      {cells.length > 13 && cells[13] && (
        <div className="mt-3 text-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              cells[13].route === 'tokyo'
                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}
          >
            {cells[13].route === 'tokyo' ? '🏙 東京ルート' : '🏠 移住ルート'}
          </span>
        </div>
      )}
    </div>
  );
};

