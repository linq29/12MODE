document.addEventListener('DOMContentLoaded', () => {
    // ファイル名から spotID を取得（例: jinja1.html → 1）
    const path = window.location.pathname;
    const spotID = path.split('/').pop().replace('jinja', '').replace('.html', '');

    // 対応する神社データを検索
    const shrine = shrines.spots.find(s => s.spotID === spotID);

    if (shrine) {
        // ページタイトルを更新
        document.getElementById('pageTitle').textContent = `${shrine.spot} | 十二支詣`;

        // 神社画像を更新
        document.getElementById('spotImage').src = `images/spot${shrine.spotID}.webp`;
        document.getElementById('spotImage').alt = shrine.spot;

        // 神社情報を更新
        document.getElementById('spotId').textContent = shrine.spot;
        document.getElementById('spotHiragana').textContent = shrine.spotHiragana;
        document.getElementById('spotCatch').textContent = shrine.spotCatch;
        document.getElementById('spotDesc').textContent = shrine.spotDesc;
        document.getElementById('addr').textContent = `📌${shrine.addr}`;

        // 公式サイトリンクを更新
        const siteLink = document.getElementById('spotSiteLink');
        siteLink.href = shrine.spotSite;
        siteLink.textContent = shrine.spotSite;
    } else {
        console.error(`ご縁は、もう少し先のようです……`);
    }
});