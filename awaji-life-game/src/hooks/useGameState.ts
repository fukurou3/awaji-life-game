import { useState, useCallback, useRef } from 'react';
import { GameState, GamePhase, Cell, HistoryItem } from '../types/game';
import { createBoard, createBoardWithRoute } from '../data/board';
import { evaluateRP } from '../data/evaluator';

interface UseGameStateOptions {
  storyMap: Record<string, string>;
}

export function useGameState({ storyMap }: UseGameStateOptions) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    phase: 'idle',
    currentIndex: 0,
    route: 'none',
    rp: 0,
    dice: {
      lastRoll: null,
      animating: false
    },
    history: [],
    board: createBoard(storyMap),
    result: null
  }));

  const moveTimeoutRef = useRef<number | null>(null);

  // サイコロを振る
  const rollDice = useCallback(() => {
    if (gameState.phase !== 'idle') return;

    setGameState(prev => ({
      ...prev,
      phase: 'rolling',
      dice: { ...prev.dice, animating: true }
    }));

    // アニメーション後に結果確定
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => ({
        ...prev,
        phase: 'moving',
        dice: { lastRoll: roll, animating: false }
      }));

      // 移動開始
      startMovement(roll);
    }, 500);
  }, [gameState.phase]);

  // 移動処理
  const startMovement = useCallback((steps: number) => {
    let remainingSteps = steps;

    const moveStep = () => {
      setGameState(prev => {
        if (remainingSteps <= 0) {
          // 移動完了、停止処理
          setTimeout(() => openStopModal(), 100);
          return prev;
        }

        const nextIdx = prev.currentIndex + 1;
        const totalCells = prev.board.cells.length;

        // ゴール判定
        if (nextIdx >= totalCells || (prev.route === 'none' && nextIdx >= 13)) {
          const finalIndex = Math.min(nextIdx, totalCells - 1);
          setTimeout(() => openStopModal(), 100);
          return {
            ...prev,
            currentIndex: finalIndex,
            phase: 'modal' as const
          };
        }

        // 分岐判定
        if (prev.board.branchCells.includes(nextIdx)) {
          return {
            ...prev,
            currentIndex: nextIdx,
            phase: 'branch' as const,
            remainingSteps: remainingSteps - 1
          };
        }

        // 通常移動
        remainingSteps--;
        moveTimeoutRef.current = window.setTimeout(moveStep, 200);

        return {
          ...prev,
          currentIndex: nextIdx
        };
      });
    };

    moveStep();
  }, []);

  // 分岐選択
  const selectBranch = useCallback((selectedRoute: 'tokyo' | 'ijuu') => {
    const newBoard = createBoardWithRoute(storyMap, selectedRoute);

    setGameState(prev => ({
      ...prev,
      route: selectedRoute,
      board: newBoard,
      phase: 'moving'
    }));

    // 残り移動続行
    if (gameState.remainingSteps && gameState.remainingSteps > 0) {
      startMovement(gameState.remainingSteps);
    } else {
      openStopModal();
    }
  }, [gameState.remainingSteps, storyMap]);

  // 停止モーダルを開く
  const openStopModal = useCallback(() => {
    const currentCell = gameState.board.cells[gameState.currentIndex];
    if (!currentCell) return;

    // RP適用
    const rpDelta = currentCell.effect.rpDelta || 0;
    const newRP = gameState.rp + rpDelta;

    const historyItem: HistoryItem = {
      index: gameState.currentIndex,
      rpDelta,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      rp: newRP,
      history: [...prev.history, historyItem],
      phase: 'modal'
    }));

    // ゴール判定
    if (currentCell.meta?.isGoal) {
      const result = evaluateRP(newRP);
      setGameState(prev => ({
        ...prev,
        result,
        phase: 'result'
      }));
    }
  }, [gameState.board.cells, gameState.currentIndex, gameState.rp, gameState.history]);

  // モーダルを閉じる
  const closeModal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: prev.result ? 'result' : 'idle'
    }));
  }, []);

  // ゲームリセット
  const resetGame = useCallback(() => {
    if (moveTimeoutRef.current) {
      window.clearTimeout(moveTimeoutRef.current);
    }

    setGameState({
      phase: 'idle',
      currentIndex: 0,
      route: 'none',
      rp: 0,
      dice: {
        lastRoll: null,
        animating: false
      },
      history: [],
      board: createBoard(storyMap),
      result: null
    });
  }, [storyMap]);

  // 現在のセル取得
  const getCurrentCell = useCallback((): Cell | null => {
    return gameState.board.cells[gameState.currentIndex] || null;
  }, [gameState.board.cells, gameState.currentIndex]);

  return {
    gameState,
    actions: {
      rollDice,
      selectBranch,
      closeModal,
      resetGame
    },
    computed: {
      getCurrentCell,
      canRollDice: gameState.phase === 'idle',
      isFinished: gameState.phase === 'result'
    }
  };
}