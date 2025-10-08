// 淡路人生ゲーム 型定義

export type Route = 'common' | 'tokyo' | 'ijuu';

export interface Cell {
  id: string;
  index: number; // 0..29
  route: Route;
  title: string;
  shortText: string; // 盤面用の短文
  icon?: string; // 絵文字またはアセットパス
  effect: {
    rpDelta?: number;
    event?: 'branch' | 'end' | 'none';
  };
  meta?: {
    isBranch?: boolean;
    isGoal?: boolean;
  };
}

export interface Board {
  cells: Cell[];
  branchCells: number[]; // 分岐マス index
}

export interface Dice {
  lastRoll: number | null; // 1-6
  animating: boolean;
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface Result {
  grade: Grade;
  summary: string;
}

export interface HistoryItem {
  index: number; // 停止マス
  rpDelta: number;
  timestamp: number;
}

export type GamePhase =
  | 'idle'
  | 'rolling'
  | 'moving'
  | 'branch'
  | 'modal'
  | 'result'
  | 'resetting';

export interface GameState {
  phase: GamePhase;
  currentIndex: number; // 現在のマス index
  route: 'none' | 'tokyo' | 'ijuu';
  rp: number;
  dice: Dice;
  history: HistoryItem[];
  board: Board;
  result: Result | null;
  remainingSteps?: number; // 分岐時の残り移動歩数
}

// ストーリーマップ
export type StoryMap = Record<string, string>;

// 移動イベント
export interface MoveEvent {
  fromIndex: number;
  toIndex: number;
  steps: number;
}

// 分岐選択イベント
export interface BranchEvent {
  selectedRoute: 'tokyo' | 'ijuu';
  remainingSteps: number;
}

// セル効果イベント
export interface CellEffectEvent {
  cell: Cell;
  rpDelta: number;
}