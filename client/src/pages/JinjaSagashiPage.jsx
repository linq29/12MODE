import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BlurReveal from "../components/common/BlurReveal";
import EmphasisLink from "../components/common/EmphasisLink";
import FlipImage from "../components/common/FlipImage";
import GoldenButton from "../components/common/GoldenButton";
import LoadingScreen from "../components/common/LoadingScreen";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

const e = React.createElement;
const STEP_TRANSITION_MS = 1200;

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
  return `/images/spot/spot${spotId}.webp`;
}

function getSpotSite(spot) {
  return spot.spotSite || spot["Unnamed: 7"] || "";
}

function SpotImage(props) {
  const { spotId, alt } = props;
  return e("img", {
    src: getSpotImage(spotId),
    alt,
  });
}

function JinjaSagashiApp(props) {
  const { presetBlessingId } = props;
  const [loading, setLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [fatalError, setFatalError] = useState("");
  const [stepNotice, setStepNotice] = useState("");
  const [db, setDb] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [candidateSpotIds, setCandidateSpotIds] = useState(new Set());
  const [blessingChoices, setBlessingChoices] = useState([]);
  const [blessingRevealCycle, setBlessingRevealCycle] = useState(0);
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

        setFatalError("データの読み込みに失敗しました。");
        // APIサーバーを確認してください。
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

  function getSpotScope(zodiacId) {
    if (!db || !Array.isArray(db.spots)) {
      return [];
    }

    if (!zodiacId) {
      return db.spots;
    }

    return getZodiacSpots(zodiacId);
  }

  function getBlessingPoolForSpotScope(spotIdSet) {
    if (
      !db ||
      !Array.isArray(db.spot_blessing) ||
      !spotIdSet ||
      !spotIdSet.size
    ) {
      return [];
    }

    const blessingIdSet = new Set(
      db.spot_blessing
        .filter((row) => spotIdSet.has(Number(row.spotID)))
        .map((row) => Number(row.blessingID))
    );

    return (db.blessings || []).filter((blessing) =>
      blessingIdSet.has(getBlessingId(blessing))
    );
  }

  function pickBlessingChoices(pool) {
    const randomChoices = pickRandomItems(pool, 4);

    if (!presetBlessingId || !randomChoices.length) {
      return randomChoices;
    }

    const presetBlessing = pool.find(
      (blessing) => getBlessingId(blessing) === presetBlessingId
    );

    if (!presetBlessing) {
      return randomChoices;
    }

    if (
      randomChoices.some(
        (blessing) => getBlessingId(blessing) === getBlessingId(presetBlessing)
      )
    ) {
      return randomChoices;
    }

    if (randomChoices.length < 4) {
      return randomChoices.concat(presetBlessing);
    }

    const replacedChoices = randomChoices.slice();
    replacedChoices[replacedChoices.length - 1] = presetBlessing;
    return replacedChoices;
  }

  function prepareBlessingStep(zodiacId) {
    const scopeSpots = getSpotScope(zodiacId);
    const scopeSpotIdSet = new Set(scopeSpots.map((spot) => Number(spot.spotID)));
    const pool = getBlessingPoolForSpotScope(scopeSpotIdSet);

    const next = () => {
      if (presetBlessingId) {
        const hasPresetBlessing = pool.some(
          (blessing) => getBlessingId(blessing) === presetBlessingId
        );

        setStepNotice(
          hasPresetBlessing
            ? "旧ルート指定のご利益を候補に含めました。"
            : "指定されたご利益はこの条件に対応していないため、候補を再抽選しました。"
        );
      } else {
        setStepNotice("");
      }

      setFatalError("");
      setCandidateSpotIds(scopeSpotIdSet);
      setBlessingRevealCycle((prev) => prev + 1);
      setBlessingChoices(pickBlessingChoices(pool));
      setSelectedBlessing(null);
      setSelectedSpot(null);
      setSelectedZodiac(zodiacId || null);
      setStep(2);
    };

    next();
  }

  function refreshBlessingChoices() {
    const pool = getBlessingPoolForSpotScope(candidateSpotIds);
    setBlessingRevealCycle((prev) => prev + 1);
    setBlessingChoices(pickBlessingChoices(pool));
  }

  function selectBlessingAndPickShrine(blessing) {
    if (
      !db ||
      !Array.isArray(db.spot_blessing) ||
      !candidateSpotIds ||
      !candidateSpotIds.size
    ) {
      return;
    }

    const selectedBlessingId = getBlessingId(blessing);

    const matchedSpotIdSet = new Set(
      db.spot_blessing
        .filter(
          (row) =>
            Number(row.blessingID) === selectedBlessingId &&
            candidateSpotIds.has(Number(row.spotID))
        )
        .map((row) => Number(row.spotID))
    );

    const matchedSpots = (db.spots || []).filter((spot) =>
      matchedSpotIdSet.has(Number(spot.spotID))
    );

    if (!matchedSpots.length) {
      setStepNotice("今はまだ、導かれるべき道が見つからないようです。");
      return;
    }

    const randomSpot = matchedSpots[Math.floor(Math.random() * matchedSpots.length)];

    runStepTransition(() => {
      setStepNotice("");
      setSelectedBlessing(blessing);
      setSelectedSpot(randomSpot);
      setStep(3);
    });
  }

  function resetSearch() {
    setFatalError("");
    setStepNotice("");
    setSelectedZodiac(null);
    setCandidateSpotIds(new Set());
    setBlessingChoices([]);
    setSelectedBlessing(null);
    setSelectedSpot(null);
    setStep(1);
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
                prepareBlessingStep(zodiacId);
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
        GoldenButton,
        {
          id: "randomShrineBtn",
          onClick: () => {
            prepareBlessingStep(null);
          },
        },
        "気ままに行こう！"
      )
    );
  }

  function renderStep2() {
    const zodiacData = selectedZodiac
      ? (db.zodiacs || []).find(
          (zodiac) => Number(zodiac.zodiacID) === Number(selectedZodiac)
        )
      : null;

    return e(
      React.Fragment,
      null,
      e(
        "div",
        { className: "page-icon" },
        e("img", {
          src: selectedZodiac ? getZodiacImage(selectedZodiac, "A") : "/images/icon-torii.png",
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
              key: `${getBlessingId(blessing)}-${blessingRevealCycle}`,
              type: "button",
              className: "select-step2-item blessing-pick-btn",
              onClick: () => {
                selectBlessingAndPickShrine(blessing);
              },
            },
            e("img", {
              src: getBlessingImage(blessing),
              alt: blessing.blessing || "",
              className: "blur-reveal is-revealing",
            })
          )
        )
      ),
      !blessingChoices.length
        ? e(
            "p",
            { className: "jinja-step-note" },
            "この条件に対応するご利益データが見つかりません。"
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
          GoldenButton,
          {
            onClick: refreshBlessingChoices,
          },
          "他のご利益を見る"
        ),
        e(
          GoldenButton,
          {
            onClick: resetSearch,
          },
          "干支を選び直す"
        )
      )
    );
  }

  function renderResult() {
    if (!selectedSpot) {
      return null;
    }

    const spotSite = getSpotSite(selectedSpot);
    const zodiacData = selectedZodiac
      ? (db.zodiacs || []).find(
          (zodiac) => Number(zodiac.zodiacID) === Number(selectedZodiac)
        )
      : null;
    const blessingIdSetForSpot = new Set(
      (db.spot_blessing || [])
        .filter((row) => Number(row.spotID) === Number(selectedSpot.spotID))
        .map((row) => Number(row.blessingID))
    );
    const blessingText = (db.blessings || [])
      .filter((blessing) => blessingIdSetForSpot.has(getBlessingId(blessing)))
      .map((blessing) => blessing.blessing)
      .join("、");

    return e(
      BlurReveal,
      { className: "index jinja-result-main", key: `step3-${selectedSpot.spotID}` },
      e("div", { className: "deco" }, e("img", { src: "/images/deco.png", alt: "" })),
      e(
        "div",
        { className: "spot-image" },
        e(SpotImage, { spotId: selectedSpot.spotID, alt: selectedSpot.spot })
      ),
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
        blessingText
          ? e("p", { className: "jinja-step-note-blessing" }, `ご利益：${blessingText}`)
          : null,
        e("div", { className: "spot-desc" }, selectedSpot.spotDesc),
        e("hr", null),
        e("div", { className: "addr" }, `📌${selectedSpot.addr}`),
        e(
          "div",
          { className: "spot-site" },
          spotSite
            ? e(
                EmphasisLink,
                {
                  href: spotSite,
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                "公式サイトへ"
              )
            : null
        )
      ),
      e(
        "div",
        { className: "jinja-step-actions" },
        e(
          GoldenButton,
          {
            onClick: resetSearch,
          },
          "もう一度探す"
        )
      )
    );
  }

  if (loading) {
    return e(LoadingScreen, { message: "読み込み中…" });
  }

  if (stepLoading) {
    return e(LoadingScreen, { message: "次の道へご案内中" });
  }

  if (fatalError) {
    return e("p", { className: "jinja-step-note" }, fatalError);
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
