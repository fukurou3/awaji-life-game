import React, { useEffect, useMemo, useState } from "react";

type Step = {
  no: string;
  text: string;
  rp: number;
};

// RP 配列（元データを維持）
const RP_COMMON = [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2] as const;
const RP_A = [1, 2, 2, 2, 3, -2, 2, 3, 1, 2, 3, 2, 0, 3, 2, 3, 0] as const;
const RP_B = [1, 1, 2, 3, 2, -2, 1, 3, 2, 3, 2, 2, 2, 3, 2, 3, 0] as const;

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

function useStoryTexts() {
  const [texts, setTexts] = useState<StoryMap>({});
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
        const pick = (a: string, b: string) => ((a.match(repl) || []).length <= (b.match(repl) || []).length ? a : b);
        const best = pick(utf8, sjis);
        const map = parseStory(best);
        if (!aborted) setTexts(map);
      } catch {
        // 読み込み失敗時はプレースホルダーのまま
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);
  return texts;
}

function evalEnding(score: number) {
  if (score >= 50) return { title: "🌸 ランクS", desc: "地域のキーパーソンとして関係が深い" };
  if (score >= 30) return { title: "🌾 ランクA", desc: "継続的な関与が見られる" };
  if (score >= 10) return { title: "🌊 ランクB", desc: "関係づくりの第一歩" };
  return { title: "☁️ ランクC", desc: "次の一歩で関係が広がる" };
}

