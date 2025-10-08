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
        relative w-full aspect-square rounded-lg border-4 p-2 flex flex-col items-center justify-center text-sm transition-all duration-200 shadow-lg
        ${isCurrentPosition
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 shadow-xl scale-105 ring-4 ring-yellow-300 z-10 animate-pulse'
          : cell.meta?.isBranch
          ? 'border-pink-400 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'
          : cell.meta?.isGoal
          ? 'border-purple-400 bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200'
          : isVisited
          ? 'border-blue-400 bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100'
          : 'border-gray-400 bg-gradient-to-br from-white via-gray-50 to-blue-50'
        }
        ${className}
      `}
    >
      {/* アイコン */}
      <div className="text-lg sm:text-xl mb-1">{cell.icon || '⭐'}</div>

      {/* マス番号 - ポップなデザイン */}
      <div className="absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-br flex items-center justify-center font-bold shadow-md border border-white">
        {cell.index + 1}
      </div>

      {/* RP変動 - ポップなデザイン */}
      {rpDelta !== 0 && (
        <div
          className={`absolute top-0 right-0 w-6 h-5 sm:w-7 sm:h-6 text-xs rounded-bl flex items-center justify-center font-bold shadow-md border border-white animate-bounce ${
            rpDelta > 0
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
          }`}
        >
          {rpDelta > 0 ? `+${rpDelta}` : rpDelta}
        </div>
      )}

      {/* 短文 - より大きなフォントで表示 */}
      <div className="text-center text-xs sm:text-sm leading-tight overflow-hidden line-clamp-3 px-1 font-medium">
        {cell.shortText}
      </div>

      {/* 特別なマーカー - ポップなデザイン */}
      {cell.meta?.isBranch && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[6px] px-2 py-1 rounded-full shadow-md border border-white animate-pulse">
          🔀 分岐
        </div>
      )}

      {cell.meta?.isGoal && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[6px] px-2 py-1 rounded-full shadow-md border border-white animate-pulse">
          🏁 ゴール
        </div>
      )}
    </div>
  );
};