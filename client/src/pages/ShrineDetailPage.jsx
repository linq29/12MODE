import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BlurReveal from "../components/common/BlurReveal";
import EmphasisLink from "../components/common/EmphasisLink";
import LoadingMessage from "../components/common/LoadingMessage";

import { SHRINE_DETAIL_LOAD_ERROR_MESSAGE } from "../data/messageText";

import PageLayout from "../layouts/PageLayout";

import { getJson } from "../lib/api";

function getSpotSite(spot) {
  return spot.spotSite || spot["Unnamed: 7"] || "";
}

function getSpotImage(spotId) {
  return `/images/spot/spot${spotId}.webp`;
}

function SpotImage({ spotId, alt }) {
  return <img src={getSpotImage(spotId)} alt={alt} />;
}

export default function ShrineDetailPage() {
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    let mounted = true;

    getJson(`/api/spots/${spotId}`)
      .then((foundSpot) => {
        if (!mounted) {
          return;
        }

        setSpot(foundSpot);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setError(SHRINE_DETAIL_LOAD_ERROR_MESSAGE);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [spotId]);

  const pageTitle = spot ? spot.spot : "神社詳細";

  return (
    <PageLayout
      pageTitle={pageTitle}
      titleImage="/images/title-jinjasagashi.png"
      titleAlt="神社探し"
    >
      <div className="main-area">
        <main className="index">
          {loading ? (
            <LoadingMessage as="h1" className="jinjasagashi" />
          ) : error ? (
            <p className="jinja-step-note">{error}</p>
          ) : (
            <>
              <BlurReveal className="deco" key={`detail-deco-${spot.spotID}`}>
                <img src="/images/deco.webp" alt="飾り" />
              </BlurReveal>
              <BlurReveal className="spot-image" key={`detail-image-${spot.spotID}`}>
                <SpotImage spotId={spot.spotID} alt={spot.spot} />
              </BlurReveal>
              <BlurReveal className="spot-info" key={`detail-info-${spot.spotID}`}>
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
                    <EmphasisLink
                      href={getSpotSite(spot)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      公式サイトへ
                    </EmphasisLink>
                  ) : null}
                </div>
              </BlurReveal>
            </>
          )}
        </main>
      </div>
    </PageLayout>
  );
}
