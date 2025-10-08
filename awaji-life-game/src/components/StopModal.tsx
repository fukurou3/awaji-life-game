import React from 'react';
import { Cell } from '../types/game';

interface StopModalProps {
  isOpen: boolean;
  cell: Cell | null;
  rpDelta: number;
  totalRP: number;
  storyText: string;
  onClose: () => void;
  className?: string;
}

export const StopModal: React.FC<StopModalProps> = ({
  isOpen,
  cell,
  rpDelta,
  totalRP,
  storyText,
  onClose,
  className = ''
}) => {
  if (!isOpen || !cell) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* モーダル */}
      <div
        className={`
          relative w-full max-w-md bg-white rounded-t-3xl shadow-xl transform transition-all duration-300
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ${className}
        `}
      >
        {/* ハンドル */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{cell.icon || '⭐'}</div>
              <div>
                <h3 className="font-bold text-lg">マス {cell.index + 1}</h3>
                <p className="text-sm text-gray-600">{cell.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {/* ストーリーテキスト */}
          <div className="mb-4">
            <p className="text-base leading-relaxed">{storyText}</p>
          </div>

          {/* 好感度変動 */}
          <div className="mb-4 p-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-semibold">好感度変動</span>
              <span
                className={`font-bold text-lg ${
                  rpDelta > 0
                    ? 'text-green-600'
                    : rpDelta < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {rpDelta > 0 ? `+${rpDelta}` : rpDelta}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">合計好感度</span>
              <span className="font-bold text-emerald-600">{totalRP}</span>
            </div>
          </div>

          {/* 特別な効果 */}
          {cell.meta?.isBranch && (
            <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-600">🌟</span>
                <span className="font-semibold text-orange-800">分岐点</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                ここから道が分かれます
              </p>
            </div>
          )}

          {cell.meta?.isGoal && (
            <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2">
                <span className="text-purple-600">🎯</span>
                <span className="font-semibold text-purple-800">ゴール</span>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                物語が完結しました！
              </p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all duration-200"
          >
            {cell.meta?.isGoal ? '結果を見る' : '続ける'}
          </button>
        </div>
      </div>
    </div>
  );
};