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
        relative w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200
        ${isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
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

      {/* 出目表示 */}
      {lastRoll && !isRolling && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
          {lastRoll}
        </div>
      )}

      {/* ローディングアニメーション */}
      {isRolling && (
        <div className="absolute inset-0 bg-emerald-700 rounded-2xl opacity-75 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};