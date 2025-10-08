import React from 'react';
import { Cell } from '../types/game';

interface CellCardProps {
  cell: Cell;
  isCurrentPosition: boolean;
  isVisited: boolean;
  className?: string;
  onClick?: () => void;
}

export const CellCard: React.FC<CellCardProps> = ({
  cell,
  isCurrentPosition,
  isVisited,
  className = '',
  onClick
}) => {
  const rpDelta = cell.effect.rpDelta || 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full aspect-square rounded-2xl border-2 p-3 flex flex-col items-center justify-center text-sm transition-all duration-300 shadow-soft cursor-pointer hover:shadow-lg
        ${isCurrentPosition
          ? 'border-warm-orange bg-gradient-to-br from-warm-cream via-soft-peach to-warm-pink shadow-warm scale-105 ring-2 ring-warm-orange/50 z-10'
          : cell.meta?.isBranch
          ? 'border-soft-lavender bg-gradient-to-br from-soft-lavender/70 via-warm-cream to-soft-mint/70'
          : cell.meta?.isGoal
          ? 'border-soft-gold bg-gradient-to-br from-soft-gold/70 via-warm-cream to-soft-rose/70'
          : isVisited
          ? 'border-soft-sage bg-gradient-to-br from-soft-sage/70 via-warm-cream to-soft-sky/70'
          : 'border-warm-gray bg-gradient-to-br from-warm-cream via-soft-ivory to-warm-white'
        }
        ${className}
      `}
      style={{
        boxShadow: isCurrentPosition
          ? '0 8px 25px rgba(255, 183, 147, 0.4), 0 3px 10px rgba(255, 183, 147, 0.2)'
          : '0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 6px rgba(0, 0, 0, 0.05)',
        '--warm-orange': '#FFB793',
        '--warm-cream': '#FFF8F0',
        '--soft-peach': '#FFDBCC',
        '--warm-pink': '#F7C5C5',
        '--soft-lavender': '#E6E0F8',
        '--soft-mint': '#E0F7E6',
        '--soft-gold': '#F0E68C',
        '--soft-rose': '#F5D7D7',
        '--soft-sage': '#D4E6D4',
        '--soft-sky': '#E0F1F7',
        '--warm-gray': '#E5E0DC',
        '--soft-ivory': '#FFFEF7',
        '--warm-white': '#FEFCF8'
      } as React.CSSProperties}
    >
      {/* マス番号 - やわらかなデザイン */}
      <div
        className="absolute -top-1 -left-1 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-semibold"
        style={{
          background: 'linear-gradient(135deg, #D4A574 0%, #E8C4A0 100%)',
          boxShadow: '0 2px 8px rgba(212, 165, 116, 0.3)',
          border: '2px solid #FFF8F0'
        }}
      >
        {cell.index + 1}
      </div>

      {/* RP変動 - やわらかなデザイン */}
      {rpDelta !== 0 && (
        <div
          className="absolute -top-1 -right-1 w-7 h-6 text-xs rounded-full flex items-center justify-center font-semibold text-white"
          style={{
            background: rpDelta > 0
              ? 'linear-gradient(135deg, #A8C8A8 0%, #C0D8C0 100%)'
              : 'linear-gradient(135deg, #E8B4B8 0%, #F0C4C8 100%)',
            boxShadow: rpDelta > 0
              ? '0 2px 8px rgba(168, 200, 168, 0.3)'
              : '0 2px 8px rgba(232, 180, 184, 0.3)',
            border: '2px solid #FFF8F0'
          }}
        >
          {rpDelta > 0 ? `+${rpDelta}` : rpDelta}
        </div>
      )}

      {/* 短文 - より大きなフォントで全文表示 */}
      <div className="text-center text-sm sm:text-base leading-snug px-0.5 font-medium flex-1 flex items-center justify-center">
        <span className="line-clamp-4">
          {cell.shortText}
        </span>
      </div>

      {/* 特別なマーカー - やわらかなデザイン */}
      {cell.meta?.isBranch && (
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-white text-[6px] px-2 py-1 rounded-full font-medium"
          style={{
            background: 'linear-gradient(135deg, #F0B27A 0%, #F4D03F 100%)',
            boxShadow: '0 2px 6px rgba(240, 178, 122, 0.3)',
            border: '1px solid #FFF8F0'
          }}
        >
          🔀 分岐
        </div>
      )}

      {cell.meta?.isGoal && (
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-white text-[6px] px-2 py-1 rounded-full font-medium"
          style={{
            background: 'linear-gradient(135deg, #BB8FCE 0%, #D7BDE2 100%)',
            boxShadow: '0 2px 6px rgba(187, 143, 206, 0.3)',
            border: '1px solid #FFF8F0'
          }}
        >
          🏁 ゴール
        </div>
      )}
    </div>
  );
};