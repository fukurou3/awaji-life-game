import { useEffect, useState } from 'react';

type StoryMap = Record<string, string>;

function parseStory(raw: string): StoryMap {
  const map: StoryMap = {};
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const s = line.trim();
    if (!s) continue;
    const m = s.match(/^\s*(?:No\.?\s*)?(\d{1,2})([AB])?\s*[：:.-、．]*\s*(.+)$/);
    if (m) {
      const key = `${m[1]}${m[2] ?? ""}`;
      const text = m[3].trim();
      if (text) map[key] = text;
    }
  }
  return map;
}

export function useStoryTexts() {
  const [texts, setTexts] = useState<StoryMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}story.txt`);
        if (!res.ok) return;

        const buf = await res.arrayBuffer();
        const utf8 = new TextDecoder("utf-8").decode(buf);
        const sjis = new TextDecoder("shift-jis").decode(buf);
        const repl = /\uFFFD/g;
        const pick = (a: string, b: string) =>
          ((a.match(repl) || []).length <= (b.match(repl) || []).length ? a : b);
        const best = pick(utf8, sjis);
        const map = parseStory(best);

        if (!aborted) {
          setTexts(map);
          setLoading(false);
        }
      } catch {
        // 読み込み失敗時はプレースホルダーのまま
        if (!aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  return { texts, loading };
}