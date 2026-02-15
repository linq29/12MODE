document.addEventListener("DOMContentLoaded", () => {
    // スピン動画の再生
    const boxes = document.querySelectorAll(".zodiac-box");

    boxes.forEach((box) => {
        const img = box.querySelector("img");
        const originalSrc = img.src;
        const hoverSrc = originalSrc.replace("zodiacA", "zodiacB");

        box.addEventListener("mouseenter", () => {
            img.style.opacity = "0";
            setTimeout(() => {
                img.src = hoverSrc;
                img.style.opacity = "1";
            }, 200);
        });

        box.addEventListener("mouseleave", () => {
            img.style.opacity = "0";
            setTimeout(() => {
                img.src = originalSrc;
                img.style.opacity = "1";
            }, 200);
        });
    });

    // 「気ままに行こう！」ボタンのランダム遷移機能
    // 実装版
    // const randomBtn = document.getElementById('randomShrineBtn');

    // randomBtn.addEventListener('click', () => {
    //     const randomSpotID = Math.floor(Math.random() * 24) + 1;
    //     window.location.href = `jinja${randomSpotID}.html`;
    // });

    // DEMO版（遷移しない）
    const randomBtn = document.getElementById("randomShrineBtn");

    randomBtn.addEventListener("click", () => {
        window.location.href = "blessings.html";
    });
});