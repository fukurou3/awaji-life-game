import React, { useState } from 'react';
import { useStoryTexts } from './hooks/useStoryTexts';
import { useGameState } from './hooks/useGameState';
import { BoardView } from './components/BoardView';
import { DiceButton } from './components/DiceButton';
import { BranchPicker } from './components/BranchPicker';
import { StopModal } from './components/StopModal';
import { ResultView } from './components/ResultView';
import { DiceResultModal } from './components/DiceResultModal';
import { GameIntroModal } from './components/GameIntroModal';
import { Cell } from './types/game';

export default function AwajiLifeGame() {
  const { texts, loading } = useStoryTexts();
  const { gameState, actions, computed } = useGameState({ storyMap: texts });
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">ストーリーを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  const currentCell = computed.getCurrentCell();
  const visitedIndices = gameState.history.map(h => h.index);

  // 導入画面表示中はゲームコンテンツを隠す
  if (gameState.phase === 'intro') {
    return (
      <div className="min-h-screen w-full bg-gray-50">
        <GameIntroModal
          isOpen={true}
          onStartGame={actions.startGame}
        />
      </div>
    );
  }

  // シェア機能
  const handleShare = async () => {
    if (!gameState.result) return;

    const gradeEmoji = gameState.result.grade === 'S' ? '🌸' :
                      gameState.result.grade === 'A' ? '🌾' :
                      gameState.result.grade === 'B' ? '🌊' : '☁️';

    const routeName = gameState.route === 'tokyo' ? '東京ルート' : '移住ルート';
    const message = `【ゲーム】結果: ${gradeEmoji} ランク${gameState.result.grade} / RP ${gameState.rp}\n選択: ${routeName}\n#淡路島 #関係人口`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ゲーム結果',
          text: message,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(message);
        alert('結果をクリップボードにコピーしました！SNSに貼り付けてシェアできます。');
      }
    } catch (error) {
      console.error('シェアに失敗しました:', error);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-gray-900 flex flex-col relative"
      style={{
        backgroundImage: "url('/awaji-life-game/haikei.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* オーバーレイで少し暗くして文字を読みやすくする */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-purple-100/40 to-pink-200/40 pointer-events-none"></div>
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 bg-white shadow-lg px-4 py-3 relative">
        {/* メインタイトル */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              淡路
            </span>
            <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mx-1">
              人生
            </span>
            <span className="inline-block bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              ゲーム
            </span>
          </h1>
        </div>

      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col relative z-10">
        {gameState.phase === 'result' && gameState.result ? (
          // 結果画面
          <div className="flex-1 p-4 flex items-center justify-center">
            <ResultView
              result={gameState.result}
              totalRP={gameState.rp}
              route={gameState.route as 'tokyo' | 'ijuu'}
              onRestart={actions.resetGame}
              onShare={handleShare}
            />
          </div>
        ) : (
          // ゲーム画面
          <>
            {/* ボード表示 */}
            <div className="flex-1 overflow-hidden">
              <BoardView
                cells={gameState.board.cells}
                currentIndex={gameState.currentIndex}
                visitedIndices={visitedIndices}
                isMoving={gameState.phase === 'moving'}
                className="h-full"
                onCellClick={(cell) => setClickedCell(cell)}
              />
            </div>

            {/* 操作パネル - 固定 */}
            <footer className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200 p-4 flex-shrink-0">
              {gameState.phase === 'branch' ? (
                // 分岐選択
                <BranchPicker
                  onSelectBranch={actions.selectBranch}
                  isVisible={true}
                />
              ) : (
                // サイコロボタン
                <DiceButton
                  onRoll={actions.rollDice}
                  isRolling={gameState.dice.animating}
                  isDisabled={!computed.canRollDice}
                  lastRoll={gameState.dice.lastRoll}
                />
              )}

            </footer>
          </>
        )}
      </main>

      {/* サイコロ結果モーダル */}
      <DiceResultModal
        isOpen={gameState.phase === 'dice_result'}
        diceResult={gameState.dice.lastRoll}
        onClose={actions.closeDiceResult}
      />

      {/* 停止モーダル */}
      <StopModal
        isOpen={gameState.phase === 'modal'}
        cell={currentCell}
        rpDelta={currentCell?.effect.rpDelta || 0}
        totalRP={gameState.rp}
        storyText={currentCell ? texts[
          currentCell.route === 'common'
            ? String(currentCell.index + 1)
            : currentCell.route === 'tokyo'
            ? `${14 + (currentCell.index - 13)}B`
            : `${14 + (currentCell.index - 13)}A`
        ] || currentCell.title : ''}
        onClose={actions.closeModal}
      />

      {/* クリックされたマスのモーダル */}
      <StopModal
        isOpen={clickedCell !== null}
        cell={clickedCell}
        rpDelta={clickedCell?.effect.rpDelta || 0}
        totalRP={gameState.rp}
        storyText={clickedCell ? texts[
          clickedCell.route === 'common'
            ? String(clickedCell.index + 1)
            : clickedCell.route === 'tokyo'
            ? `${14 + (clickedCell.index - 13)}B`
            : `${14 + (clickedCell.index - 13)}A`
        ] || clickedCell.title : ''}
        onClose={() => setClickedCell(null)}
      />
    </div>
  );
}