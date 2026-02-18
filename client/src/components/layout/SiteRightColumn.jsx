const NAV_ITEMS = [
  {
    href: "/jinjasagashi",
    title: "神社探し",
    subtitle: "あなたに縁のある一社を",
  },
  {
    href: "/jyunishi",
    title: "十二支診断",
    subtitle: "特定年の十二支をチェック",
  },
  {
    href: "#",
    title: "バーチャル参拝",
    subtitle: "距離を越えて祈りを届ける",
  },
  {
    href: "/kotowaza",
    title: "ことわざくじ",
    subtitle: "動物に関する一語",
  },
  {
    href: "/about",
    title: "サイト紹介",
    subtitle: "用語集・サイトについて",
  },
];

export default function SiteRightColumn() {
  return (
    <div className="right-column">
      <div className="nav-area">
        <nav className="nav-area-items">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.title}>
                <a href={item.href}>{item.title}</a>
                <br />
                <span className="nav-small">{item.subtitle}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
