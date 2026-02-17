import { useEffect, useMemo, useState } from "react";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

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
          <img
            id="zodiacImage"
            src={result ? result.image : ""}
            alt="Zodiac"
            style={{ display: result ? "block" : "none" }}
          />
          <div id="zodiacResult">
            {result ? (
              <ruby>
                {result.zodiac}
                <rt>{result.ruby}</rt>
              </ruby>
            ) : null}
            {result ? "年です！" : ""}
          </div>
          <button
            id="retryBtn"
            type="button"
            onClick={() => setResult(null)}
            style={{ display: result ? "block" : "none" }}
            disabled={loading}
          >
            もう一回
          </button>
        </div>
      </main>
    </PageLayout>
  );
}
