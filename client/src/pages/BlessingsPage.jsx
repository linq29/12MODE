import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

const BLESSING_LINKS = [
  {
    to: "/jinja/1",
    image: "/images/jinjasagashi/blessing_gakugyo_joju.png",
    alt: "学業成就",
  },
  {
    to: "/jinja/2",
    image: "/images/jinjasagashi/blessing_enmusubi.png",
    alt: "縁結び",
  },
  {
    to: "/jinja/3",
    image: "/images/jinjasagashi/blessing_kinun.png",
    alt: "金運",
  },
  {
    to: "/jinja/4",
    image: "/images/jinjasagashi/blessing_kaiun.png",
    alt: "開運",
  },
];

export default function BlessingsPage() {
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

        <div className="select-step2 justify-wrapper">
          {BLESSING_LINKS.map((item) => (
            <div key={item.to} className="select-step2-item">
              <Link to={item.to}>
                <img src={item.image} alt={item.alt} />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </PageLayout>
  );
}
