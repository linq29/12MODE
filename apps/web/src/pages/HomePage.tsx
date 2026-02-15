import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Shrine } from "@12mode/shared";
import { fetchShrines } from "../lib/api";

export default function HomePage() {
  const [shrines, setShrines] = useState<Shrine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShrines().then(setShrines).catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h2>神社一覧</h2>
      <ul className="shrine-list">
        {shrines.map((shrine) => (
          <li key={shrine.spotId}>
            <Link to={`/shrines/${shrine.spotId}`}>{shrine.name}</Link>
            <p>{shrine.catchCopy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
