import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import FlipImage from "../components/common/FlipImage";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const e = React.createElement;
const STEP_TRANSITION_MS = 420;

function getZodiacImage(zodiacId, face) {
  return `/images/jinjasagashi/zodiac${face}${zodiacId}.png`;
}

function pickRandomItems(items, count) {
  const copied = items.slice();

  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copied[i];
    copied[i] = copied[j];
    copied[j] = temp;
  }

  return copied.slice(0, count);
}

function getBlessingId(blessing) {
  return Number(blessing.bleesingID || blessing.blessingID);
}

function getBlessingImage(blessing) {
  if (blessing.blessingEn) {
    return `/images/jinjasagashi/blessing_${blessing.blessingEn}.png`;
  }

  return `/images/blessing${getBlessingId(blessing)}.png`;
}

function getSpotImage(spotId) {
  return `/images/spot${spotId}.jpg`;
}

function getSpotSite(spot) {
  return spot.spotSite || spot["Unnamed: 7"] || "";
}

function SpotImage(props) {
  const { spotId, alt } = props;
  const [src, setSrc] = useState(getSpotImage(spotId));

  useEffect(() => {
    setSrc(getSpotImage(spotId));
  }, [spotId]);

  return e("img", {
    src,
    alt,
    onError: () => {
      if (src.endsWith(".jpg")) {
        setSrc(`/images/spot${spotId}.png`);
      }
    },
  });
}

