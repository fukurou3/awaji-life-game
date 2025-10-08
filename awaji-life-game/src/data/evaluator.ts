import { Grade, Result } from '../types/game';

// RP評価ロジック（既存実装から抽出）
export function evaluateRP(rp: number): Result {
  if (rp >= 50) {
    return {
      grade: 'S',
      summary: '地域のキーパーソンとして関係が深い'
    };
  }
  if (rp >= 30) {
    return {
      grade: 'A',
      summary: '継続的な関与が見られる'
    };
  }
  if (rp >= 10) {
    return {
      grade: 'B',
      summary: '関係づくりの第一歩'
    };
  }
  return {
    grade: 'C',
    summary: '次の一歩で関係が広がる'
  };
}

// グレード表示用のデータ
export const GRADE_INFO = {
  S: { emoji: '🌸', title: 'ランクS', description: '淡路の仲間' },
  A: { emoji: '🌾', title: 'ランクA', description: '淡路の友人' },
  B: { emoji: '🌊', title: 'ランクB', description: '淡路ファン' },
  C: { emoji: '☁️', title: 'ランクC', description: '観光で終わり' },
  D: { emoji: '🌫️', title: 'ランクD', description: 'まだまだこれから' }
} as const;

export function getGradeDisplay(grade: Grade) {
  return GRADE_INFO[grade];
}