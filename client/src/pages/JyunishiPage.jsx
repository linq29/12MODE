import { useEffect, useMemo, useRef, useState } from "react";
import BlurReveal from "../components/common/BlurReveal";
import GoldenButton from "../components/common/GoldenButton";
import SpinRevealImage from "../components/common/SpinRevealImage";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const RESULT_TEXT_DELAY_MS = 1000;
const EMPTY_TEXT = "—";

function normalizeText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function getZodiacId(item) {
  return Number(item?.zodiacID ?? item?.zodiacId ?? item?.id);
}

function formatRawFieldValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_TEXT;
  }

  if (typeof value === "string") {
    const text = value.trim();
    return text || EMPTY_TEXT;
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return EMPTY_TEXT;
    }
    return JSON.stringify(value);
  }

  if (typeof value === "object") {
    if (!Object.keys(value).length) {
      return EMPTY_TEXT;
    }
    return JSON.stringify(value);
  }

  return String(value);
}

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
    let mounted = true;

    async function loadZodiacs() {
      try {
        const apiRows = await getJson("/api/zodiacs");
        if (!mounted) {
          return;
        }

        if (Array.isArray(apiRows) && apiRows.length) {
          setZodiacs(apiRows);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to static JSON.
      }

      try {
        const localDb = await getJson("/data/database.json");
        if (!mounted) {
          return;
        }

        const fallbackRows = Array.isArray(localDb?.zodiacs) ? localDb.zodiacs : [];
        if (fallbackRows.length) {
          setZodiacs(fallbackRows);
          setLoading(false);
          return;
        }

        setError("干支データの読み込みに失敗しました。");
        setLoading(false);
      } catch {
        if (!mounted) {
          return;
        }
        setError("干支データの読み込みに失敗しました。");
        setLoading(false);
      }
    }

    loadZodiacs();

    return () => {
      mounted = false;
    };
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
    const zodiacData = zodiacs.find((item) => getZodiacId(item) === zodiacId);
    if (!zodiacData) {
      return;
    }

    setResult({
      zodiac: normalizeText(zodiacData.name ?? zodiacData.zodiac),
      ruby: normalizeText(zodiacData.ruby),
      rawFields: {
        messenger: zodiacData.messenger,
        personality: zodiacData.personality,
        related_blessings: zodiacData.related_blessings,
        related_spots: zodiacData.related_spots,
      },
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
            <GoldenButton id="confirmBtn" onClick={handleConfirm} disabled={loading}>
              OK！
            </GoldenButton>
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
                {result.zodiac || EMPTY_TEXT}
                <rt>{result.ruby || EMPTY_TEXT}</rt>
              </ruby>
            ) : null}
            {showResultText && result ? "年です！" : ""}
          </BlurReveal>
          <BlurReveal reveal={showRetryBtn}>
            <GoldenButton id="retryBtn" onClick={handleRetry} disabled={loading}>
              もう一回
            </GoldenButton>
          </BlurReveal>
          {showRetryBtn && result ? (
            <BlurReveal reveal={showRetryBtn}>
              <div className="jyunishi-detail-table-wrap">
                <table className="jyunishi-detail-table">
                  <tbody>
                    <tr>
                      <th scope="row">messenger</th>
                      <td>{formatRawFieldValue(result.rawFields.messenger)}</td>
                    </tr>
                    <tr>
                      <th scope="row">personality</th>
                      <td>{formatRawFieldValue(result.rawFields.personality)}</td>
                    </tr>
                    <tr>
                      <th scope="row">related_blessings</th>
                      <td>{formatRawFieldValue(result.rawFields.related_blessings)}</td>
                    </tr>
                    <tr>
                      <th scope="row">related_spots</th>
                      <td>{formatRawFieldValue(result.rawFields.related_spots)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BlurReveal>
          ) : null}
        </div>
      </main>
    </PageLayout>
  );
}
