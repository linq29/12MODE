import { useEffect, useState } from "react";

import BlurReveal from "../components/common/BlurReveal";
import GoldenButton from "../components/common/GoldenButton";
import LoadingMessage from "../components/common/LoadingMessage";

import { KOTOWAZA_LOAD_ERROR_MESSAGE } from "../data/messageText";

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
      setError(KOTOWAZA_LOAD_ERROR_MESSAGE);
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
          <LoadingMessage variant="screen" />
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
        <GoldenButton
          id="retryBtn"
          onClick={drawAgain}
          disabled={loading}
        >
          もう一度引く
        </GoldenButton>
      </main>
    </PageLayout>
  );
}
