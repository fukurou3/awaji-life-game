import React from 'react';

interface DiceButtonProps {
  onRoll: () => void;
  isRolling: boolean;
  isDisabled: boolean;
  lastRoll: number | null;
  className?: string;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export const DiceButton: React.FC<DiceButtonProps> = ({
  onRoll,
  isRolling,
  isDisabled,
  lastRoll,
  className = ''
}) => {
  const diceDisplay = lastRoll ? DICE_FACES[lastRoll - 1] : '🎲';

  return (
    <button
      onClick={onRoll}
      disabled={isDisabled}
      className={`
        relative w-full py-4 px-6 rounded-lg font-medium text-white text-lg transition-all duration-200 shadow-md
        ${isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-slate-700 hover:bg-slate-600 hover:shadow-lg active:scale-95'
        }
        ${isRolling ? 'animate-bounce' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        <div
          className={`text-2xl transition-transform duration-200 ${
            isRolling ? 'animate-spin' : lastRoll ? 'animate-pulse' : ''
          }`}
        >
          {isRolling ? '🎲' : diceDisplay}
        </div>
        <span>
          {isRolling ? 'サイコロを振っています...' : 'サイコロを振る'}
        </span>
      </div>

      {/* 出目表示 - 落ち着いたデザイン */}
      {lastRoll && !isRolling && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">
          {lastRoll}
        </div>
      )}

      {/* ローディングアニメーション - 落ち着いたデザイン */}
      {isRolling && (
        <div className="absolute inset-0 bg-slate-600 rounded-lg opacity-75 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};