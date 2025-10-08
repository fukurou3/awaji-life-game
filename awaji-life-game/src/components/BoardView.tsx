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

  // 3-1-3-1... のS字配置をベースに、末尾の余り(2/1)にも破綻しないよう行を構築
  const arrangeFoldLayout = () => {
    const rows: Cell[][] = [];
    let i = 0;

    while (i < cells.length) {
      const rowType = rows.length % 4; // 0:3(LTR), 1:1(R), 2:3(RTL), 3:1(L)

      if (rowType === 0 || rowType === 2) {
        // 3マス行（末尾不足なら2マスにも対応）
        const row = cells.slice(i, i + 3);
        if (rowType === 2) row.reverse();
        rows.push(row);
        i += row.length; // 残りが2/1でも破綻しない
      } else {
        // 1マス行
        const row = cells.slice(i, i + 1);
        rows.push(row);
        i += row.length;
      }
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

  // 行を常に3カラムのスロットに変換。1/2マス行はプレースホルダーで幅を揃え、S字の左右端に寄せる
  // rowIndex % 4: 0→LTR(3列), 1→右端(1列), 2→RTL(3列), 3→左端(1列)
  const buildSlotsForRow = (row: Cell[], rowIndex: number): (Cell | null)[] => {
    const slots: (Cell | null)[] = [null, null, null];
    const isLTR = rowIndex % 4 === 0 || rowIndex % 4 === 3;
    const startCol = isLTR ? 0 : 3 - row.length; // RTLは右寄せ
    for (let i = 0; i < row.length && startCol + i < 3; i++) {
      slots[startCol + i] = row[i];
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
        <div className="max-w-sm mx-auto pb-40">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              ref={rowIndex === currentRow ? currentRowRef : undefined}
              className="relative mb-4"
            >
              {/* 行間の湾曲接続（簡易） */}
              {rowIndex < rows.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-center">
                  {rowIndex % 2 === 0 ? (
                    <svg className="absolute bottom-0" width="100%" height="16" viewBox="0 0 300 16">
                      <path d="M 250 0 Q 275 8 275 16" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    </svg>
                  ) : (
                    <svg className="absolute bottom-0" width="100%" height="16" viewBox="0 0 300 16">
                      <path d="M 25 0 Q 0 8 0 16" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
              )}

              <div className="relative px-2">
                {/* 3カラム固定。1/2マス行はプレースホルダーで揃える */}
                <div className="grid grid-cols-3 gap-2">
                  {buildSlotsForRow(row, rowIndex).map((slotCell, slotIndex, slots) => {
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
                        />

                        {/* 現在位置マーカー */}
                        {actualIndex === currentIndex && (
                          <CurrentMarker isVisible={true} isMoving={isMoving} />
                        )}

                        {/* 同一行の隣接セル間のみ水平接続線 */}
                        {slotIndex < 2 && slots[slotIndex + 1] && (
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
            style={{ width: `${Math.min(((currentIndex + 1) / cells.length) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>スタート</span>
          <span>{Math.round(((currentIndex + 1) / cells.length) * 100)}%</span>
          <span>ゴール</span>
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

