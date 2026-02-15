import { Router } from "express";
import type { Shrine } from "@12mode/shared";
import { pool } from "../db/client";

const shrinesRouter = Router();

const shrineSelect = `
  SELECT
    s.spot_id,
    s.zodiac_id,
    z.name AS zodiac_name,
    s.name,
    s.hiragana,
    s.address,
    s.catch_copy,
    s.description,
    s.site_url
  FROM shrines s
  JOIN zodiacs z ON z.zodiac_id = s.zodiac_id
`;

function mapShrine(row: Record<string, unknown>): Shrine {
  return {
    spotId: Number(row.spot_id),
    zodiacId: Number(row.zodiac_id),
    zodiacName: String(row.zodiac_name),
    name: String(row.name),
    hiragana: String(row.hiragana),
    address: String(row.address),
    catchCopy: String(row.catch_copy),
    description: String(row.description),
    siteUrl: row.site_url ? String(row.site_url) : null
  };
}

shrinesRouter.get("/shrines", async (_req, res, next) => {
  try {
    const result = await pool.query(`${shrineSelect} ORDER BY s.spot_id ASC`);
    res.json({ shrines: result.rows.map(mapShrine) });
  } catch (error) {
    next(error);
  }
});

shrinesRouter.get("/shrines/:spotId", async (req, res, next) => {
  try {
    const parsedId = Number(req.params.spotId);
    if (!Number.isInteger(parsedId)) {
      res.status(400).json({ error: "Invalid spotId" });
      return;
    }

    const result = await pool.query(`${shrineSelect} WHERE s.spot_id = $1 LIMIT 1`, [parsedId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({ shrine: mapShrine(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

export default shrinesRouter;
