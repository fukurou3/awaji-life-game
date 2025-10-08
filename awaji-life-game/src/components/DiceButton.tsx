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
        relative w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200 shadow-xl border-4 border-white
        ${isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 active:scale-95 animate-pulse'
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

      {/* 出目表示 - ポップなデザイン */}
      {lastRoll && !isRolling && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full flex items-center justify-center font-bold text-sm border-2 border-white animate-bounce">
          {lastRoll}
        </div>
      )}

      {/* ローディングアニメーション - ポップなデザイン */}
      {isRolling && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 rounded-2xl opacity-75 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* キラキラエフェクト */}
      {!isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping rounded-2xl"></div>
      )}
    </button>
  );
};