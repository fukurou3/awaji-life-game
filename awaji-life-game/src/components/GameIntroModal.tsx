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

    const timer = setInterval(() => {
      setCurrentGroup(prev => {
        if (prev < storyGroups.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 2000); // 2秒間隔で次のグループ

    return () => clearInterval(timer);
  }, [isOpen, storyGroups.length]);

  if (!isOpen) return null;

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartGame();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* 淡路島風景の背景画像 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/haikei.png')",
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
        {/* 人生ゲーム風のポップなウィンドウ */}
        <div className="bg-gradient-to-br from-white via-pink-50 to-yellow-50 border-4 border-rainbow rounded-2xl shadow-2xl relative overflow-hidden"
             style={{
               borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3) 1'
             }}>
          {/* ウィンドウの装飾 - 人生ゲーム風 */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>
          <div className="absolute top-1 left-1 right-1 h-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-sm"></div>

          {/* 角の装飾 */}
          <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>

          {/* コンテンツエリア */}
          <div className="pt-8 pb-6 px-6">
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
                  〜30の選択で関係人口になろう〜
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
            <div className="min-h-[200px] flex flex-col justify-center">
              <div className="space-y-6">
                {storyGroups.slice(0, currentGroup + 1).map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className={`transform transition-all duration-1000 ${
                      groupIndex === currentGroup
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-70'
                    }`}
                    style={{
                      transform: groupIndex === currentGroup ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 1s ease-out'
                    }}
                  >
                    <div className="space-y-2 text-sm leading-relaxed text-gray-800">
                      {group.map((text, textIndex) => (
                        <p key={textIndex} className="text-center font-medium">
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ゲーム開始ボタン - 人生ゲーム風 */}
              {currentGroup >= storyGroups.length - 1 && (
                <div className="mt-8 text-center animate-fadeIn">
                  <button
                    onClick={handleStartGame}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 hover:from-red-500 hover:via-pink-600 hover:to-purple-600 text-white font-black text-xl rounded-full shadow-xl transform transition-all duration-200 hover:scale-110 border-4 border-white relative overflow-hidden animate-pulse"
                  >
                    {/* ボタン内のキラキラ効果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                    <span className="text-2xl">🎲</span>
                    <span className="relative z-10">▶ ゲームをはじめる</span>
                    <span className="text-2xl">🏝️</span>
                  </button>
                  {/* ボタン周りの装飾 */}
                  <div className="flex justify-center gap-2 mt-3">
                    <span className="text-2xl animate-bounce animation-delay-0">✨</span>
                    <span className="text-2xl animate-bounce animation-delay-100">🌟</span>
                    <span className="text-2xl animate-bounce animation-delay-200">💫</span>
                  </div>
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
