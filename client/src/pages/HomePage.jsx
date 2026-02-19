import { Link } from "react-router-dom";
import SiteFooter from "../components/layout/SiteFooter";
import PageLayout from "../layouts/PageLayout";

export default function HomePage() {
  return (
    <PageLayout
      bodyClass="page-index"
      pageTitle="十二支詣"
      titleImage="/images/logo-v.png"
      titleAlt="十二支詣"
    >
      <div className="main-area">
        <div className="top-visual">
          <img src="/images/top-visual.png" alt="トップビジュアル" />
        </div>
        <main className="index">
          <div className="index-p1 vertical">
            <h1>
              <ruby>
                十二支詣<rt>じゅうにしもうで</rt>
              </ruby>
              とは？
            </h1>
            <p>
              年の流れを象徴する十二支と、
              <br />人が過ごす時間を見守る神社。
              <br />
              <em>「十二支」にまつわる神社へ「詣る」</em>
              <br />
              <em>それが、「十二支詣」です。</em>
            </p>
            <br />
            <p>
              このサイトでは、
              <br />あなたにゆかりのある動物たちによって
              <br />縁の深い神社を見つけるのを
              <br />お手伝いをします。
            </p>
          </div>

          <div className="ruby-gold">
            <img src="/images/ruby-gold1.png" alt="飾り" />
          </div>

          <div className="carousel">
            <div className="carousel-track">
              <img src="/images/carousel/c1.jpg" alt="神社写真1" />
              <img src="/images/carousel/c2.jpg" alt="神社写真2" />
              <img src="/images/carousel/c3.jpg" alt="神社写真3" />
              <img src="/images/carousel/c4.jpg" alt="神社写真4" />
              <img src="/images/carousel/c5.jpg" alt="神社写真5" />

              <img src="/images/carousel/c1.jpg" alt="神社写真1" />
              <img src="/images/carousel/c2.jpg" alt="神社写真2" />
              <img src="/images/carousel/c3.jpg" alt="神社写真3" />
              <img src="/images/carousel/c4.jpg" alt="神社写真4" />
              <img src="/images/carousel/c5.jpg" alt="神社写真5" />
            </div>
          </div>

          <Link to="/jinjasagashi" className="index-func-link">
            <div className="index-func">
              <div className="inline-wrapper">
                <div className="h2-icon">
                  <img src="/images/icon-torii.png" alt="神社探し" />
                </div>
                <h2>神社探し</h2>
              </div>
              <p>
                神社巡りに興味はあるけれど、どこから始めればいいか分からないと悩む方や、自分と深い縁のある神社を見つけたい方。このサイトは、そんなあなたの助けになることを目指しています。
              </p>
              <p>
                <em>十二支を軸に</em>、<em>四十八社の神社を厳選し</em>
                、それぞれが持つ歴史やご利益、そして動物との結びつきも紹介します。
              </p>
            </div>
          </Link>

          <Link to="/jyunishi" className="index-func-link">
            <div className="index-func">
              <div className="inline-wrapper">
                <div className="h2-icon">
                  <img src="/images/icon-jyunishi.png" alt="十二支診断" />
                </div>
                <h2>十二支診断</h2>
              </div>
              <p>自分の生まれ年や、特定年の十二支を確認したい人のためのツール。</p>
            </div>
          </Link>

          <Link to="/kotowaza" className="index-func-link">
            <div className="index-func">
              <div className="inline-wrapper">
                <div className="h2-icon">
                  <img src="/images/icon-kuji.png" alt="ことわざくじ" />
                </div>
                <h2>ことわざくじ</h2>
              </div>
              <p>動物の関する一語をランダムに引く。</p>
            </div>
          </Link>
        </main>
        <SiteFooter />
      </div>
    </PageLayout>
  );
}
