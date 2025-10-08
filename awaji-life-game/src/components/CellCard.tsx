import React from 'react';
import { Cell } from '../types/game';

interface CellCardProps {
  cell: Cell;
  isCurrentPosition: boolean;
  isVisited: boolean;
  className?: string;
}

export const CellCard: React.FC<CellCardProps> = ({
  cell,
  isCurrentPosition,
  isVisited,
  className = ''
}) => {
  const rpDelta = cell.effect.rpDelta || 0;

  return (
    <div
      className={`
        relative min-w-[80px] w-20 h-20 rounded-lg border-2 p-2 flex flex-col items-center justify-between text-xs transition-all duration-200
        ${isCurrentPosition
          ? 'border-emerald-500 bg-emerald-100 shadow-lg scale-110 ring-2 ring-emerald-300'
          : cell.meta?.isBranch
          ? 'border-orange-400 bg-orange-50'
          : cell.meta?.isGoal
          ? 'border-purple-400 bg-purple-50'
          : isVisited
          ? 'border-gray-400 bg-gray-100'
          : 'border-gray-300 bg-white'
        }
        ${className}
      `}
    >
      {/* アイコン */}
      <div className="text-lg">{cell.icon || '⭐'}</div>

      {/* マス番号 */}
      <div className="absolute top-0 left-0 w-4 h-4 bg-gray-700 text-white text-[8px] rounded-br flex items-center justify-center">
        {cell.index + 1}
      </div>

      {/* RP変動 */}
      {rpDelta !== 0 && (
        <div
          className={`absolute top-0 right-0 w-5 h-4 text-[8px] rounded-bl flex items-center justify-center font-bold ${
            rpDelta > 0
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {rpDelta > 0 ? `+${rpDelta}` : rpDelta}
        </div>
      )}

      {/* 短文 */}
      <div className="text-center text-[8px] leading-tight overflow-hidden line-clamp-2">
        {cell.shortText}
      </div>

      {/* 特別なマーカー */}
      {cell.meta?.isBranch && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-[6px] px-1 rounded">
          分岐
        </div>
      )}

      {cell.meta?.isGoal && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-[6px] px-1 rounded">
          ゴール
        </div>
      )}
    </div>
  );
};