import React, { useEffect, useState } from 'react';

interface GameIntroModalProps {
  isOpen: boolean;
  onStartGame: () => void;
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({
  isOpen,
  onStartGame
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const storySteps = [
    "あなたは東京に住む大学生。",
    "ある日、友達のひとことがきっかけで「淡路島」という名前が頭をよぎります。",
    "観光地としての淡路島しか知らなかったあなたが、",
    "ふとした興味から、島の人や暮らしとつながっていく——。",
    "",
    "このゲームでは、あなたがサイコロを振りながら、",
    "淡路島との\"出会い\"と\"関わり\"を体験します。",
    "",
    "途中で訪れる選択——",
    "「淡路島に移住する」か、「東京から関係を続ける」か。",
    "どちらの道も、あなたなりの\"つながり方\"を描く旅です。",
    "",
    "さあ、サイコロを振って、",
    "あなたと淡路島の物語をはじめましょう。 🎲",
    "",
    "最後に、\"あなたの関係人口スコア\"が発表されます。",
    "準備はいいですか？"
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < storySteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 800); // 0.8秒間隔で次のステップ

    return () => clearInterval(timer);
  }, [isOpen, storySteps.length]);

  if (!isOpen) return null;

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartGame();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ドラクエ風の背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        {/* 星空効果 */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className={`relative w-full max-w-lg mx-4 transition-transform duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* ドラクエ風のウィンドウ */}
        <div className="bg-blue-50 border-4 border-blue-800 rounded-lg shadow-2xl relative overflow-hidden">
          {/* ウィンドウの装飾 */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-600 to-blue-700"></div>
          <div className="absolute top-1 left-1 right-1 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm"></div>

          {/* コンテンツエリア */}
          <div className="pt-8 pb-6 px-6">
            {/* タイトル */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">淡路人生ゲーム</h1>
              <div className="text-lg text-blue-700">〜30の選択で関係人口になろう〜</div>
            </div>

            {/* ストーリーテキスト */}
            <div className="min-h-[300px] flex flex-col justify-center">
              <div className="space-y-3 text-sm leading-relaxed text-gray-800">
                {storySteps.slice(0, currentStep + 1).map((text, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-500 ${
                      index === currentStep
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-80'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {text === "" ? (
                      <div className="h-2"></div>
                    ) : (
                      <p className="text-center font-medium">{text}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* ゲーム開始ボタン */}
              {currentStep >= storySteps.length - 1 && (
                <div className="mt-8 text-center animate-bounce">
                  <button
                    onClick={handleStartGame}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 border-2 border-emerald-400"
                  >
                    <span>🕹️</span>
                    <span>▶ ゲームをはじめる</span>
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