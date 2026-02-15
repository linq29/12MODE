import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./client";

type LiteSpot = {
  spotID: string;
  zodiacID: string;
  spot: string;
  spotHiragana: string;
  addr: string;
  spotCatch: string;
  spotDesc: string;
  spotSite?: string;
};

const zodiacs = [
  { zodiacId: 1, name: "子", animal: "鼠" },
  { zodiacId: 2, name: "丑", animal: "牛" },
  { zodiacId: 3, name: "寅", animal: "虎" },
  { zodiacId: 4, name: "卯", animal: "兎" },
  { zodiacId: 5, name: "辰", animal: "竜" },
  { zodiacId: 6, name: "巳", animal: "蛇" },
  { zodiacId: 7, name: "午", animal: "馬" },
  { zodiacId: 8, name: "未", animal: "羊" },
  { zodiacId: 9, name: "申", animal: "猿" },
  { zodiacId: 10, name: "酉", animal: "鶏" },
  { zodiacId: 11, name: "戌", animal: "犬" },
  { zodiacId: 12, name: "亥", animal: "猪" }
];

async function readSeedSpots() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const sourcePath = path.resolve(here, "../../../../db/seeds/databaselite.json");
  const raw = await fs.readFile(sourcePath, "utf8");
  const parsed = JSON.parse(raw) as { spots: LiteSpot[] };
  return parsed.spots;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const zodiac of zodiacs) {
      await client.query(
        `
          INSERT INTO zodiacs (zodiac_id, name, animal)
          VALUES ($1, $2, $3)
          ON CONFLICT (zodiac_id) DO UPDATE
          SET name = EXCLUDED.name, animal = EXCLUDED.animal
        `,
        [zodiac.zodiacId, zodiac.name, zodiac.animal]
      );
    }

    const spots = await readSeedSpots();

    for (const spot of spots) {
      await client.query(
        `
          INSERT INTO shrines
            (spot_id, zodiac_id, name, hiragana, address, catch_copy, description, site_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (spot_id) DO UPDATE
          SET
            zodiac_id = EXCLUDED.zodiac_id,
            name = EXCLUDED.name,
            hiragana = EXCLUDED.hiragana,
            address = EXCLUDED.address,
            catch_copy = EXCLUDED.catch_copy,
            description = EXCLUDED.description,
            site_url = EXCLUDED.site_url,
            updated_at = NOW()
        `,
        [
          Number(spot.spotID),
          Number(spot.zodiacID),
          spot.spot,
          spot.spotHiragana,
          spot.addr,
          spot.spotCatch,
          spot.spotDesc,
          spot.spotSite ?? null
        ]
      );
    }

    await client.query("COMMIT");
    console.log(`Seed completed: ${spots.length} shrines upserted.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
