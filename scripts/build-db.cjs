const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { syncJsonSources } = require("./sync-json-sources.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildDatabase() {
  const rootDir = path.resolve(__dirname, "..");
  const jsonDir = path.join(rootDir, "data", "json");
  const dbDir = path.join(rootDir, "data", "db");
  const dbPath = path.join(dbDir, "content.sqlite");

  const syncedCounts = syncJsonSources();

  const zodiacs = readJson(path.join(jsonDir, "zodiacs.json"));
  const blessings = readJson(path.join(jsonDir, "blessings.json"));
  const spots = readJson(path.join(jsonDir, "spots.json"));
  const spotBlessing = readJson(path.join(jsonDir, "spot_blessing.json"));
  const proverbs = readJson(path.join(jsonDir, "proverbs.json"));
  const zodiacProverb = readJson(path.join(jsonDir, "zodiac_proverb.json"));
  const aboutTerms = readJson(path.join(jsonDir, "about_terms.json"));
  const featuredBlessings = readJson(path.join(jsonDir, "featured_blessings.json"));

  fs.mkdirSync(dbDir, { recursive: true });

  const db = new DatabaseSync(dbPath);

  db.exec(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS spot_blessing;
    DROP TABLE IF EXISTS zodiac_proverb;
    DROP TABLE IF EXISTS featured_blessings;
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

    CREATE TABLE featured_blessings (
      sortOrder INTEGER PRIMARY KEY,
      toPath TEXT NOT NULL,
      image TEXT NOT NULL,
      alt TEXT NOT NULL
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
  const insertFeaturedBlessing = db.prepare(
    "INSERT INTO featured_blessings (sortOrder, toPath, image, alt) VALUES (?, ?, ?, ?)"
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

    for (const item of featuredBlessings) {
      insertFeaturedBlessing.run(item.sortOrder, item.to, item.image, item.alt);
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
    syncedCounts,
    inserted: {
      zodiacs: zodiacs.length,
      blessings: blessings.length,
      spots: spots.length,
      spot_blessing: spotBlessing.length,
      proverbs: proverbs.length,
      zodiac_proverb: zodiacProverb.length,
      about_terms: aboutTerms.length,
      featured_blessings: featuredBlessings.length,
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