function JinjaSagashiApp(props) {
  const { presetBlessingId } = props;
  const [loading, setLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepNotice, setStepNotice] = useState("");
  const [db, setDb] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [blessingChoices, setBlessingChoices] = useState([]);
  const [selectedBlessing, setSelectedBlessing] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    getJson("/api/jinja-sagashi/bootstrap")
      .then((data) => {
        if (!mounted) {
          return;
        }

        setDb(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setError("データの読み込みに失敗しました。APIサーバーを確認してください。");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    },
    []
  );

  function runStepTransition(next) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setStepLoading(true);
    transitionTimerRef.current = setTimeout(() => {
      next();
      setStepLoading(false);
      transitionTimerRef.current = null;
    }, STEP_TRANSITION_MS);
  }

  function getZodiacSpots(zodiacId) {
    if (!db || !Array.isArray(db.spots)) {
      return [];
    }

    return db.spots.filter((spot) => Number(spot.zodiacID) === Number(zodiacId));
  }

  function getBlessingPoolForZodiac(zodiacId) {
    if (!db || !Array.isArray(db.spot_blessing)) {
      return [];
    }

    const zodiacSpotIds = new Set(
      getZodiacSpots(zodiacId).map((spot) => Number(spot.spotID))
    );

    const blessingIdSet = new Set(
      db.spot_blessing
        .filter((row) => zodiacSpotIds.has(Number(row.spotID)))
        .map((row) => Number(row.blessingID))
    );

    return (db.blessings || []).filter((blessing) =>
      blessingIdSet.has(getBlessingId(blessing))
    );
  }

  function prepareBlessingStep(zodiacId, withTransition) {
    const pool = getBlessingPoolForZodiac(zodiacId);
    const next = () => {
      const presetBlessing = presetBlessingId
        ? pool.find((blessing) => getBlessingId(blessing) === presetBlessingId)
        : null;

      if (presetBlessingId && !presetBlessing) {
        setStepNotice("指定されたご利益はこの干支に対応していないため、候補を再抽選しました。");
      } else {
        setStepNotice(
          presetBlessingId ? "旧ルート指定のご利益で絞り込み中です。" : ""
        );
      }

      setError("");
      setBlessingChoices(
        presetBlessing ? [presetBlessing] : pickRandomItems(pool, 4)
      );
      setSelectedBlessing(null);
      setSelectedSpot(null);
      setSelectedZodiac(zodiacId);
      setStep(2);
    };

    if (withTransition) {
      runStepTransition(next);
      return;
    }

    next();
  }

  function pickRandom() {
    if (!db || !Array.isArray(db.spots) || !db.spots.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * db.spots.length);
    const randomSpot = db.spots[randomIndex];

    runStepTransition(() => {
      setError("");
      setStepNotice("");
      setSelectedSpot(randomSpot);
      setSelectedZodiac(null);
      setSelectedBlessing(null);
      setStep(3);
    });
  }

  function selectBlessingAndPickShrine(blessing) {
    if (!db || !selectedZodiac) {
      return;
    }

    const zodiacSpots = getZodiacSpots(selectedZodiac);
    const zodiacSpotIds = new Set(zodiacSpots.map((spot) => Number(spot.spotID)));

    const selectedBlessingId = getBlessingId(blessing);

    const candidateSpotIds = new Set(
      (db.spot_blessing || [])
        .filter(
          (row) =>
            Number(row.blessingID) === selectedBlessingId &&
            zodiacSpotIds.has(Number(row.spotID))
        )
        .map((row) => Number(row.spotID))
    );

    const candidateSpots = zodiacSpots.filter((spot) =>
      candidateSpotIds.has(Number(spot.spotID))
    );

    if (!candidateSpots.length) {
      setError("今はまだ、導かれるべき道が見つからないようです。");
      return;
    }

    const randomSpot = candidateSpots[Math.floor(Math.random() * candidateSpots.length)];

    runStepTransition(() => {
      setSelectedBlessing(blessing);
      setSelectedSpot(randomSpot);
      setStep(3);
    });
  }

  function resetSearch() {
    runStepTransition(() => {
      setError("");
      setStepNotice("");
      setSelectedZodiac(null);
      setBlessingChoices([]);
      setSelectedBlessing(null);
      setSelectedSpot(null);
      setStep(1);
    });
  }

  function renderStepLoading() {
    return e(
      "div",
      { className: "jinja-loading-screen", role: "status", "aria-live": "polite" },
      e("div", { className: "jinja-loading-spinner", "aria-hidden": "true" }),
      e("p", { className: "jinja-loading-text" }, "次の道へご案内中…")
    );
  }

  function renderStep1() {
    const zodiacList = (db && db.zodiacs) || [];

    return e(
      React.Fragment,
      null,
      e("div", { className: "page-icon" }, e("img", { src: "/images/icon-torii.png", alt: "" })),
      e("h1", { className: "jinjasagashi" }, "干支を選んでね！"),
      e(
        "div",
        { className: "select-step1 justify-wrapper" },
        zodiacList.map((zodiac) =>
          e(
            "button",
            {
              key: zodiac.zodiacID,
              type: "button",
              className: "select-step1-item zodiac-pick-btn",
              onClick: () => {
                const zodiacId = Number(zodiac.zodiacID);
                prepareBlessingStep(zodiacId, true);
              },
            },
            e(FlipImage, {
              frontSrc: getZodiacImage(zodiac.zodiacID, "A"),
              backSrc: getZodiacImage(zodiac.zodiacID, "B"),
              alt: zodiac.name,
            })
          )
        )
      ),
      e(
        "button",
        {
          id: "randomShrineBtn",
          className: "random-btn",
          type: "button",
          onClick: pickRandom,
        },
        "気ままに行こう！"
      )
    );
  }

  function renderStep2() {
    if (!selectedZodiac) {
      return null;
    }

    const zodiacData = (db.zodiacs || []).find(
      (zodiac) => Number(zodiac.zodiacID) === Number(selectedZodiac)
    );

    return e(
      React.Fragment,
      null,
      e(
        "div",
        { className: "page-icon" },
        e("img", {
          src: getZodiacImage(selectedZodiac, "A"),
          alt: zodiacData ? zodiacData.name : "",
        })
      ),
      e("h1", { className: "jinjasagashi" }, "気になるご利益は？"),
      e(
        "div",
        { className: "select-step2 justify-wrapper" },
        blessingChoices.map((blessing) =>
          e(
            "button",
            {
              key: getBlessingId(blessing),
              type: "button",
              className: "select-step2-item blessing-pick-btn",
              onClick: () => {
                selectBlessingAndPickShrine(blessing);
              },
            },
            e("img", {
              src: getBlessingImage(blessing),
              alt: blessing.blessing || "",
            })
          )
        )
      ),
      !blessingChoices.length
        ? e(
            "p",
            { className: "jinja-step-note" },
            "この干支に対応するご利益データが見つかりません。"
          )
        : null,
      stepNotice
        ? e(
            "p",
            { className: "jinja-step-note" },
            stepNotice
          )
        : null,
      e(
        "div",
        { className: "jinja-step-actions" },
        e(
          "button",
          {
            className: "retry-btn",
            type: "button",
            onClick: () => {
              prepareBlessingStep(selectedZodiac, false);
            },
          },
          "ご利益を引き直す"
        ),
        e(
          "button",
          {
            className: "retry-btn",
            type: "button",
            onClick: () => {
              resetSearch();
            },
          },
          "干支選択に戻る"
        )
      )
    );
  }

  function renderResult() {
    if (!selectedSpot) {
      return null;
    }

    const spotSite = getSpotSite(selectedSpot);

    return e(
      "div",
      { className: "index jinja-result-main" },
      e("div", { className: "deco" }, e("img", { src: "/images/deco.png", alt: "" })),
      e("div", { className: "spot-image" }, e(SpotImage, { spotId: selectedSpot.spotID, alt: selectedSpot.spot })),
      e(
        "div",
        { className: "spot-info" },
        e(
          "div",
          { className: "spot-name-items" },
          e("h1", { className: "spot-id" }, selectedSpot.spot),
          e("p", { className: "spot-hiragana" }, selectedSpot.spotHiragana)
        ),
        e("div", { className: "spot-catch" }, selectedSpot.spotCatch),
        selectedBlessing
          ? e("p", { className: "jinja-step-note" }, `ご利益：${selectedBlessing.blessing}`)
          : null,
        e("div", { className: "spot-desc" }, selectedSpot.spotDesc),
        e("hr", null),
        e("div", { className: "addr" }, `📌${selectedSpot.addr}`),
        e(
          "div",
          { className: "spot-site" },
          spotSite
            ? e(
                "a",
                {
                  href: spotSite,
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                `公式サイトへ`
              )
            : null
        )
      ),
      e(
        "div",
        { className: "jinja-step-actions" },
        e(
          "button",
          {
            className: "random-btn",
            type: "button",
            onClick: resetSearch,
          },
          "最初から探す"
        )
      )
    );
  }

  if (loading) {
    return e("h1", { className: "jinjasagashi" }, "読み込み中...");
  }

  if (stepLoading) {
    return renderStepLoading();
  }

  if (error) {
    return e("p", { className: "jinja-step-note" }, error);
  }

  if (!db) {
    return null;
  }

  if (step === 1) {
    return renderStep1();
  }

  if (step === 2) {
    return renderStep2();
  }

  return renderResult();
}

export default function JinjaSagashiPage() {
  const location = useLocation();
  const presetBlessingId = React.useMemo(() => {
    const raw = new URLSearchParams(location.search).get("blessing");
    if (!raw) {
      return null;
    }

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }, [location.search]);

  return (
    <PageLayout
      pageTitle="神社探し | 十二支詣"
      titleImage="/images/title-jinjasagashi.png"
      titleAlt="神社探し"
    >
      <main className="whole">
        <JinjaSagashiApp presetBlessingId={presetBlessingId} />
      </main>
    </PageLayout>
  );
}
