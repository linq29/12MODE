import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Shrine } from "@12mode/shared";
import { fetchShrine } from "../lib/api";

export default function ShrinePage() {
  const { spotId } = useParams();
  const [shrine, setShrine] = useState<Shrine | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = Number(spotId);
    if (!Number.isInteger(parsedId)) {
      setError("Invalid spotId");
      return;
    }

    fetchShrine(parsedId)
      .then(setShrine)
      .catch((err: Error) => setError(err.message));
  }, [spotId]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (shrine === undefined) {
    return <p>Loading...</p>;
  }

  if (shrine === null) {
    return <p>Not found.</p>;
  }

  return (
    <article>
      <h2>{shrine.name}</h2>
      <p>{shrine.hiragana}</p>
      <p>{shrine.catchCopy}</p>
      <p>{shrine.description}</p>
      <p>{shrine.address}</p>
      {shrine.siteUrl && (
        <p>
          <a href={shrine.siteUrl} target="_blank" rel="noreferrer">
            {shrine.siteUrl}
          </a>
        </p>
      )}
    </article>
  );
}
