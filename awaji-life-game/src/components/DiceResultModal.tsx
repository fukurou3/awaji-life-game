import React from 'react';

interface DiceResultModalProps {
  isOpen: boolean;
  diceResult: number | null;
  onClose: () => void;
}

export const DiceResultModal: React.FC<DiceResultModalProps> = ({
  isOpen,
  diceResult,
  onClose
}) => {
  if (!isOpen || !diceResult) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-2xl p-8 mx-4 shadow-2xl">
        <div className="text-center">
          {/* サイコロアイコン */}
          <div className="text-6xl mb-4">🎲</div>

          {/* 結果表示 */}
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {diceResult}
          </div>

          <p className="text-lg text-gray-600 mb-6">
            {diceResult}マス進みます！
          </p>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            進む
          </button>
        </div>
      </div>
    </div>
  );
};