import { useEffect, useState } from "react";
import SiteFooter from "../components/layout/SiteFooter";
import PageLayout from "../layouts/PageLayout";
import { getJson } from "../lib/api";

export default function AboutPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJson("/api/about/terms")
      .then((data) => {
        setTerms(data);
        setLoading(false);
      })
      .catch(() => {
        setError("サイト紹介データの読み込みに失敗しました。");
        setLoading(false);
      });
  }, []);

  return (
    <PageLayout
      bodyClass="page-about"
      pageTitle="サイト紹介 | 十二支詣"
      titleImage="/images/title-about.png"
      titleAlt="サイト紹介"
    >
      <div className="main-area">
        <main className="about">
          {loading ? (
            <p className="jinja-step-note">読み込み中...</p>
          ) : error ? (
            <p className="jinja-step-note">{error}</p>
          ) : (
            terms.map((item) => (
              <div key={item.term} className="index-func">
                <h3>
                  {item.term}
                  <small>（{item.ruby}）</small>
                </h3>
                <p>{item.termDesc}</p>
              </div>
            ))
          )}
        </main>
        <SiteFooter />
      </div>
    </PageLayout>
  );
}
