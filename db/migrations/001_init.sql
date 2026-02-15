CREATE TABLE IF NOT EXISTS zodiacs (
  zodiac_id SMALLINT PRIMARY KEY,
  name TEXT NOT NULL,
  animal TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blessings (
  blessing_id SMALLINT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS shrines (
  spot_id INTEGER PRIMARY KEY,
  zodiac_id SMALLINT NOT NULL REFERENCES zodiacs(zodiac_id),
  name TEXT NOT NULL,
  hiragana TEXT NOT NULL,
  address TEXT NOT NULL,
  catch_copy TEXT NOT NULL,
  description TEXT NOT NULL,
  site_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shrine_blessings (
  spot_id INTEGER NOT NULL REFERENCES shrines(spot_id) ON DELETE CASCADE,
  blessing_id SMALLINT NOT NULL REFERENCES blessings(blessing_id),
  PRIMARY KEY (spot_id, blessing_id)
);

CREATE INDEX IF NOT EXISTS idx_shrines_zodiac_id ON shrines(zodiac_id);
