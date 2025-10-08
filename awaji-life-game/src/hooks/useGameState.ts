import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GamePhase, Cell, HistoryItem } from '../types/game';
import { createBoard, createBoardWithRoute } from '../data/board';
import { evaluateRP } from '../data/evaluator';

interface UseGameStateOptions {
  storyMap: Record<string, string>;
}

export function useGameState({ storyMap }: UseGameStateOptions) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    phase: 'intro',
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

  // storyMapが変更されたときにボードを更新
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      board: prev.route === 'none'
        ? createBoard(storyMap)
        : createBoardWithRoute(storyMap, prev.route)
    }));
  }, [storyMap]);

  // サイコロを振る
  const rollDice = useCallback(() => {
    if (gameState.phase !== 'idle') return;

    setGameState(prev => ({
      ...prev,
      phase: 'rolling',
      dice: { ...prev.dice, animating: true }
    }));

    // アニメーション後に結果確定・モーダル表示
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => ({
        ...prev,
        phase: 'dice_result',
        dice: { lastRoll: roll, animating: false }
      }));
    }, 500);
  }, [gameState.phase]);

  // ゲーム開始
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'idle'
    }));
  }, []);

  // 停止モーダルを開く
  const openStopModal = useCallback(() => {
    setGameState(prev => {
      const currentCell = prev.board.cells[prev.currentIndex];
      if (!currentCell) return prev;

      // RP適用
      const rpDelta = currentCell.effect.rpDelta || 0;
      const newRP = prev.rp + rpDelta;

      const historyItem: HistoryItem = {
        index: prev.currentIndex,
        rpDelta,
        timestamp: Date.now()
      };

      // ゴール判定
      if (currentCell.meta?.isGoal) {
        const result = evaluateRP(newRP);
        return {
          ...prev,
          rp: newRP,
          history: [...prev.history, historyItem],
          result,
          phase: 'result' as const
        };
      }

      return {
        ...prev,
        rp: newRP,
        history: [...prev.history, historyItem],
        phase: 'modal' as const
      };
    });
  }, []);

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
  }, [openStopModal]);

  // サイコロ結果モーダルを閉じて移動開始
  const closeDiceResult = useCallback(() => {
    const roll = gameState.dice.lastRoll;
    if (!roll) return;

    setGameState(prev => ({
      ...prev,
      phase: 'moving'
    }));

    // 移動開始
    startMovement(roll);
  }, [gameState.dice.lastRoll, startMovement]);

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
  }, [gameState.remainingSteps, storyMap, startMovement, openStopModal]);

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
      phase: 'intro',
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
      startGame,
      rollDice,
      closeDiceResult,
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