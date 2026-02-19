import { useEffect, useState } from "react";
import BlurReveal from "../components/common/BlurReveal";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

export default function KotowazaPage() {
  const [proverb, setProverb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const drawAgain = async () => {
    try {
      const nextProverb = await getJson("/api/proverbs/random");
      setProverb(nextProverb);
      setAnimationKey((value) => value + 1);
      setError("");
    } catch (fetchError) {
      setError("ことわざデータの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    drawAgain();
  }, []);

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
        {loading ? (
          <p className="jinja-step-note">読み込み中...</p>
        ) : error ? (
          <p className="jinja-step-note">{error}</p>
        ) : (
          <BlurReveal key={animationKey} className="proverb-area">
            <div
              className="proverb-text"
              dangerouslySetInnerHTML={{ __html: proverb.hiragana }}
            />
            <div className="proverb-desc">{proverb.proverbDesc}</div>
          </BlurReveal>
        )}
        <button
          id="retryBtn"
          className="retry-btn"
          type="button"
          onClick={drawAgain}
          disabled={loading}
        >
          もう一度引く
        </button>
      </main>
    </PageLayout>
  );
}
