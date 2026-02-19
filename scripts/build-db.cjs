const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

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

function buildDatabase() {
  const rootDir = path.resolve(__dirname, "..");
  const sourcePath = path.join(rootDir, "client", "public", "data", "database.json");
  const dbDir = path.join(rootDir, "data", "db");
  const dbPath = path.join(dbDir, "database.sqlite");

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source JSON not found: ${sourcePath}`);
  }

  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  const zodiacs = (source.zodiacs || []).map((item) => ({
    zodiacID: Number(item.zodiacID),
    name: item.name,
    animal: item.animal,
    ruby: item.ruby || ZODIAC_RUBY_BY_ID[Number(item.zodiacID)] || "",
  }));

  const blessings = (source.blessings || []).map((item) => ({
    blessingID: Number(item.blessingID || item.bleesingID),
    blessing: item.blessing,
    blessingEn: item.blessingEn || "",
  }));

  const spots = (source.spots || []).map((item) => ({
    spotID: Number(item.spotID),
    zodiacID: Number(item.zodiacID),
    spot: item.spot,
    spotHiragana: item.spotHiragana || "",
    addr: item.addr || "",
    spotCatch: item.spotCatch || "",
    spotDesc: item.spotDesc || "",
    spotSite: item.spotSite || item["Unnamed: 7"] || "",
  }));

  const spotBlessing = (source.spot_blessing || []).map((item) => ({
    spotID: Number(item.spotID),
    blessingID: Number(item.blessingID || item.bleesingID),
  }));

  const proverbs = (source.proverbs || []).map((item) => ({
    proverbID: Number(item.proverbID),
    proverb: item.proverb || "",
    hiragana: item.hiragana || "",
    proverbDesc: item.proverbDesc || "",
  }));

  const zodiacProverb = (source.zodiac_proverb || []).map((item) => ({
    zodiacID: Number(item.zodiacID),
    proverbID: Number(item.proverbID),
  }));

  const aboutTerms = (source.about_terms || []).map((item) => ({
    term: item.term,
    ruby: item.ruby || "",
    termDesc: item.termDesc || "",
    sortOrder: Number(item.sortOrder),
  }));

  if (!aboutTerms.length) {
    throw new Error("`about_terms` is missing or empty in client/public/data/database.json");
  }

  fs.mkdirSync(dbDir, { recursive: true });

  const db = new DatabaseSync(dbPath);

  db.exec(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS spot_blessing;
    DROP TABLE IF EXISTS zodiac_proverb;
    DROP TABLE IF EXISTS about_terms;
    DROP TABLE IF EXISTS spots;
    DROP TABLE IF EXISTS blessings;
    DROP TABLE IF EXISTS proverbs;
    DROP TABLE IF EXISTS zodiacs;

    CREATE TABLE zodiacs (
      zodiacID INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      animal TEXT NOT NULL,
      ruby TEXT NOT NULL
    );

    CREATE TABLE blessings (
      blessingID INTEGER PRIMARY KEY,
      blessing TEXT NOT NULL,
      blessingEn TEXT NOT NULL
    );

    CREATE TABLE spots (
      spotID INTEGER PRIMARY KEY,
      zodiacID INTEGER NOT NULL,
      spot TEXT NOT NULL,
      spotHiragana TEXT NOT NULL,
      addr TEXT NOT NULL,
      spotCatch TEXT NOT NULL,
      spotDesc TEXT NOT NULL,
      spotSite TEXT NOT NULL,
      FOREIGN KEY (zodiacID) REFERENCES zodiacs(zodiacID)
    );

    CREATE TABLE spot_blessing (
      spotID INTEGER NOT NULL,
      blessingID INTEGER NOT NULL,
      PRIMARY KEY (spotID, blessingID)
    );

    CREATE TABLE proverbs (
      proverbID INTEGER PRIMARY KEY,
      proverb TEXT NOT NULL,
      hiragana TEXT NOT NULL,
      proverbDesc TEXT NOT NULL
    );

    CREATE TABLE zodiac_proverb (
      zodiacID INTEGER NOT NULL,
      proverbID INTEGER NOT NULL,
      PRIMARY KEY (zodiacID, proverbID),
      FOREIGN KEY (zodiacID) REFERENCES zodiacs(zodiacID),
      FOREIGN KEY (proverbID) REFERENCES proverbs(proverbID)
    );

    CREATE TABLE about_terms (
      term TEXT PRIMARY KEY,
      ruby TEXT NOT NULL,
      termDesc TEXT NOT NULL,
      sortOrder INTEGER NOT NULL
    );

    CREATE INDEX idx_spots_zodiac ON spots(zodiacID);
    CREATE INDEX idx_spot_blessing_blessing ON spot_blessing(blessingID);
    CREATE INDEX idx_zodiac_proverb_proverb ON zodiac_proverb(proverbID);

    PRAGMA foreign_keys = ON;
  `);

  const insertZodiac = db.prepare(
    "INSERT INTO zodiacs (zodiacID, name, animal, ruby) VALUES (?, ?, ?, ?)"
  );
  const insertBlessing = db.prepare(
    "INSERT INTO blessings (blessingID, blessing, blessingEn) VALUES (?, ?, ?)"
  );
  const insertSpot = db.prepare(
    "INSERT INTO spots (spotID, zodiacID, spot, spotHiragana, addr, spotCatch, spotDesc, spotSite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertSpotBlessing = db.prepare(
    "INSERT INTO spot_blessing (spotID, blessingID) VALUES (?, ?)"
  );
  const insertProverb = db.prepare(
    "INSERT INTO proverbs (proverbID, proverb, hiragana, proverbDesc) VALUES (?, ?, ?, ?)"
  );
  const insertZodiacProverb = db.prepare(
    "INSERT INTO zodiac_proverb (zodiacID, proverbID) VALUES (?, ?)"
  );
  const insertAboutTerm = db.prepare(
    "INSERT INTO about_terms (term, ruby, termDesc, sortOrder) VALUES (?, ?, ?, ?)"
  );

  db.exec("BEGIN");
  try {
    for (const item of zodiacs) {
      insertZodiac.run(item.zodiacID, item.name, item.animal, item.ruby);
    }

    for (const item of blessings) {
      insertBlessing.run(item.blessingID, item.blessing, item.blessingEn);
    }

    for (const item of spots) {
      insertSpot.run(
        item.spotID,
        item.zodiacID,
        item.spot,
        item.spotHiragana,
        item.addr,
        item.spotCatch,
        item.spotDesc,
        item.spotSite
      );
    }

    for (const item of spotBlessing) {
      insertSpotBlessing.run(item.spotID, item.blessingID);
    }

    for (const item of proverbs) {
      insertProverb.run(item.proverbID, item.proverb, item.hiragana, item.proverbDesc);
    }

    for (const item of zodiacProverb) {
      insertZodiacProverb.run(item.zodiacID, item.proverbID);
    }

    for (const item of aboutTerms) {
      insertAboutTerm.run(item.term, item.ruby, item.termDesc, item.sortOrder);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.close();
  }

  return {
    dbPath,
    sourcePath,
    inserted: {
      zodiacs: zodiacs.length,
      blessings: blessings.length,
      spots: spots.length,
      spot_blessing: spotBlessing.length,
      proverbs: proverbs.length,
      zodiac_proverb: zodiacProverb.length,
      about_terms: aboutTerms.length,
    },
  };
}

if (require.main === module) {
  const result = buildDatabase();
  console.log("Built SQLite database:", result);
}

module.exports = {
  buildDatabase,
};
