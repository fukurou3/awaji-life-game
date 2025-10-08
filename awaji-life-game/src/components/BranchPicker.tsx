import React from 'react';

interface BranchPickerProps {
  onSelectBranch: (route: 'tokyo' | 'ijuu') => void;
  isVisible: boolean;
  className?: string;
}

export const BranchPicker: React.FC<BranchPickerProps> = ({
  onSelectBranch,
  isVisible,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* 説明 */}
      <div className="mb-4 text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <h3 className="font-bold text-lg mb-2">🌟 分岐点に到達！</h3>
        <p className="text-sm text-gray-700">
          これからどちらの道を選びますか？
        </p>
      </div>

      {/* 選択肢 */}
      <div className="flex gap-3">
        {/* A: 移住ルート */}
        <button
          onClick={() => onSelectBranch('ijuu')}
          className="flex-1 p-4 rounded-xl border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all duration-200"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🏠</div>
            <div className="font-bold text-orange-800 mb-1">A: 移住ルート</div>
            <div className="text-sm text-orange-700">
              淡路島に移住して<br />関わり続ける
            </div>
          </div>
        </button>

        {/* B: 東京ルート */}
        <button
          onClick={() => onSelectBranch('tokyo')}
          className="flex-1 p-4 rounded-xl border-2 border-sky-300 bg-sky-50 hover:bg-sky-100 active:scale-95 transition-all duration-200"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🏙️</div>
            <div className="font-bold text-sky-800 mb-1">B: 東京ルート</div>
            <div className="text-sm text-sky-700">
              東京に戻って<br />関係人口として関わる
            </div>
          </div>
        </button>
      </div>

      {/* 注意 */}
      <div className="mt-3 text-center text-xs text-gray-600">
        選択すると、そのルートに沿って物語が進行します
      </div>
    </div>
  );
};