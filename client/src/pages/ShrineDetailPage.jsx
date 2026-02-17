import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

function getSpotSite(spot) {
  return spot.spotSite || spot["Unnamed: 7"] || "";
}

function SpotImage({ spotId, alt }) {
  const [src, setSrc] = useState(`/images/spot${spotId}.jpg`);

  useEffect(() => {
    setSrc(`/images/spot${spotId}.jpg`);
  }, [spotId]);

  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        if (src.endsWith(".jpg")) {
          setSrc(`/images/spot${spotId}.png`);
        }
      }}
    />
  );
}

export default function ShrineDetailPage() {
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch("/data/database.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to load database");
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) {
          return;
        }

        const foundSpot = (data.spots || []).find(
          (item) => Number(item.spotID) === Number(spotId)
        );

        if (!foundSpot) {
          setError("ご縁は、もう少し先のようです……");
        } else {
          setSpot(foundSpot);
        }

        setLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setError("神社データの読み込みに失敗しました。");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [spotId]);

  const pageTitle = spot ? `${spot.spot} | 十二支詣` : "神社詳細 | 十二支詣";

  return (
    <PageLayout
      pageTitle={pageTitle}
      titleImage="/images/title-jinjasagashi.png"
      titleAlt="神社探し"
    >
      <div className="main-area">
        <main className="index">
          {loading ? (
            <h1 className="jinjasagashi">読み込み中...</h1>
          ) : error ? (
            <p className="jinja-step-note">{error}</p>
          ) : (
            <>
              <div className="deco">
                <img src="/images/deco.png" alt="飾り" />
              </div>
              <div className="spot-image">
                <SpotImage spotId={spot.spotID} alt={spot.spot} />
              </div>
              <div className="spot-info">
                <div className="spot-name-items">
                  <h1 className="spot-id">{spot.spot}</h1>
                  <p className="spot-hiragana">{spot.spotHiragana}</p>
                </div>
                <div className="spot-catch">{spot.spotCatch}</div>
                <div className="spot-desc">{spot.spotDesc}</div>
                <hr />
                <div className="addr">📌{spot.addr}</div>
                <div className="spot-site">
                  {getSpotSite(spot) ? (
                    <a href={getSpotSite(spot)} target="_blank" rel="noopener noreferrer">
                      {getSpotSite(spot)}
                    </a>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </PageLayout>
  );
}
