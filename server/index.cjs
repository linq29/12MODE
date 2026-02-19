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

const qAllZodiacs = db.prepare("SELECT zodiacID, name, animal, ruby FROM zodiacs ORDER BY zodiacID");
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
    sendJson(res, 200, qAllZodiacs.all());
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
      zodiacs: qAllZodiacs.all(),
      blessings: qAllBlessings.all(),
      spots: qAllSpots.all(),
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

    sendText(res, 404, "Not found");
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
