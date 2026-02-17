import { useEffect, useState } from "react";
import { proverbs } from "../data/proverbs";
import PageLayout from "../layouts/PageLayout";

function pickRandomProverb() {
  const randomIndex = Math.floor(Math.random() * proverbs.length);
  return proverbs[randomIndex];
}

export default function KotowazaPage() {
  const [proverb, setProverb] = useState(() => pickRandomProverb());
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setProverb(pickRandomProverb());
  }, []);

  const drawAgain = () => {
    setProverb(pickRandomProverb());
    setAnimationKey((value) => value + 1);
  };

  return (
    <PageLayout
      bodyClass="page-kotowaza"
      pageTitle="ことわざくじ | 十二支詣"
      titleImage="/images/title-kotowaza.png"
      titleAlt="ことわざくじ"
    >
      <main className="whole">
        <div className="page-icon">
          <img src="/images/icon-kuji.png" alt="ことわざくじ" />
        </div>

        <h1 className="kotowaza">今日のことわざ</h1>
        <div key={animationKey} className="proverb-area is-revealing">
          <div
            className="proverb-text"
            dangerouslySetInnerHTML={{ __html: proverb.hiragana }}
          />
          <div className="proverb-desc">{proverb.proverbDesc}</div>
        </div>
        <button id="retryBtn" className="retry-btn" type="button" onClick={drawAgain}>
          もう一度引く
        </button>
      </main>
    </PageLayout>
  );
}
