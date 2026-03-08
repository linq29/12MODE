import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoadingMessage from "../components/common/LoadingMessage";
import ViewportBlurReveal from "../components/common/ViewportBlurReveal";
import SiteFooter from "../components/layout/SiteFooter";

import PageLayout from "../layouts/PageLayout";
import { preloadImages } from "../lib/preload";

const HOME_LOADING_MESSAGE = "案内中";
const HOME_ASSET_URLS = [
  "/images/top-visual.webp",
  "/images/ruby-gold1.png",
  "/images/carousel/c1.jpg",
  "/images/carousel/c2.jpg",
  "/images/carousel/c3.jpg",
  "/images/carousel/c4.jpg",
  "/images/carousel/c5.jpg",
  "/images/icon-torii.png",
  "/images/icon-junishi.png",
  "/images/icon-kuji.png",
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    preloadImages(HOME_ASSET_URLS).finally(() => {
      if (!mounted) {
        return;
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <PageLayout
        bodyClass="page-index"
        pageTitle="十二支詣"
        titleImage="/images/logo-v.png"
        titleAlt="十二支詣"
      >
        <LoadingMessage variant="screen" message={HOME_LOADING_MESSAGE} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      bodyClass="page-index"
      pageTitle="十二支詣"
      titleImage="/images/logo-v.png"
      titleAlt="十二支詣"
    >
      <div className="main-area">
        <ViewportBlurReveal className="top-visual">
          <img src="/images/top-visual.webp" alt="トップビジュアル" />
        </ViewportBlurReveal>
        <main className="index">
          <ViewportBlurReveal className="ruby-gold">
            <img src="/images/ruby-gold1.png" alt="飾り" />
          </ViewportBlurReveal>

          <ViewportBlurReveal className="carousel">
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
          </ViewportBlurReveal>

          <ViewportBlurReveal
            as={Link}
            to="/jinjasagashi"
            className="index-func-link"
          >
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
          </ViewportBlurReveal>

          <ViewportBlurReveal
            as={Link}
            to="/junishi"
            className="index-func-link"
          >
            <div className="index-func">
              <div className="inline-wrapper">
                <div className="h2-icon">
                  <img src="/images/icon-junishi.png" alt="十二支診断" />
                </div>
                <h2>十二支診断</h2>
              </div>
              <p>
                自分の生まれ年や、特定年の十二支を確認したい人のためのツール。
              </p>
            </div>
          </ViewportBlurReveal>

          <ViewportBlurReveal
            as={Link}
            to="/kotowaza"
            className="index-func-link"
          >
            <div className="index-func">
              <div className="inline-wrapper">
                <div className="h2-icon">
                  <img src="/images/icon-kuji.png" alt="ことわざくじ" />
                </div>
                <h2>ことわざくじ</h2>
              </div>
              <p>動物の関する一語をランダムに引く。</p>
            </div>
          </ViewportBlurReveal>
        </main>
        <SiteFooter />
      </div>
    </PageLayout>
  );
}
