(function () {
    const e = React.createElement;
    const useEffect = React.useEffect;
    const useMemo = React.useMemo;
    const useState = React.useState;

    const ZODIACS = [
        { id: "1", name: "子" },
        { id: "2", name: "丑" },
        { id: "3", name: "寅" },
        { id: "4", name: "卯" },
        { id: "5", name: "辰" },
        { id: "6", name: "巳" },
        { id: "7", name: "午" },
        { id: "8", name: "未" },
        { id: "9", name: "申" },
        { id: "10", name: "酉" },
        { id: "11", name: "戌" },
        { id: "12", name: "亥" }
    ];

    function getSpotImage(spotId) {
        return "images/spot" + spotId + ".jpg";
    }

    function SpotImage(props) {
        const spotId = props.spotId;
        const alt = props.alt;
        const [src, setSrc] = useState(getSpotImage(spotId));

        useEffect(function () {
            setSrc(getSpotImage(spotId));
        }, [spotId]);

        return e("img", {
            src: src,
            alt: alt,
            onError: function () {
                if (src.endsWith(".jpg")) {
                    setSrc("images/spot" + spotId + ".webp");
                    return;
                }
                if (src.endsWith(".webp")) {
                    setSrc("images/spot" + spotId + ".png");
                }
            }
        });
    }

    function App() {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [spots, setSpots] = useState([]);
        const [step, setStep] = useState(1);
        const [selectedZodiac, setSelectedZodiac] = useState("");
        const [selectedSpot, setSelectedSpot] = useState(null);

        useEffect(function () {
            let mounted = true;
            fetch("databaselite.json")
                .then(function (res) {
                    if (!res.ok) {
                        throw new Error("Failed to load databaselite.json");
                    }
                    return res.json();
                })
                .then(function (data) {
                    if (!mounted) {
                        return;
                    }
                    setSpots(Array.isArray(data.spots) ? data.spots : []);
                    setLoading(false);
                })
                .catch(function () {
                    if (!mounted) {
                        return;
                    }
                    setError("データの読み込みに失敗しました。ローカルサーバーで開いてください。");
                    setLoading(false);
                });

            return function () {
                mounted = false;
            };
        }, []);

        const shrineCandidates = useMemo(function () {
            if (!selectedZodiac) {
                return [];
            }
            return spots.filter(function (spot) {
                return spot.zodiacID === selectedZodiac;
            });
        }, [spots, selectedZodiac]);

        function pickRandom() {
            if (!spots.length) {
                return;
            }
            const randomIndex = Math.floor(Math.random() * spots.length);
            setSelectedSpot(spots[randomIndex]);
            setStep(4);
        }

        function resetSearch() {
            setSelectedZodiac("");
            setSelectedSpot(null);
            setStep(1);
        }

        function renderStep1() {
            return e(
                React.Fragment,
                null,
                e("div", { className: "page-icon" }, e("img", { src: "images/icon-torii.png", alt: "" })),
                e("h1", { className: "jinjasagashi" }, "干支を選んでね！"),
                e(
                    "div",
                    { className: "select-step1 justify-wrapper" },
                    ZODIACS.map(function (zodiac) {
                        return e(
                            "button",
                            {
                                key: zodiac.id,
                                type: "button",
                                className: "select-step1-item zodiac-pick-btn",
                                onClick: function () {
                                    setSelectedZodiac(zodiac.id);
                                    setSelectedSpot(null);
                                    setStep(2);
                                }
                            },
                            e("img", {
                                src: "images/zodiacA" + zodiac.id + ".png",
                                alt: zodiac.name
                            })
                        );
                    })
                ),
                e(
                    "button",
                    {
                        id: "randomShrineBtn",
                        className: "random-btn",
                        type: "button",
                        onClick: pickRandom
                    },
                    "気ままに行こう！"
                )
            );
        }

        function renderStep2() {
            const zodiacLabel = ZODIACS.find(function (z) {
                return z.id === selectedZodiac;
            });

            return e(
                React.Fragment,
                null,
                e("div", { className: "page-icon" }, e("img", { src: "images/icon-torii.png", alt: "" })),
                e("h1", { className: "jinjasagashi" }, "STEP 2 - 神社を選ぼう"),
                e("p", { className: "jinja-step-note" }, (zodiacLabel ? zodiacLabel.name : "") + "にゆかりのある神社です。"),
                e(
                    "div",
                    { className: "select-step2 justify-wrapper" },
                    shrineCandidates.map(function (spot) {
                        return e(
                            "button",
                            {
                                key: spot.spotID,
                                type: "button",
                                className: "select-step2-item shrine-card-btn",
                                onClick: function () {
                                    setSelectedSpot(spot);
                                    setStep(3);
                                }
                            },
                            e("h3", null, spot.spot),
                            e("p", null, spot.spotCatch)
                        );
                    })
                ),
                !shrineCandidates.length
                    ? e("p", { className: "jinja-step-note" }, "対応する神社データが見つかりません。")
                    : null,
                e(
                    "button",
                    {
                        className: "retry-btn",
                        type: "button",
                        onClick: function () {
                            setStep(1);
                        }
                    },
                    "干支選択に戻る"
                )
            );
        }

        function renderStep3() {
            if (!selectedSpot) {
                return null;
            }

            return e(
                React.Fragment,
                null,
                e("div", { className: "page-icon" }, e("img", { src: "images/icon-torii.png", alt: "" })),
                e("h1", { className: "jinjasagashi" }, "STEP 3 - 最終確認"),
                e(
                    "div",
                    { className: "index-func shrine-preview" },
                    e("h3", null, selectedSpot.spot),
                    e("p", null, selectedSpot.spotHiragana),
                    e("p", null, selectedSpot.spotCatch),
                    e("p", null, "📌" + selectedSpot.addr)
                ),
                e(
                    "div",
                    { className: "jinja-step-actions" },
                    e(
                        "button",
                        {
                            className: "retry-btn",
                            type: "button",
                            onClick: function () {
                                setStep(2);
                            }
                        },
                        "候補選択に戻る"
                    ),
                    e(
                        "button",
                        {
                            className: "random-btn",
                            type: "button",
                            onClick: function () {
                                setStep(4);
                            }
                        },
                        "この神社に決める"
                    )
                )
            );
        }

        function renderResult() {
            if (!selectedSpot) {
                return null;
            }

            return e(
                "div",
                { className: "main-area" },
                e(
                    "main",
                    { className: "index" },
                    e("div", { className: "deco" }, e("img", { src: "images/deco.png", alt: "" })),
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
                        e("div", { className: "spot-desc" }, selectedSpot.spotDesc),
                        e("hr", null),
                        e("div", { className: "addr" }, "📌" + selectedSpot.addr),
                        e(
                            "div",
                            { className: "spot-site" },
                            e(
                                "a",
                                {
                                    href: selectedSpot.spotSite,
                                    target: "_blank",
                                    rel: "noopener noreferrer"
                                },
                                selectedSpot.spotSite
                            )
                        )
                    ),
                    e(
                        "div",
                        { className: "jinja-step-actions" },
                        e(
                            "button",
                            {
                                className: "retry-btn",
                                type: "button",
                                onClick: function () {
                                    setStep(2);
                                }
                            },
                            "この干支でもう一度探す"
                        ),
                        e(
                            "button",
                            {
                                className: "random-btn",
                                type: "button",
                                onClick: resetSearch
                            },
                            "最初から探す"
                        )
                    )
                )
            );
        }

        if (loading) {
            return e("h1", { className: "jinjasagashi" }, "読み込み中...");
        }

        if (error) {
            return e("p", { className: "jinja-step-note" }, error);
        }

        if (step === 1) {
            return renderStep1();
        }

        if (step === 2) {
            return renderStep2();
        }

        if (step === 3) {
            return renderStep3();
        }

        return renderResult();
    }

    const mountNode = document.getElementById("jinjasagashi-spa-root");
    if (mountNode) {
        const root = ReactDOM.createRoot(mountNode);
        root.render(e(App));
    }
})();
