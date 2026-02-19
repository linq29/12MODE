import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BlurReveal from "../components/common/BlurReveal";
import GoldenButton from "../components/common/GoldenButton";
import SpinRevealImage from "../components/common/SpinRevealImage";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const RESULT_TEXT_DELAY_MS = 800;
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

function pickFirstText(source, keys) {
  if (!source || typeof source !== "object") {
    return "";
  }

  for (const key of keys) {
    const text = normalizeText(source[key]);
    if (text) {
      return text;
    }
  }

  return "";
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Not JSON, continue with separator split.
    }

    return trimmed
      .split(/[、,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getLegacyRawField(result, key) {
  if (!result || typeof result !== "object") {
    return "";
  }
  const raw = result.rawFields;
  if (!raw || typeof raw !== "object") {
    return "";
  }
  return normalizeText(raw[key]);
}

function normalizeZodiacRow(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const zodiacID = Number(item.zodiacID ?? item.zodiacId ?? item.id);
  if (!Number.isFinite(zodiacID)) {
    return null;
  }

  return {
    ...item,
    zodiacID,
    name: pickFirstText(item, ["name", "zodiac", "zodiacName"]),
    animal: pickFirstText(item, ["animal", "animalName"]),
    ruby: pickFirstText(item, ["ruby", "read", "furigana"]),
    messenger: pickFirstText(item, [
      "messenger",
      "messanger",
      "messengerDesc",
      "messengerText",
    ]),
    personality: pickFirstText(item, [
      "personality",
      "character",
      "characteristic",
      "personalityDesc",
      "personalityText",
    ]),
    related_blessings: normalizeList(
      item.related_blessings ?? item.relatedBlessings ?? item.blessings
    ),
    related_spots: normalizeList(item.related_spots ?? item.relatedSpots ?? item.spots),
  };
}

function mergeZodiacs(primary, secondary) {
  const map = new Map();

  const appendRows = (rows) => {
    if (!Array.isArray(rows)) {
      return;
    }

    for (const row of rows) {
      const normalized = normalizeZodiacRow(row);
      if (!normalized) {
        continue;
      }

      const existing = map.get(normalized.zodiacID);
      if (!existing) {
        map.set(normalized.zodiacID, normalized);
        continue;
      }

      map.set(normalized.zodiacID, {
        ...existing,
        ...normalized,
        name: normalized.name || existing.name || "",
        animal: normalized.animal || existing.animal || "",
        ruby: normalized.ruby || existing.ruby || "",
        messenger: normalized.messenger || existing.messenger || "",
        personality: normalized.personality || existing.personality || "",
        related_blessings:
          normalized.related_blessings.length > 0
            ? normalized.related_blessings
            : existing.related_blessings || [],
        related_spots:
          normalized.related_spots.length > 0
            ? normalized.related_spots
            : existing.related_spots || [],
      });
    }
  };

  appendRows(primary);
  appendRows(secondary);

  return [...map.values()].sort((a, b) => a.zodiacID - b.zodiacID);
}

export default function JyunishiPage() {
  const [zodiacs, setZodiacs] = useState([]);
  const [blessingMap, setBlessingMap] = useState(new Map());
  const [spotMap, setSpotMap] = useState(new Map());
  const [spotIdByName, setSpotIdByName] = useState(new Map());
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
        setZodiacs(mergeZodiacs(data, []));
        setLoading(false);
      })
      .catch(() => {
        setError("干支データの読み込みに失敗しました。");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let mounted = true;

    getJson("/api/jinja-sagashi/bootstrap")
      .then((data) => {
        if (!mounted) {
          return;
        }

        if (Array.isArray(data?.zodiacs)) {
          setZodiacs((prev) => mergeZodiacs(prev, data.zodiacs));
        }

        if (!Array.isArray(data?.blessings)) {
          return;
        }

        const nextMap = new Map(
          data.blessings
            .map((item) => [
              Number(item?.blessingID ?? item?.bleesingID),
              normalizeText(item?.blessing),
            ])
            .filter(([id, blessing]) => Number.isFinite(id) && Boolean(blessing))
        );
        setBlessingMap(nextMap);

        if (Array.isArray(data?.spots)) {
          const nextSpotMap = new Map(
            data.spots
              .map((item) => {
                const id = Number(item?.spotID);
                const spot = normalizeText(item?.spot);
                return [id, spot];
              })
              .filter(([id, spot]) => Number.isFinite(id) && Boolean(spot))
          );
          setSpotMap(nextSpotMap);

          const nextSpotIdByName = new Map();
          for (const item of data.spots) {
            const name = normalizeText(item?.spot);
            const id = Number(item?.spotID);
            if (!name || !Number.isFinite(id) || nextSpotIdByName.has(name)) {
              continue;
            }
            nextSpotIdByName.set(name, id);
          }
          setSpotIdByName(nextSpotIdByName);
        }
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setBlessingMap(new Map());
        setSpotMap(new Map());
        setSpotIdByName(new Map());
      });

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
    const zodiacData = zodiacs.find((item) => Number(item.zodiacID) === zodiacId);
    if (!zodiacData) {
      return;
    }

    setResult({
      zodiacID: zodiacId,
      zodiac: zodiacData.name || "",
      name: zodiacData.name || "",
      animal: zodiacData.animal || "",
      ruby: zodiacData.ruby || "",
      messenger: zodiacData.messenger || "",
      personality: zodiacData.personality || "",
      relatedBlessings: normalizeList(zodiacData.related_blessings || zodiacData.blessings),
      relatedSpots: normalizeList(zodiacData.related_spots),
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

  const joinList = (items, mapItem) => {
    if (!Array.isArray(items) || !items.length) {
      return EMPTY_TEXT;
    }

    const text = items
      .map((item) => normalizeText(mapItem(item)))
      .filter(Boolean)
      .join("、");

    return text || EMPTY_TEXT;
  };

  const currentZodiac = result
    ? zodiacs.find(
        (item) =>
          Number(item.zodiacID) === Number(result.zodiacID) ||
          normalizeText(item.name) === normalizeText(result.zodiac)
      )
    : null;

  const currentMessenger = normalizeText(
    currentZodiac?.messenger || result?.messenger || getLegacyRawField(result, "messenger")
  );
  const currentPersonality = normalizeText(
    currentZodiac?.personality || result?.personality || getLegacyRawField(result, "personality")
  );
  const currentRelatedBlessings = normalizeList(
    currentZodiac?.related_blessings ??
      result?.relatedBlessings ??
      result?.rawFields?.related_blessings
  );
  const currentRelatedSpots = normalizeList(
    currentZodiac?.related_spots ?? result?.relatedSpots ?? result?.rawFields?.related_spots
  );

  const blessingText = result
    ? joinList(currentRelatedBlessings, (value) => {
        const normalized = Number(value);
        if (Number.isFinite(normalized) && blessingMap.has(normalized)) {
          return blessingMap.get(normalized);
        }

        return normalizeText(value);
      })
    : EMPTY_TEXT;

  const relatedSpotItems = result
    ? currentRelatedSpots
        .map((value) => {
          const normalized = Number(value);
          if (Number.isFinite(normalized) && spotMap.has(normalized)) {
            return {
              label: normalizeText(spotMap.get(normalized)),
              spotId: normalized,
            };
          }

          const label = normalizeText(value);
          return {
            label,
            spotId: Number(spotIdByName.get(label)),
          };
        })
        .filter((item) => Boolean(item.label))
    : [];

  const relatedSpotContent = relatedSpotItems.length ? (
    <>
      {relatedSpotItems.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {Number.isFinite(item.spotId) ? (
            <Link
              className="jyunishi-spot-link"
              to={`/jinja/${item.spotId}`}
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
          {index < relatedSpotItems.length - 1 ? "、" : ""}
        </span>
      ))}
    </>
  ) : (
    EMPTY_TEXT
  );

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
                {result.zodiac}
                <rt>{result.ruby}</rt>
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
                      <th scope="row">神使いとしての{result.animal}</th>
                      <td>{currentMessenger || EMPTY_TEXT}</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        {result.name}年生まれの特徴
                      </th>
                      <td>{currentPersonality || EMPTY_TEXT}</td>
                    </tr>
                    <tr>
                      <th scope="row">まつわるご利益</th>
                      <td>{blessingText}</td>
                    </tr>
                    <tr>
                      <th scope="row">まつわる神社</th>
                      <td>{relatedSpotContent}</td>
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
