import React, { useMemo, useState } from "react";

type Step = {
  no: string;
  text: string;
  rp: number;
};

const COMMON: Step[] = [
  { no: "1", text: "友達に誘われて『淡路島行こうよ！』と言われる。正直ピンとこない。", rp: 0 },
  { no: "2", text: "SNSで見た『玉ねぎの島』投稿が気になり始める。", rp: 1 },
  { no: "3", text: "淡路島地域実習の説明会に参加。意外と面白そうかも？", rp: 1 },
  { no: "4", text: "淡路ラボの紹介で『関係人口』という言葉を初めて知る。", rp: 1 },
  { no: "5", text: "行くか迷っていたけど、気づけば申込ボタンを押していた。", rp: 1 },
  { no: "6", text: "明石海峡大橋を渡り、海の広さに息をのむ。", rp: 1 },
  { no: "7", text: "初日のオリエンテーションで緊張。けど地元の人が笑顔で迎えてくれた。", rp: 1 },
  { no: "8", text: "淡路麺業の工場見学で『一口目の感動』を体験！", rp: 2 },
  { no: "9", text: "COFFEE BARNで出会ったオーナーの話に刺激を受ける。", rp: 2 },
  { no: "10", text: "弁天堂で『地元愛され型』経営を知り、地域の温かさを感じる。", rp: 2 },
  { no: "11", text: "市長との対話で、『来て終わりにしない』関係の大切さを聞く。", rp: 2 },
  { no: "12", text: "実習日報を書く。自分の研究テーマに『関係人口』が見えてきた。", rp: 2 },
  { no: "13", text: "最終日、地元の人に『また来てね』と言われる。ちょっと胸が熱くなる。", rp: 2 },
];

const ROUTE_A: Step[] = [
  { no: "14A", text: "移住支援センターで家探し。古民家を見つける。", rp: 1 },
  { no: "15A", text: "近所の人が野菜をくれた。『これが島の暮らし？』", rp: 2 },
  { no: "16A", text: "地域の集まりに参加。最初は緊張したけど、輪に入れてもらえた。", rp: 2 },
  { no: "17A", text: "SNSで『淡路移住日記』を投稿。反応が大きくて驚く。", rp: 2 },
  { no: "18A", text: "初めての地域イベントで司会を担当！", rp: 3 },
  { no: "19A", text: "一方で、ゴミ出しルールを間違えて叱られる。", rp: -2 },
  { no: "20A", text: "近所の人に謝りに行くと『気にせんでええよ』と笑顔で許してくれた。", rp: 2 },
  { no: "21A", text: "COFFEE BARNでバイト開始。接客を通して"語り手"になる。", rp: 3 },
  { no: "22A", text: "弁天堂の社長から『焦らずやりなさい』と声をかけられる。", rp: 1 },
  { no: "23A", text: "休日に学生実習生を案内。『今度は教える立場に…！』", rp: 2 },
  { no: "24A", text: "市役所の若手職員と連携し、新しい企画を立ち上げる。", rp: 3 },
  { no: "25A", text: "移住2年目、地域誌に取り上げられる。", rp: 2 },
  { no: "26A", text: "仕事と生活のバランスに悩むが、海を見て元気を取り戻す。", rp: 0 },
  { no: "27A", text: "『東京の友達を淡路に呼ぶ』プロジェクトを始動。", rp: 3 },
  { no: "28A", text: "友達が実際に来島し、『また来たい』と言ってくれた！", rp: 2 },
  { no: "29A", text: "地元から『もう島の人やな』と言われる。", rp: 3 },
  { no: "30A", text: "あなたの関係人口スコアは……？ 島の一員として新しい物語が続いていく。", rp: 0 },
];

const ROUTE_B: Step[] = [
  { no: "14B", text: "東京に戻ってしばらく経ち、淡路の写真を見返す。", rp: 1 },
  { no: "15B", text: "淡路ラボのSNSをフォロー。オンラインで近況をチェック。", rp: 1 },
  { no: "16B", text: "OB/OG座談会にオンライン参加。懐かしい顔がずらり。", rp: 2 },
  { no: "17B", text: "淡路カフェの東京開催を手伝うことに！", rp: 3 },
  { no: "18B", text: "イベント運営で『来訪者＝媒体』になる仕掛けを提案。", rp: 2 },
  { no: "19B", text: "本業が忙しく、淡路との関わりが少し薄れる。", rp: -2 },
  { no: "20B", text: "そんな中、淡路の友人から『今度来ない？』とメッセージ。", rp: 1 },
  { no: "21B", text: "久々に再訪し、淡路麺業の社長と再会。『覚えてるよ！』に感動。", rp: 3 },
  { no: "22B", text: "地元中学生の発表を見て、地域の成長を感じる。", rp: 2 },
  { no: "23B", text: "東京で淡路の物産展を企画。玉ねぎスープが大人気！", rp: 3 },
  { no: "24B", text: "SNSで『#淡路の人とつながる』投稿が拡散。", rp: 2 },
  { no: "25B", text: "弁天堂の商品を東京のカフェで紹介するコラボが実現。", rp: 2 },
  { no: "26B", text: "関係人口研究として論文を執筆。", rp: 2 },
  { no: "27B", text: "学会発表で『淡路島の関係人口モデル』を紹介。", rp: 3 },
  { no: "28B", text: "それを聞いた淡路の人から『ありがとう』とDMが届く。", rp: 2 },
  { no: "29B", text: "次の春、淡路に再訪。懐かしい人たちと再会して笑顔に。", rp: 3 },
  { no: "30B", text: "あなたの関係人口スコアは……？ 離れていても心は淡路とつながっている。", rp: 0 },
];

