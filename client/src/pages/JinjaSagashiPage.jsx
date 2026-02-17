import React, { useEffect, useRef, useState } from "react";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const e = React.createElement;
const STEP_TRANSITION_MS = 420;

function getSpotImage(spotId) {
  return `/images/spot${spotId}.jpg`;
}

function getZodiacImage(zodiacId, face) {
  return `/images/jinjasagashi/zodiac${face}${zodiacId}.png`;
}

function runZodiacFlip(imgEl, zodiacId, toFace) {
  if (imgEl.__flipTimer) {
    clearTimeout(imgEl.__flipTimer);
  }

  imgEl.style.opacity = "0";
  imgEl.__flipTimer = setTimeout(() => {
    imgEl.src = getZodiacImage(zodiacId, toFace);
    imgEl.style.opacity = "1";
    imgEl.__flipTimer = null;
  }, 200);
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

function JinjaSagashiApp() {
  const [loading, setLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [error, setError] = useState("");
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
      setBlessingChoices(pickRandomItems(pool, 4));
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
      setError("この条件に合う神社が見つかりませんでした。");
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
      e("p", { className: "jinja-loading-text" }, "次の神社へご案内中...")
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
            e("img", {
              src: getZodiacImage(zodiac.zodiacID, "A"),
              alt: zodiac.name,
              onMouseEnter: (event) => {
                const img = event.currentTarget;
                runZodiacFlip(img, zodiac.zodiacID, "B");
              },
              onMouseLeave: (event) => {
                const img = event.currentTarget;
                runZodiacFlip(img, zodiac.zodiacID, "A");
              },
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
                spotSite
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
  return (
    <PageLayout
      pageTitle="神社探し | 十二支詣"
      titleImage="/images/title-jinjasagashi.png"
      titleAlt="神社探し"
    >
      <main className="whole">
        <JinjaSagashiApp />
      </main>
    </PageLayout>
  );
}
