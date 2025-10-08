import React from 'react';
import { Result } from '../types/game';
import { getGradeDisplay } from '../data/evaluator';

interface ResultViewProps {
  result: Result;
  totalRP: number;
  route: 'tokyo' | 'ijuu';
  onRestart: () => void;
  onShare: () => void;
  className?: string;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  totalRP,
  route,
  onRestart,
  onShare,
  className = ''
}) => {
  const gradeInfo = getGradeDisplay(result.grade);
  const routeInfo = route === 'tokyo' ? { name: '東京ルート', emoji: '🏙️', color: 'sky' } : { name: '移住ルート', emoji: '🏠', color: 'orange' };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🎯 ゲーム完了！</h2>
        <p className="text-gray-600">あなたの関係人口スコアが確定しました</p>
      </div>

      {/* 結果カード */}
      <div className="bg-white rounded-2xl border shadow-lg p-6 mb-6">
        {/* グレード表示 */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{gradeInfo.emoji}</div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {gradeInfo.title}
          </div>
          <div className="text-lg text-gray-600 mb-3">
            {gradeInfo.description}
          </div>
          <div className="text-sm text-gray-500">
            {result.summary}
          </div>
        </div>

        {/* スコア詳細 */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計RP</span>
            <span className="text-2xl font-bold text-emerald-600">{totalRP}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">選択ルート</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              route === 'tokyo'
                ? 'bg-sky-100 text-sky-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {routeInfo.emoji} {routeInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* グレード解説 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
        <h4 className="font-bold mb-2">グレード基準</h4>
        <div className="space-y-1 text-gray-600">
          <div>🌸 ランクS (50以上): 淡路の仲間</div>
          <div>🌾 ランクA (30-49): 淡路の友人</div>
          <div>🌊 ランクB (10-29): 淡路ファン</div>
          <div>☁️ ランクC (0-9): 観光で終わり</div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-4 rounded-2xl font-bold bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all duration-200"
        >
          もう一度遊ぶ
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-3 px-4 rounded-2xl font-bold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all duration-200"
        >
          結果をシェア
        </button>
      </div>

      {/* 補足メッセージ */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {route === 'tokyo'
          ? '離れていても心は淡路とつながっています'
          : '島の一員として新しい物語が続いていきます'
        }
      </div>
    </div>
  );
};