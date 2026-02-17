import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

export default function BlessingsPage() {
  const [blessingLinks, setBlessingLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJson("/api/featured-blessings")
      .then((data) => {
        setBlessingLinks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("ご利益データの読み込みに失敗しました。");
        setLoading(false);
      });
  }, []);

  return (
    <PageLayout
      pageTitle="ご利益選択 | 十二支詣"
      titleImage="/images/title-jinjasagashi.png"
      titleAlt="神社探し"
    >
      <main className="whole">
        <div className="page-icon">
          <img src="/images/jinjasagashi/zodiacA1.png" alt="子" />
        </div>
        <h1 className="jinjasagashi">気になるご利益は？</h1>

        {loading ? (
          <p className="jinja-step-note">読み込み中...</p>
        ) : error ? (
          <p className="jinja-step-note">{error}</p>
        ) : (
          <div className="select-step2 justify-wrapper">
            {blessingLinks.map((item) => (
              <div key={item.toPath} className="select-step2-item">
                <Link to={item.toPath}>
                  <img src={item.image} alt={item.alt} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
