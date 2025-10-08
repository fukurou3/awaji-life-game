import { Cell, Board } from '../types/game';

// RP データ（既存実装から抽出）
const RP_COMMON = [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2] as const;
const RP_TOKYO = [1, 1, 2, 3, 2, -2, 1, 3, 2, 3, 2, 2, 2, 3, 2, 3, 0] as const;
const RP_IJUU = [1, 2, 2, 2, 3, -2, 2, 3, 1, 2, 3, 2, 0, 3, 2, 3, 0] as const;

// 共通マス（1-13）
export const createCommonCells = (storyMap: Record<string, string>): Cell[] => {
  return RP_COMMON.map((rp, i) => ({
    id: `common-${i + 1}`,
    index: i,
    route: 'common',
    title: `マス${i + 1}`,
    shortText: storyMap[String(i + 1)]
      ? storyMap[String(i + 1)].replace(/^\d+\s*/, '').slice(0, 25) + (storyMap[String(i + 1)].replace(/^\d+\s*/, '').length > 25 ? '...' : '')
      : `マス${i + 1}`,
    icon: getIconForIndex(i),
    effect: {
      rpDelta: rp,
      event: i === 12 ? 'branch' : 'none'
    },
    meta: {
      isBranch: i === 12,
      isGoal: false
    }
  }));
};

// 東京ルート（14B-30B）
export const createTokyoCells = (storyMap: Record<string, string>): Cell[] => {
  return RP_TOKYO.map((rp, i) => {
    const cellNumber = 14 + i;
    const key = `${cellNumber}B`;
    return {
      id: `tokyo-${cellNumber}`,
      index: 13 + i,
      route: 'tokyo',
      title: `マス${cellNumber}B`,
      shortText: storyMap[key]
        ? storyMap[key].replace(/^\d+[AB]?\s*/, '').slice(0, 25) + (storyMap[key].replace(/^\d+[AB]?\s*/, '').length > 25 ? '...' : '')
        : `東京${i + 1}`,
      icon: getTokyoIconForIndex(i),
      effect: {
        rpDelta: rp,
        event: i === 16 ? 'end' : 'none'
      },
      meta: {
        isBranch: false,
        isGoal: i === 16
      }
    };
  });
};

// 移住ルート（14A-30A）
export const createIjuuCells = (storyMap: Record<string, string>): Cell[] => {
  return RP_IJUU.map((rp, i) => {
    const cellNumber = 14 + i;
    const key = `${cellNumber}A`;
    return {
      id: `ijuu-${cellNumber}`,
      index: 13 + i,
      route: 'ijuu',
      title: `マス${cellNumber}A`,
      shortText: storyMap[key]
        ? storyMap[key].slice(0, 20) + '...'
        : `移住${i + 1}`,
      icon: getIjuuIconForIndex(i),
      effect: {
        rpDelta: rp,
        event: i === 16 ? 'end' : 'none'
      },
      meta: {
        isBranch: false,
        isGoal: i === 16
      }
    };
  });
};

// アイコン取得関数
function getIconForIndex(index: number): string {
  const icons = ['🌊', '🧅', '📚', '🤝', '✉️', '🌉', '😊', '🍜', '☕', '🏪', '👥', '📝', '💝'];
  return icons[index] || '⭐';
}

function getTokyoIconForIndex(index: number): string {
  const icons = ['🏙️', '📱', '💻', '☕', '📊', '😰', '💌', '🍜', '🎓', '🛍️', '📱', '☕', '📄', '🎤', '💝', '😊', '🎯'];
  return icons[index] || '🏙️';
}

function getIjuuIconForIndex(index: number): string {
  const icons = ['🏠', '🥬', '👥', '📱', '🎤', '🗑️', '😊', '☕', '👨‍💼', '👨‍🏫', '🏛️', '📰', '⚖️', '👫', '🎉', '😊', '🏆'];
  return icons[index] || '🏠';
}

// 完全なボード作成関数
export const createBoard = (storyMap: Record<string, string>): Board => {
  const commonCells = createCommonCells(storyMap);

  return {
    cells: commonCells,
    branchCells: [12] // 13マス目（0-indexedで12）が分岐
  };
};

// ルート適用ボード作成
export const createBoardWithRoute = (
  storyMap: Record<string, string>,
  route: 'none' | 'tokyo' | 'ijuu'
): Board => {
  const commonCells = createCommonCells(storyMap);

  if (route === 'none') {
    return {
      cells: commonCells,
      branchCells: [12]
    };
  }

  const routeCells = route === 'tokyo'
    ? createTokyoCells(storyMap)
    : createIjuuCells(storyMap);

  return {
    cells: [...commonCells, ...routeCells],
    branchCells: [12]
  };
};