function evalEnding(score: number) {
  if (score >= 50) return { title: "🌸 淡路の仲間", desc: "地域の中で信頼される存在。関係人口のロールモデル！" };
  if (score >= 30) return { title: "🌾 淡路の友人", desc: "距離はあっても確かなつながり。継続関与の柱に。" };
  if (score >= 10) return { title: "🌊 淡路ファン", desc: "来訪体験から一歩踏み出した。次は"語り手"へ！" };
  return { title: "☁ 観光で終わり", desc: "でも大丈夫。入口はいつでも開かれています。" };
}

export default function AwajiLifeGame() {
  const [idx, setIdx] = useState(0);
  const [route, setRoute] = useState<"A" | "B" | null>(null);
  const [ridx, setRidx] = useState(0);
  const [rp, setRp] = useState(0);
  const [log, setLog] = useState<Step[]>([]);
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
        <h1 className="text-xl font-extrabold">人生ゲーム：淡路島とつながる30の選択</h1>
        <p className="text-xs text-gray-600">〜東京の大学生が「関係人口」になるまで〜</p>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-[11px] text-gray-500">進行度 {progress}%・RP {rp}</div>
      </header>

      <main className="flex-1 px-4 py-3">
        {log.length === 0 && (
          <section className="mb-3 text-sm">
            <div className="rounded-2xl border p-3 bg-gray-50">
              <h2 className="font-bold mb-1">ゲームの目的</h2>
              <p className="leading-relaxed">あなたは東京に住む大学生。ふとしたきっかけで淡路島に行くことになりました。どのように関わるかを選びながら進み、最終的なRP合計で関係度を評価します。</p>
            </div>
            <div className="rounded-2xl border p-3 mt-2">
              <h3 className="font-bold mb-1">ルール</h3>
              <ul className="list-disc pl-5 space-y-1 text-[13px]">
                <li>マスは全部で30。</li>
                <li>RP（Relation Point）は関係の深さ。<span className="font-semibold">＋：深まる ／ －：距離</span></li>
                <li>No.13のあと【分岐】で <b>A（移住）</b> または <b>B（東京から関与）</b> を選択。</li>
              </ul>
            </div>
          </section>
        )}

        {current && (
          <article
            className={`rounded-2xl border p-4 shadow-sm ${
              !isBranch
                ? "bg-white"
                : route === "A"
                ? "bg-orange-50 border-orange-200"
                : "bg-sky-50 border-sky-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500">No.{current.no}</span>
              <span className="text-xs font-bold">RP {current.rp >= 0 ? `+${current.rp}` : current.rp}</span>
            </div>
            <p className="text-base leading-relaxed">{current.text}</p>
          </article>
        )}

        {!isBranch && idx === COMMON.length && (
          <div className="mt-3 rounded-2xl border p-3 text-center">
            <p className="text-sm font-semibold">▼ 分岐：これからどうする？</p>
            <p className="text-xs text-gray-600">A：淡路島に移住して関わり続ける ／ B：東京に戻って関係人口として関わる</p>
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
            <p className="text-sm text-gray-700">合計RP：<b>{rp}</b></p>
            <p className="text-sm mt-1">{ending.desc}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border p-2">50～60：🌸 淡路の仲間</div>
              <div className="rounded-lg border p-2">30～49：🌾 淡路の友人</div>
              <div className="rounded-lg border p-2">10～29：🌊 淡路ファン</div>
              <div className="rounded-lg border p-2">0～9：☁ 観光で終わり</div>
            </div>
          </section>
        )}
      </main>

      <footer className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3">
        {!isBranch && idx < COMMON.length && (
          <button
            onClick={nextCommon}
            className="w-full py-3 rounded-2xl font-bold bg-emerald-600 text-white active:translate-y-[1px]"
          >
            つぎへ（No.{COMMON[idx]?.no ?? "-"}）
          </button>
        )}

        {!isBranch && idx >= COMMON.length && route === null && (
          <div className="flex gap-2">
            <button
              onClick={() => chooseRoute("A")}
              className="flex-1 py-3 rounded-2xl font-bold bg-orange-500 text-white active:translate-y-[1px]"
            >
              A：移住して関わる
            </button>
            <button
              onClick={() => chooseRoute("B")}
              className="flex-1 py-3 rounded-2xl font-bold bg-sky-500 text-white active:translate-y-[1px]"
            >
              B：東京から関わる
            </button>
          </div>
        )}

        {isBranch && !finished && (
          <button
            onClick={nextRoute}
            className={`w-full py-3 rounded-2xl font-bold text-white active:translate-y-[1px] ${
              route === "A" ? "bg-orange-500" : "bg-sky-500"
            }`}
          >
            つぎへ（{route} ルート No.{route === "A" ? ROUTE_A[ridx]?.no : ROUTE_B[ridx]?.no}）
          </button>
        )}

        {finished && (
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="flex-1 py-3 rounded-2xl font-bold bg-gray-900 text-white"
            >
              もう一度あそぶ
            </button>
            <a
              className="flex-1 py-3 rounded-2xl font-bold border text-center"
              href="#share"
              onClick={(e) => {
                e.preventDefault();
                const msg = `【淡路人生ゲーム】結果：${ending.title} / RP ${rp}\n#淡路島 #関係人口`;
                navigator.clipboard?.writeText(msg);
                alert("結果をクリップボードにコピーしました。SNSに貼り付けてシェアできます！");
              }}
            >
              結果をコピー
            </a>
          </div>
        )}
      </footer>
    </div>
  );
}