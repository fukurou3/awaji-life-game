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
      {/* ヘッダー - 落ち着いたデザイン */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-3 text-slate-800">
          ゲーム完了
        </h2>
        <p className="text-lg text-slate-600">あなたの関係人口スコアが確定しました</p>
      </div>

      {/* 結果カード - 落ち着いたデザイン */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-6">

        {/* グレード表示 - 落ち着いたデザイン */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{gradeInfo.emoji}</div>
          <div className="text-3xl font-bold mb-2 text-slate-800">
            {gradeInfo.title}
          </div>
          <div className="text-lg font-medium mb-3 text-slate-600">
            {gradeInfo.description}
          </div>
          <div className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            {result.summary}
          </div>
        </div>

        {/* スコア詳細 - 落ち着いたデザイン */}
        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
            <span className="font-medium text-slate-700">合計RP</span>
            <span className="text-2xl font-bold text-slate-800">{totalRP}</span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
            <span className="font-medium text-slate-700">選択ルート</span>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              route === 'tokyo'
                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              {routeInfo.emoji} {routeInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* グレード解説 - 落ち着いたデザイン */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm border border-slate-200">
        <h4 className="font-bold mb-3 text-lg text-slate-800">グレード基準</h4>
        <div className="space-y-2">
          <div className="bg-white rounded-lg px-3 py-2 text-slate-700">🌸 ランクS (50以上): 淡路の仲間</div>
          <div className="bg-white rounded-lg px-3 py-2 text-slate-700">🌾 ランクA (30-49): 淡路の友人</div>
          <div className="bg-white rounded-lg px-3 py-2 text-slate-700">🌊 ランクB (10-29): 淡路ファン</div>
          <div className="bg-white rounded-lg px-3 py-2 text-slate-700">☁️ ランクC (0-9): 観光で終わり</div>
        </div>
      </div>

      {/* アクションボタン - 落ち着いたデザイン */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-6 rounded-lg font-medium text-white text-lg bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all duration-200 shadow-md"
        >
          ゲームを最初から行う
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-3 px-6 rounded-lg font-medium text-slate-700 text-lg bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all duration-200 shadow-md border border-slate-300"
        >
          結果をシェア
        </button>
      </div>

      {/* 補足メッセージ - 落ち着いたデザイン */}
      <div className="text-center mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-sm text-slate-600">
          {route === 'tokyo'
            ? '離れていても心は淡路とつながっています'
            : '島の一員として新しい物語が続いていきます'
          }
        </div>
      </div>
    </div>
  );
};