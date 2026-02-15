import React from 'react';

const RightNav: React.FC = () => (
  <aside className="right-column">
    <nav className="nav-area">
      <ul>
        <li>
          <a href="/jinjasagashi.html">神社探し</a>
          <br /><span className="nav-small">あなたに縁のある一社を</span>
        </li>
        <li>
          <a href="/jyunishi.html">十二支診断</a>
          <br /><span className="nav-small">特定年の十二支をチェック</span>
        </li>
        <li>
          <a href="#">バーチャル参拝</a>
          <br /><span className="nav-small">距離を越えて祈りを届ける</span>
        </li>
        <li>
          <a href="/kotowaza.html">ことわざくじ</a>
          <br /><span className="nav-small">動物に関する一語</span>
        </li>
        <li>
          <a href="/about.html">サイト紹介</a>
          <br /><span className="nav-small">用語集・サイトについて</span>
        </li>
      </ul>
    </nav>
  </aside>
);

export default RightNav;
