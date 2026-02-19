import { useEffect, useMemo, useRef, useState } from "react";
import BlurReveal from "../components/common/BlurReveal";
import SpinRevealImage from "../components/common/SpinRevealImage";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const RESULT_TEXT_DELAY_MS = 820;

export default function JyunishiPage() {
  const [zodiacs, setZodiacs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const years = useMemo(() => {
    const list = [];
    for (let year = 2030; year >= 1924; year -= 1) {
      list.push(year);
    }
    return list;
  }, []);

  const [year, setYear] = useState(2026);
  const [result, setResult] = useState(null);
  const [zodiacImageTrigger, setZodiacImageTrigger] = useState(0);
  const [showResultText, setShowResultText] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [animateResultText, setAnimateResultText] = useState(false);
  const [blurRevealPlayed, setBlurRevealPlayed] = useState(false);
  const resultRevealTimerRef = useRef(null);

  useEffect(() => {
    getJson("/api/zodiacs")
      .then((data) => {
        setZodiacs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("干支データの読み込みに失敗しました。");
        setLoading(false);
      });
  }, []);

  useEffect(
    () => () => {
      if (resultRevealTimerRef.current) {
        clearTimeout(resultRevealTimerRef.current);
      }
    },
    []
  );

  const handleConfirm = () => {
    const zodiacId = ((Number(year) - 1924) % 12 + 12) % 12 + 1;
    const zodiacData = zodiacs.find((item) => Number(item.zodiacID) === zodiacId);
    if (!zodiacData) {
      return;
    }

    setResult({
      zodiac: zodiacData.name,
      ruby: zodiacData.ruby,
      image: `/images/jinjasagashi/zodiacA${zodiacId}.png`,
    });
    setZodiacImageTrigger((value) => value + 1);
    setShowResultText(false);
    setShowRetryBtn(false);

    if (resultRevealTimerRef.current) {
      clearTimeout(resultRevealTimerRef.current);
    }

    resultRevealTimerRef.current = setTimeout(() => {
      const shouldAnimate = !blurRevealPlayed;
      setAnimateResultText(shouldAnimate);
      setShowResultText(true);
      setShowRetryBtn(true);
      if (shouldAnimate) {
        setBlurRevealPlayed(true);
      }
      resultRevealTimerRef.current = null;
    }, RESULT_TEXT_DELAY_MS);
  };

  const handleRetry = () => {
    if (resultRevealTimerRef.current) {
      clearTimeout(resultRevealTimerRef.current);
      resultRevealTimerRef.current = null;
    }
    setResult(null);
    setShowResultText(false);
    setShowRetryBtn(false);
  };

  return (
    <PageLayout
      bodyClass="page-jyunishi"
      pageTitle="十二支診断 | 十二支詣"
      titleImage="/images/title-jyunishi.png"
      titleAlt="十二支診断"
    >
      <main className="whole">
        <div className="page-icon">
          <img src="/images/icon-jyunishi.png" alt="十二支診断" />
        </div>

        <div className="selection-area" id="selectionArea">
          <h1 className="jyunishi">診断したい年を選んでね！</h1>
          <div className="selection-wrapper">
            <select
              id="yearSelect"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button id="confirmBtn" type="button" onClick={handleConfirm} disabled={loading}>
              OK！
            </button>
          </div>
          {error ? <p className="jinja-step-note">{error}</p> : null}
        </div>

        <div id="resultArea">
          <SpinRevealImage
            id="zodiacImage"
            src={result ? result.image : ""}
            alt="Zodiac"
            visible={Boolean(result)}
            triggerKey={zodiacImageTrigger}
          />
          <BlurReveal id="zodiacResult" reveal={showResultText} animate={animateResultText}>
            {showResultText && result ? (
              <ruby>
                {result.zodiac}
                <rt>{result.ruby}</rt>
              </ruby>
            ) : null}
            {showResultText && result ? "年です！" : ""}
          </BlurReveal>
          <BlurReveal reveal={showRetryBtn}>
            <button id="retryBtn" type="button" onClick={handleRetry} disabled={loading}>
              もう一回
            </button>
          </BlurReveal>
        </div>
      </main>
    </PageLayout>
  );
}
