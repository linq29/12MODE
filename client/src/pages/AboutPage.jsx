import { useEffect, useState } from "react";
import SiteFooter from "../components/layout/SiteFooter";
import ViewportBlurReveal from "../components/common/ViewportBlurReveal";
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
          <ViewportBlurReveal className="index-p1 vertical">
            <h1>
              <ruby>
                十二支詣<rt>じゅうにしもうで</rt>
              </ruby>
              とは？
            </h1>
            <p>
              年の流れを象徴する十二支と、
              <br />
              人が過ごす時間を見守る神社。
              <br />
              <em>「十二支」にまつわる神社へ「詣る」</em>
              <br />
              <em>それが、「十二支詣」です。</em>
            </p>
            <br />
            <p>
              このサイトでは、
              <br />
              あなたにゆかりのある動物たちによって
              <br />
              縁の深い神社を見つけるのを
              <br />
              お手伝いをします。
            </p>
          </ViewportBlurReveal>

          {loading ? (
            <p className="jinja-step-note">読み込み中…</p>
          ) : error ? (
            <p className="jinja-step-note">{error}</p>
          ) : (
            terms.map((item) => (
              <ViewportBlurReveal key={item.term} className="index-func">
                <h3>
                  {item.term}
                  <small>（{item.ruby}）</small>
                </h3>
                <p>{item.termDesc}</p>
              </ViewportBlurReveal>
            ))
          )}
        </main>
        <SiteFooter />
      </div>
    </PageLayout>
  );
}
