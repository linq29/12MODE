(function () {
    const decorationsHtml = `
        <div class="en1"><img src="images/en1.png"></div>
        <div class="en2"><img src="images/en2.png"></div>
        <div class="cloud1"><img src="images/cloud1.png"></div>
        <div class="cloud2"><img src="images/cloud2.png"></div>
    `;

    const logoHtml = `
        <div class="logo">
            <a href="index.html"><img src="images/nav-top.png" alt="トップ"></a>
        </div>
    `;

    const rightNavHtml = `
        <div class="nav-area">
            <nav class="nav-area-items">
                <ul>
                    <li><a href="jinjasagashi.html">神社探し</a>
                        <br /><span class="nav-small">あなたに縁のある一社を</span>
                    </li>
                    <li><a href="jyunishi.html">十二支診断</a>
                        <br /><span class="nav-small">特定年の十二支をチェック</span>
                    </li>
                    <li><a href="#">バーチャル参拝</a>
                        <br /><span class="nav-small">距離を越えて祈りを届ける</span>
                    </li>
                    <li><a href="kotowaza.html">ことわざくじ</a>
                        <br /><span class="nav-small">動物に関する一語</span>
                    </li>
                    <li><a href="about.html">サイト紹介</a>
                        <br /><span class="nav-small">用語集・サイトについて</span>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    class SiteLeftColumn extends HTMLElement {
        connectedCallback() {
            const titleImage = this.getAttribute("title-image") || "images/logo-v.png";
            const titleAlt = this.getAttribute("title-alt") || "";
            this.innerHTML = `
                <div class="page-title">
                    <img src="${titleImage}" alt="${titleAlt}">
                </div>
            `;
        }
    }

    class SiteRightColumn extends HTMLElement {
        connectedCallback() {
            this.innerHTML = rightNavHtml;
        }
    }

    class SiteDecorations extends HTMLElement {
        connectedCallback() {
            this.innerHTML = decorationsHtml;
        }
    }

    class SiteLogo extends HTMLElement {
        connectedCallback() {
            this.innerHTML = logoHtml;
        }
    }

    customElements.define("site-decorations", SiteDecorations);
    customElements.define("site-logo", SiteLogo);
    customElements.define("site-left-column", SiteLeftColumn);
    customElements.define("site-right-column", SiteRightColumn);
})();
