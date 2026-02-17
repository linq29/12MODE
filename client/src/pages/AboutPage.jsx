import PageLayout from "../layouts/PageLayout";

const TERMS = [
  {
    term: "御利益",
    ruby: "ごりえき",
    desc: "神社や仏閣で神仏から授かる加護や恩恵のこと。参拝したり、お守りを持ったりすることで、健康・商売繁盛・学業成就などの御利益が得られるとされる。",
  },
  {
    term: "狛犬",
    ruby: "こまいぬ",
    desc: "神社の入口などに対で置かれる獅子のような像。口を開けた阿形（あぎょう）と、口を閉じた吽形（うんぎょう）が対になっており、邪気を払う役割を持つ。狛犬と呼ばれるが、犬の形に限らない。",
  },
  {
    term: "十二支",
    ruby: "じゅうにし",
    desc: "子・丑・寅など12の動物で構成される干支の一部。年や方角、性格占いなどに用いられる。",
  },
  {
    term: "神社",
    ruby: "じんじゃ",
    desc: "神道の神々を祀る施設。鳥居をくぐり、参道を進んで参拝する。祭りや祈願が行われる場所。",
  },
  {
    term: "神使",
    ruby: "しんし",
    desc: "神の使いとされる動物。稲荷神社の狐、天満宮の牛、八幡神社の鳩など、神ごとに異なる動物が定められている。",
  },
  {
    term: "生肖",
    ruby: "せいしょう",
    desc: "中国の十二支を指し、日本の十二支と同様に、年ごとの動物で人の性格や運勢を占う文化がある。",
  },
];

export default function AboutPage() {
  return (
    <PageLayout
      bodyClass="page-about"
      pageTitle="サイト紹介 | 十二支詣"
      titleImage="/images/title-about.png"
      titleAlt="サイト紹介"
    >
      <div className="main-area">
        <main className="about">
          {TERMS.map((item) => (
            <div key={item.term} className="index-func">
              <h3>
                {item.term}
                <small>（{item.ruby}）</small>
              </h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </main>
        <footer>
          <p className="footer">
            JYUNISHI MODE
            <br />
            (C) IT41-601 LIN QIUJING
          </p>
        </footer>
      </div>
    </PageLayout>
  );
}
