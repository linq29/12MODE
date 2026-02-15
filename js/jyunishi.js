const zodiacs = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const zodiacRuby = ["ね", "うし", "とら", "う", "たつ", "へび", "うま", "ひつじ", "さる", "とり", "いぬ", "い"];

// 年リストを作成（2030〜1924）
const select = document.getElementById("yearSelect");
for (let year = 2030; year >= 1924; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
}

select.value = "2026";

// 干支を表示
function showZodiac() {
    const year = Number(document.getElementById("yearSelect").value);
    const zodiacIndex = (year - 1924) % 12;

    const zodiac = zodiacs[zodiacIndex];
    const furigana = zodiacRuby[zodiacIndex];

    // 干支の画像をセット
    const imgPath = `images/zodiacA${zodiacIndex + 1}.webp`;
    const imgEl = document.getElementById("zodiacImage");
    imgEl.src = imgPath;
    imgEl.style.display = "block";

    // 結果表示
    document.getElementById("zodiacResult").innerHTML =
        `<ruby>${zodiac}<rt>${furigana}</rt></ruby>年です！`;

    document.getElementById("retryBtn").style.display = "block";
}

// リセット
function resetSelection() {
    document.getElementById("zodiacResult").innerHTML = "";

    const imgEl = document.getElementById("zodiacImage");
    imgEl.style.display = "none";
    imgEl.src = "";

    document.getElementById("retryBtn").style.display = "none";
}
