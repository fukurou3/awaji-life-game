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
      {/* ヘッダー - ポップなデザイン */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black mb-3">
          <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">🎯</span>
          <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mx-2">ゲーム</span>
          <span className="inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">完了！</span>
        </h2>
        <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">あなたの関係人口スコアが確定しました ✨</p>
      </div>

      {/* 結果カード - ポップなデザイン */}
      <div className="bg-gradient-to-br from-white via-pink-50 to-yellow-50 rounded-2xl border-4 border-rainbow shadow-2xl p-6 mb-6 relative overflow-hidden"
           style={{
             borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3) 1'
           }}>
        {/* カード装飾 */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>
        <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

        {/* グレード表示 - ポップなデザイン */}
        <div className="text-center mb-4 relative z-10">
          <div className="text-7xl mb-3 animate-bounce">{gradeInfo.emoji}</div>
          <div className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
            {gradeInfo.title}
          </div>
          <div className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {gradeInfo.description}
          </div>
          <div className="text-sm font-medium text-gray-700 bg-white/70 px-3 py-2 rounded-full">
            {result.summary}
          </div>
        </div>

        {/* スコア詳細 - ポップなデザイン */}
        <div className="border-t-4 border-gradient-to-r from-pink-300 to-purple-300 pt-4 space-y-3 relative z-10">
          <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
            <span className="font-bold text-gray-700">💰 合計RP</span>
            <span className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent animate-pulse">{totalRP}</span>
          </div>

          <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
            <span className="font-bold text-gray-700">🛤️ 選択ルート</span>
            <span className={`px-4 py-2 rounded-full text-sm font-black shadow-lg border-2 border-white ${
              route === 'tokyo'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white'
                : 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
            }`}>
              {routeInfo.emoji} {routeInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* グレード解説 - ポップなデザイン */}
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-lg p-4 mb-6 text-sm border-2 border-purple-200 shadow-lg">
        <h4 className="font-black mb-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🎖️ グレード基準</h4>
        <div className="space-y-2">
          <div className="bg-white/60 rounded-full px-3 py-2 font-bold text-purple-700">🌸 ランクS (50以上): 淡路の仲間</div>
          <div className="bg-white/60 rounded-full px-3 py-2 font-bold text-green-700">🌾 ランクA (30-49): 淡路の友人</div>
          <div className="bg-white/60 rounded-full px-3 py-2 font-bold text-blue-700">🌊 ランクB (10-29): 淡路ファン</div>
          <div className="bg-white/60 rounded-full px-3 py-2 font-bold text-gray-700">☁️ ランクC (0-9): 観光で終わり</div>
        </div>
      </div>

      {/* アクションボタン - ポップなデザイン */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-4 px-6 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 active:scale-95 transition-all duration-200 shadow-xl border-4 border-white animate-pulse"
        >
          🎮 もう一度遊ぶ
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-4 px-6 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 hover:from-blue-600 hover:via-green-600 hover:to-teal-600 active:scale-95 transition-all duration-200 shadow-xl border-4 border-white animate-pulse"
        >
          📱 結果をシェア
        </button>
      </div>

      {/* 補足メッセージ - ポップなデザイン */}
      <div className="text-center mt-6 p-3 bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-full border-2 border-rainbow">
        <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {route === 'tokyo'
            ? '💙 離れていても心は淡路とつながっています ✨'
            : '🏝️ 島の一員として新しい物語が続いていきます 🌟'
          }
        </div>
      </div>
    </div>
  );
};