export default function AwajiLifeGame() {
  const texts = useStoryTexts();
  const [idx, setIdx] = useState(0);
  const [route, setRoute] = useState<"A" | "B" | null>(null);
  const [ridx, setRidx] = useState(0);
  const [rp, setRp] = useState(0);
  const [log, setLog] = useState<Step[]>([]);
  const COMMON: Step[] = useMemo(() => {
    return RP_COMMON.map((rp, i) => ({ no: String(i + 1), text: texts[String(i + 1)] ?? `導入 ${i + 1}`, rp }));
  }, [texts]);

  const ROUTE_A: Step[] = useMemo(() => {
    return RP_A.map((rp, i) => {
      const n = 14 + i;
      const key = `${n}A`;
      return { no: key, text: texts[key] ?? `A-${i + 1}`, rp };
    });
  }, [texts]);

  const ROUTE_B: Step[] = useMemo(() => {
    return RP_B.map((rp, i) => {
      const n = 14 + i;
      const key = `${n}B`;
      return { no: key, text: texts[key] ?? `B-${i + 1}`, rp };
    });
  }, [texts]);

  const isBranch = idx >= COMMON.length;

  const current: Step | null = useMemo(() => {
    if (!isBranch) return COMMON[idx] ?? null;
    if (route === "A") return ROUTE_A[ridx] ?? null;
    if (route === "B") return ROUTE_B[ridx] ?? null;
    return null;
  }, [idx, isBranch, ridx, route]);

  const progress = useMemo(() => {
    const total = 13 + 17;
    const passed = Math.min(idx, 13) + (route ? ridx : 0);
    return Math.round((passed / total) * 100);
  }, [idx, ridx, route]);

  function applyStep(step: Step) {
    setRp((v) => v + step.rp);
    setLog((l) => [...l, step]);
  }

  function nextCommon() {
    const step = COMMON[idx];
    if (!step) return;
    applyStep(step);
    setIdx((v) => v + 1);
  }

  function chooseRoute(r: "A" | "B") {
    setRoute(r);
  }

  function nextRoute() {
    const arr = route === "A" ? ROUTE_A : ROUTE_B;
    const step = arr[ridx];
    if (!step) return;
    applyStep(step);
    setRidx((v) => v + 1);
  }

  const finished = route !== null && ridx >= 17;

  function resetAll() {
    setIdx(0);
    setRoute(null);
    setRidx(0);
    setRp(0);
    setLog([]);
  }

  const ending = evalEnding(rp);

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col items-stretch">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-extrabold">淡路人生ゲーム（30の選択）</h1>
        <p className="text-xs text-gray-600">進行度 {progress}%・RP {rp}</p>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 px-4 py-3">
        {current && (
          <article className={`rounded-2xl border p-4 shadow-sm ${!isBranch ? "bg-white" : route === "A" ? "bg-orange-50 border-orange-200" : "bg-sky-50 border-sky-200"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500">No.{current.no}</span>
              <span className="text-xs font-bold">RP {current.rp >= 0 ? `+${current.rp}` : current.rp}</span>
            </div>
            <p className="text-base leading-relaxed">{current.text}</p>
          </article>
        )}

        {!isBranch && idx === COMMON.length && (
          <div className="mt-3 rounded-2xl border p-3 text-center">
            <p className="text-sm font-semibold">▼ 分岐：これからどちらへ？</p>
            <p className="text-xs text-gray-600">A: 移住して関わる / B: 東京から関わる</p>
          </div>
        )}

        {log.length > 0 && (
          <section className="mt-3">
            <details className="rounded-xl border p-3 bg-gray-50" open>
              <summary className="cursor-pointer text-sm font-bold">これまでの記録（{log.length}）</summary>
              <ul className="mt-2 space-y-1 text-[13px]">
                {log.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 text-[11px] font-bold text-gray-500">No.{s.no}</span>
                    <span className="flex-1">{s.text}</span>
                    <span className="text-[11px] font-bold">RP {s.rp >= 0 ? `+${s.rp}` : s.rp}</span>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        )}

        {finished && (
          <section className="mt-4 rounded-2xl border p-4 bg-white shadow">
            <h3 className="font-bold mb-1">🧮 エンディング評価</h3>
            <p className="text-lg font-bold">{ending.title}</p>
            <p className="text-sm text-gray-700">合計 RP: <b>{rp}</b></p>
            <p className="text-sm mt-1">{ending.desc}</p>
          </section>
        )}
      </main>

      <footer className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3">
        {!isBranch && idx < COMMON.length && (
          <button onClick={nextCommon} className="w-full py-3 rounded-2xl font-bold bg-emerald-600 text-white active:translate-y-[1px]">
            つぎへ（No.{COMMON[idx]?.no ?? "-"}）
          </button>
        )}

        {!isBranch && idx >= COMMON.length && route === null && (
          <div className="flex gap-2">
            <button onClick={() => chooseRoute("A")} className="flex-1 py-3 rounded-2xl font-bold bg-orange-500 text-white active:translate-y-[1px]">
              A: 移住して関わる
            </button>
            <button onClick={() => chooseRoute("B")} className="flex-1 py-3 rounded-2xl font-bold bg-sky-500 text-white active:translate-y-[1px]">
              B: 東京から関わる
            </button>
          </div>
        )}

        {isBranch && !finished && (
          <button onClick={nextRoute} className={`w-full py-3 rounded-2xl font-bold text-white active:translate-y-[1px] ${route === "A" ? "bg-orange-500" : "bg-sky-500"}`}>
            つぎへ（{route} ルート No.{route === "A" ? ROUTE_A[ridx]?.no : ROUTE_B[ridx]?.no}）
          </button>
        )}

        {finished && (
          <div className="flex gap-2">
            <button onClick={resetAll} className="flex-1 py-3 rounded-2xl font-bold bg-gray-900 text-white">
              もう一度あそぶ
            </button>
            <a className="flex-1 py-3 rounded-2xl font-bold border text-center" href="#share" onClick={(e) => {
              e.preventDefault();
              const msg = `【淡路人生ゲーム】結果: ${ending.title} / RP ${rp}\n#淡路島 #関係人口`;
              navigator.clipboard?.writeText(msg);
              alert("結果をクリップボードにコピーしました。SNSに貼り付けてシェアできます！");
            }}>
              結果をコピー
            </a>
          </div>
        )}
      </footer>
    </div>
  );
}
