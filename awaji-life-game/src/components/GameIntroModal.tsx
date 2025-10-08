import React, { useEffect, useState } from 'react';

interface GameIntroModalProps {
  isOpen: boolean;
  onStartGame: () => void;
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({
  isOpen,
  onStartGame
}) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 5つのグループに分けたストーリー
  const storyGroups = [
    [
      "あなたは東京に住む大学生。",
      "ある日、友達のひとことがきっかけで「淡路島」という名前が頭をよぎります。",
      "観光地としての淡路島しか知らなかったあなたが、",
      "ふとした興味から、島の人や暮らしとつながっていく——。"
    ],
    [
      "このゲームでは、あなたがサイコロを振りながら、",
      "淡路島との\"出会い\"と\"関わり\"を体験します。"
    ],
    [
      "途中で訪れる選択——",
      "「淡路島に移住する」か、「東京から関係を続ける」か。",
      "どちらの道も、あなたなりの\"つながり方\"を描く旅です。"
    ],
    [
      "さあ、サイコロを振って、",
      "あなたと淡路島の物語をはじめましょう。 🎲"
    ],
    [
      "最後に、\"あなたの関係人口スコア\"が発表されます。",
      "準備はいいですか？"
    ]
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentGroup(0);
      return;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartGame();
      setIsAnimating(false);
    }, 300);
  };

  const handleNextGroup = () => {
    if (currentGroup < storyGroups.length - 1) {
      setCurrentGroup(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* 淡路島風景の背景画像 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/awaji-life-game/haikei.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 背景を少し暗くしてコンテンツを読みやすくする */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* メインコンテンツ */}
      <div className={`relative w-full max-w-lg mx-auto my-auto transition-transform duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* シンプルな半透明白ウィンドウ */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg relative overflow-hidden border border-white/20">

          {/* コンテンツエリア */}
          <div className="p-6">
            {/* タイトル - 人生ゲーム風 */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-black mb-3">
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent filter drop-shadow-lg">
                  淡路
                </span>
                <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent filter drop-shadow-lg mx-1">
                  人生
                </span>
                <span className="inline-block bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent filter drop-shadow-lg">
                  ゲーム
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-yellow-500 text-xl">🎯</span>
                <div className="text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  淡路島とつながる人生ゲーム ～関係人口を育む旅～
                </div>
                <span className="text-blue-500 text-xl">🏝️</span>
              </div>
              {/* キラキラエフェクト */}
              <div className="flex justify-center gap-1">
                <span className="text-yellow-400 animate-pulse">✨</span>
                <span className="text-pink-400 animate-pulse animation-delay-100">💫</span>
                <span className="text-blue-400 animate-pulse animation-delay-200">⭐</span>
              </div>
            </div>

            {/* ストーリーテキスト */}
            <div
              className={`min-h-[200px] flex flex-col justify-center ${
                currentGroup < storyGroups.length - 1 ? 'cursor-pointer' : ''
              }`}
              onClick={handleNextGroup}
            >
              <div
                key={currentGroup}
                className="space-y-2 text-sm leading-relaxed text-gray-800"
                style={{
                  animation: 'slideUp 0.8s ease-out'
                }}
              >
                {storyGroups[currentGroup].map((text, textIndex) => (
                  <p key={textIndex} className="text-center font-medium">
                    {text}
                  </p>
                ))}
              </div>

              {/* タップで次へのヒント */}
              {currentGroup < storyGroups.length - 1 && (
                <div className="mt-4 text-center text-xs text-gray-500 animate-pulse">
                  タップして続きを読む →
                </div>
              )}

              <style>{`
                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              {/* ゲーム開始ボタン - 落ち着いたデザイン */}
              {currentGroup >= storyGroups.length - 1 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartGame}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <span>▶</span>
                    <span>ゲームをはじめる</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ウィンドウ下部の装飾 */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 to-blue-800"></div>
        </div>

        {/* 下部の島のシルエット */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-green-800 rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-green-700 rounded-full opacity-80"></div>
      </div>
    </div>
  );
};
