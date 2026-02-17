const fs = require("node:fs");
const path = require("node:path");

const ZODIAC_RUBY_BY_ID = {
  1: "ね",
  2: "うし",
  3: "とら",
  4: "う",
  5: "たつ",
  6: "へび",
  7: "うま",
  8: "ひつじ",
  9: "さる",
  10: "とり",
  11: "いぬ",
  12: "い",
};

const ABOUT_TERMS = [
  {
    term: "御利益",
    ruby: "ごりえき",
    termDesc:
      "神社や仏閣で神仏から授かる加護や恩恵のこと。参拝したり、お守りを持ったりすることで、健康・商売繁盛・学業成就などの御利益が得られるとされる。",
    sortOrder: 1,
  },
  {
    term: "狛犬",
    ruby: "こまいぬ",
    termDesc:
      "神社の入口などに対で置かれる獅子のような像。口を開けた阿形（あぎょう）と、口を閉じた吽形（うんぎょう）が対になっており、邪気を払う役割を持つ。狛犬と呼ばれるが、犬の形に限らない。",
    sortOrder: 2,
  },
  {
    term: "十二支",
    ruby: "じゅうにし",
    termDesc:
      "子・丑・寅など12の動物で構成される干支の一部。年や方角、性格占いなどに用いられる。",
    sortOrder: 3,
  },
  {
    term: "神社",
    ruby: "じんじゃ",
    termDesc:
      "神道の神々を祀る施設。鳥居をくぐり、参道を進んで参拝する。祭りや祈願が行われる場所。",
    sortOrder: 4,
  },
  {
    term: "神使",
    ruby: "しんし",
    termDesc:
      "神の使いとされる動物。稲荷神社の狐、天満宮の牛、八幡神社の鳩など、神ごとに異なる動物が定められている。",
    sortOrder: 5,
  },
  {
    term: "生肖",
    ruby: "せいしょう",
    termDesc:
      "中国の十二支を指し、日本の十二支と同様に、年ごとの動物で人の性格や運勢を占う文化がある。",
    sortOrder: 6,
  },
];

const FEATURED_BLESSINGS = [
  {
    to: "/jinja/1",
    image: "/images/jinjasagashi/blessing_gakugyo_joju.png",
    alt: "学業成就",
    sortOrder: 1,
  },
  {
    to: "/jinja/2",
    image: "/images/jinjasagashi/blessing_enmusubi.png",
    alt: "縁結び",
    sortOrder: 2,
  },
  {
    to: "/jinja/3",
    image: "/images/jinjasagashi/blessing_kinun.png",
    alt: "金運",
    sortOrder: 3,
  },
  {
    to: "/jinja/4",
    image: "/images/jinjasagashi/blessing_kaiun.png",
    alt: "開運",
    sortOrder: 4,
  },
];

function writeJson(outputPath, data) {
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function syncJsonSources() {
  const rootDir = path.resolve(__dirname, "..");
  const sourcePath = path.join(rootDir, "client", "public", "data", "database.json");
  const outputDir = path.join(rootDir, "data", "json");

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source JSON not found: ${sourcePath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const db = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  const zodiacs = (db.zodiacs || []).map((item) => ({
    zodiacID: Number(item.zodiacID),
    name: item.name,
    animal: item.animal,
    ruby: item.ruby || ZODIAC_RUBY_BY_ID[Number(item.zodiacID)] || "",
  }));

  const blessings = (db.blessings || []).map((item) => ({
    blessingID: Number(item.blessingID || item.bleesingID),
    blessing: item.blessing,
    blessingEn: item.blessingEn || "",
  }));

  const spots = (db.spots || []).map((item) => ({
    spotID: Number(item.spotID),
    zodiacID: Number(item.zodiacID),
    spot: item.spot,
    spotHiragana: item.spotHiragana || "",
    addr: item.addr || "",
    spotCatch: item.spotCatch || "",
    spotDesc: item.spotDesc || "",
    spotSite: item.spotSite || item["Unnamed: 7"] || "",
  }));

  const spotBlessing = (db.spot_blessing || []).map((item) => ({
    spotID: Number(item.spotID),
    blessingID: Number(item.blessingID || item.bleesingID),
  }));

  const proverbs = (db.proverbs || []).map((item) => ({
    proverbID: Number(item.proverbID),
    proverb: item.proverb || "",
    hiragana: item.hiragana || "",
    proverbDesc: item.proverbDesc || "",
  }));

  const zodiacProverb = (db.zodiac_proverb || []).map((item) => ({
    zodiacID: Number(item.zodiacID),
    proverbID: Number(item.proverbID),
  }));

  writeJson(path.join(outputDir, "zodiacs.json"), zodiacs);
  writeJson(path.join(outputDir, "blessings.json"), blessings);
  writeJson(path.join(outputDir, "spots.json"), spots);
  writeJson(path.join(outputDir, "spot_blessing.json"), spotBlessing);
  writeJson(path.join(outputDir, "proverbs.json"), proverbs);
  writeJson(path.join(outputDir, "zodiac_proverb.json"), zodiacProverb);
  writeJson(path.join(outputDir, "about_terms.json"), ABOUT_TERMS);
  writeJson(path.join(outputDir, "featured_blessings.json"), FEATURED_BLESSINGS);

  return {
    zodiacs: zodiacs.length,
    blessings: blessings.length,
    spots: spots.length,
    spot_blessing: spotBlessing.length,
    proverbs: proverbs.length,
    zodiac_proverb: zodiacProverb.length,
    about_terms: ABOUT_TERMS.length,
    featured_blessings: FEATURED_BLESSINGS.length,
  };
}

if (require.main === module) {
  const counts = syncJsonSources();
  console.log("Synced JSON sources:", counts);
}

module.exports = {
  syncJsonSources,
};
