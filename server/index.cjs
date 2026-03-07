const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { URL } = require("node:url");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 8787);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "db", "database.sqlite");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(text);
}

if (!fs.existsSync(DB_PATH)) {
  console.error(`Database not found: ${DB_PATH}`);
  console.error("Run `npm run db:build` first.");
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);

const qAllZodiacs = db.prepare(
  "SELECT zodiacID, name, animal, ruby, symbol, messenger, personality FROM zodiacs ORDER BY zodiacID"
);
const qAllZodiacBlessing = db.prepare(
  "SELECT zodiacID, blessingID, sortOrder FROM zodiac_blessing ORDER BY zodiacID, sortOrder, blessingID"
);
const qAllZodiacSpot = db.prepare(
  "SELECT zs.zodiacID, zs.spotID, zs.sortOrder, zs.isFeatured, s.spot FROM zodiac_spot zs JOIN spots s ON s.spotID = zs.spotID ORDER BY zs.zodiacID, zs.sortOrder, zs.spotID"
);
const qAllBlessings = db.prepare(
  "SELECT blessingID, blessing, blessingEn FROM blessings ORDER BY blessingID"
);
const qAllSpots = db.prepare(
  "SELECT spotID, zodiacID, spot, spotHiragana, addr, spotCatch, spotDesc, spotSite FROM spots ORDER BY spotID"
);
const qAllSpotBlessing = db.prepare(
  "SELECT spotID, blessingID FROM spot_blessing ORDER BY spotID, blessingID"
);
const qSpotById = db.prepare(
  "SELECT spotID, zodiacID, spot, spotHiragana, addr, spotCatch, spotDesc, spotSite FROM spots WHERE spotID = ?"
);
const qRandomProverb = db.prepare(
  "SELECT proverbID, proverb, hiragana, proverbDesc FROM proverbs ORDER BY RANDOM() LIMIT 1"
);
const qAboutTerms = db.prepare(
  "SELECT term, ruby, termDesc FROM about_terms ORDER BY sortOrder"
);

function parseJsonArray(raw) {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hydrateZodiacs(rows) {
  const blessingRows = qAllZodiacBlessing.all();
  const spotRows = qAllZodiacSpot.all();
  const blessingIdsByZodiac = new Map();
  const featuredSpotsByZodiac = new Map();
  const fallbackSpotsByZodiac = new Map();

  for (const item of blessingRows) {
    const zodiacID = Number(item.zodiacID);
    if (!blessingIdsByZodiac.has(zodiacID)) blessingIdsByZodiac.set(zodiacID, []);
    blessingIdsByZodiac.get(zodiacID).push(Number(item.blessingID));
  }

  for (const item of spotRows) {
    const zodiacID = Number(item.zodiacID);
    if (!fallbackSpotsByZodiac.has(zodiacID)) fallbackSpotsByZodiac.set(zodiacID, []);
    fallbackSpotsByZodiac.get(zodiacID).push(item.spot);
    if (Number(item.isFeatured) === 1) {
      if (!featuredSpotsByZodiac.has(zodiacID)) featuredSpotsByZodiac.set(zodiacID, []);
      featuredSpotsByZodiac.get(zodiacID).push(item.spot);
    }
  }

  return rows.map((row) => {
    const zodiacID = Number(row.zodiacID);
    const featuredSpots = featuredSpotsByZodiac.get(zodiacID) || [];
    const fallbackSpots = fallbackSpotsByZodiac.get(zodiacID) || [];
    return {
      ...row,
      symbol: parseJsonArray(row.symbol),
      related_blessings: blessingIdsByZodiac.get(zodiacID) || [],
      related_spots: featuredSpots.length ? featuredSpots : fallbackSpots.slice(0, 2),
    };
  });
}

function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === "/api/zodiacs") {
    sendJson(res, 200, hydrateZodiacs(qAllZodiacs.all()));
    return;
  }

  if (pathname === "/api/about/terms") {
    sendJson(res, 200, qAboutTerms.all());
    return;
  }

  if (pathname === "/api/proverbs/random") {
    const proverb = qRandomProverb.get();
    if (!proverb) {
      sendJson(res, 404, { error: "No proverb found" });
      return;
    }
    sendJson(res, 200, proverb);
    return;
  }

  if (pathname === "/api/jinja-sagashi/bootstrap") {
    sendJson(res, 200, {
      zodiacs: hydrateZodiacs(qAllZodiacs.all()),
      blessings: qAllBlessings.all(),
      spots: qAllSpots.all(),
      zodiac_blessing: qAllZodiacBlessing.all(),
      zodiac_spot: qAllZodiacSpot.all(),
      spot_blessing: qAllSpotBlessing.all(),
    });
    return;
  }

  const spotMatch = pathname.match(/^\/api\/spots\/(\d+)$/);
  if (spotMatch) {
    const spot = qSpotById.get(Number(spotMatch[1]));
    if (!spot) {
      sendJson(res, 404, { error: "Spot not found" });
      return;
    }
    sendJson(res, 200, spot);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      handleApi(req, res, url.pathname);
      return;
    }

    sendText(res, 404, "ここは霧に包まれたようです。");
  } catch (error) {
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`Using SQLite database: ${DB_PATH}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
