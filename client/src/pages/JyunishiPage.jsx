import { useMemo, useState } from "react";
import PageLayout from "../layouts/PageLayout";

const ZODIACS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC_RUBY = ["ね", "うし", "とら", "う", "たつ", "へび", "うま", "ひつじ", "さる", "とり", "いぬ", "い"];

export default function JyunishiPage() {
  const years = useMemo(() => {
    const list = [];
    for (let year = 2030; year >= 1924; year -= 1) {
      list.push(year);
    }
    return list;
  }, []);

  const [year, setYear] = useState(2026);
  const [result, setResult] = useState(null);

  const handleConfirm = () => {
    const zodiacIndex = (Number(year) - 1924) % 12;
    setResult({
      zodiac: ZODIACS[zodiacIndex],
      ruby: ZODIAC_RUBY[zodiacIndex],
      image: `/images/jinjasagashi/zodiacA${zodiacIndex + 1}.png`,
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
            <button id="confirmBtn" type="button" onClick={handleConfirm}>
              OK！
            </button>
          </div>
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
          >
            もう一回
          </button>
        </div>
      </main>
    </PageLayout>
  );
}
