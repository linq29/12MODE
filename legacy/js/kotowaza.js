const proverbs = [
    { "hiragana": "<ruby>蛇<rt>じゃ</rt></ruby>は<ruby>寸<rt>すん</rt></ruby>にして<ruby>人<rt>ひと</rt></ruby>を<ruby>呑<rt>の</rt></ruby>む", "proverbDesc": "すぐれた人物が幼少の頃から抜きんでた素質を示すことのたとえ。" },
    { "hiragana": "<ruby>馬<rt>うま</rt></ruby>は<ruby>馬<rt>うま</rt></ruby><ruby>連<rt>づ</rt></ruby>れ", "proverbDesc": "同類のものが集まることで物事がうまくいくことのたとえ。" },
    { "hiragana": "<ruby>人間<rt>にんげん</rt></ruby><ruby>万事<rt>ばんじ</rt></ruby><ruby>塞翁<rt>さいおう</rt></ruby>が<ruby>馬<rt>うま</rt></ruby>", "proverbDesc": "人生の禍福は転々として予測できないことのたとえ。" },
    { "hiragana": "<ruby>馬<rt>うま</rt></ruby>には<ruby>乗<rt>の</rt></ruby>ってみよ", "proverbDesc": "馬のよしあしは乗ってみなければわからない。何事も自分で直接経験してみよということ。" },
    { "hiragana": "<ruby>多<rt>た</rt></ruby><ruby>岐<rt>き</rt></ruby><ruby>亡<rt>ぼう</rt></ruby><ruby>羊<rt>よう</rt></ruby>", "proverbDesc": "学問の道があまりにも幅広いため、真理をとらえることの難しさを嘆くことのたとえ。" },
    { "hiragana": "<ruby>群羊<rt>ぐんよう</rt></ruby>を<ruby>駆<rt>か</rt></ruby>って<ruby>猛虎<rt>もうこ</rt></ruby>を<ruby>攻<rt>せ</rt></ruby>む", "proverbDesc": "多くの弱い者を連合させて、強者に対抗することのたとえ。" },
    { "hiragana": "<ruby>三<rt>さん</rt></ruby><ruby>羊<rt>よう</rt></ruby><ruby>開<rt>かい</rt></ruby><ruby>泰<rt>たい</rt></ruby>", "proverbDesc": "春が巡って来て、万物の生気が満ち溢れることという。「陽」と「羊」の発音が同じことから生じた言葉。" },
    { "hiragana": "<ruby>意<rt>い</rt></ruby><ruby>馬<rt>ば</rt></ruby><ruby>心<rt>しん</rt></ruby><ruby>猿<rt>えん</rt></ruby>", "proverbDesc": "馬が奔走し猿が騒ぎたてるのを止めがたいように、煩悩・妄念などが起こって心が乱れ、抑えがたいこと。" },
    { "hiragana": "<ruby>猿<rt>さる</rt></ruby>も<ruby>木<rt>き</rt></ruby>から<ruby>落<rt>お</rt></ruby>ちる", "proverbDesc": "その道にすぐれた者でも、時には失敗することがあるということのたとえ。" },
    { "hiragana": "<ruby>見<rt>み</rt></ruby><ruby>猿<rt>ざる</rt></ruby><ruby>聞<rt>き</rt></ruby>か<ruby>猿<rt>ざる</rt></ruby><ruby>言<rt>い</rt></ruby>わ<ruby>猿<rt>ざる</rt></ruby>", "proverbDesc": "余計なことは見ようとせず、聞こうとせず、言おうとしないのがよい。" },
    { "hiragana": "どこの<ruby>鶏<rt>とり</rt></ruby>も<ruby>裸足<rt>はだし</rt></ruby>", "proverbDesc": "どこへ行っても同じものは同じで、変わるはずがない。また、人間の本性はどこの国でも同じである。" },
    { "hiragana": "<ruby>鶏口<rt>けいこう</rt></ruby>となるとも<ruby>牛後<rt>ぎゅうご</rt></ruby>となる<ruby>無<rt>な</rt></ruby>かれ", "proverbDesc": "大きな集団の末端に連なるよりは、小さな集団でトップとなるほうがよい、ということ。" },
    { "hiragana": "<ruby>夜深<rt>よぶか</rt></ruby>き<ruby>鶏<rt>とり</rt></ruby>の<ruby>声<rt>こえ</rt></ruby>", "proverbDesc": "夜深いころの鶏の声が聞こえるのも、しみじみと哀れを感じさせる。" },
    { "hiragana": "<ruby>犬<rt>いぬ</rt></ruby>は<ruby>三日<rt>みっか</rt></ruby><ruby>飼<rt>か</rt></ruby>えば<ruby>三年<rt>さんねん</rt></ruby><ruby>恩<rt>おん</rt></ruby>を<ruby>忘<rt>わす</rt></ruby>れぬ", "proverbDesc": "犬でさえ恩を忘れないのだから、まして人間なら恩を忘れてはいけないということ。" },
    { "hiragana": "<ruby>犬<rt>いぬ</rt></ruby>も<ruby>歩<rt>ある</rt></ruby>けば<ruby>棒<rt>ぼう</rt></ruby>に<ruby>当<rt>あ</rt></ruby>たる", "proverbDesc": "行動を起こすと、幸運なことでも、災難なことでも、何らかの経験をすることができることのたとえ。" },
    { "hiragana": "<ruby>頼<rt>たの</rt></ruby>むと<ruby>頼<rt>たの</rt></ruby>まれては<ruby>犬<rt>いぬ</rt></ruby>も<ruby>木<rt>き</rt></ruby>へ<ruby>登<rt>のぼ</rt></ruby>る", "proverbDesc": "人が懇願されると、通常なら不可能と思われる事柄でも挑戦しようとする気持ちが湧くということ。" },
    { "hiragana": "<ruby>馴染<rt>なじ</rt></ruby>みては<ruby>猪<rt>いのしし</rt></ruby>の<ruby>子<rt>こ</rt></ruby>も<ruby>可愛<rt>かわい</rt></ruby>い", "proverbDesc": "どのようなでものでも慣れ親しむと情が移ってかわいく思えるということ。" },
    { "hiragana": "<ruby>猪<rt>いのしし</rt></ruby>も<ruby>七代目<rt>しちだいめ</rt></ruby>には<ruby>豕<rt>ぶた</rt></ruby>になる", "proverbDesc": "変わらないように見えても、長い年月の間には成長・変化することのたとえ。" },
    { "hiragana": "<ruby>山<rt>やま</rt></ruby>より<ruby>大<rt>おお</rt></ruby>きな<ruby>猪<rt>いのしし</rt></ruby>は<ruby>出<rt>で</rt></ruby>ぬ", "proverbDesc": "入れ物よりも大きな中身などあり得ないというたとえ。また、大げさな言い方もほどほどにしろということ。" }
];

document.addEventListener('DOMContentLoaded', () => {
    const proverbText = document.getElementById('proverbText');
    const proverbDesc = document.getElementById('proverbDesc');
    const retryBtn = document.getElementById('retryBtn');
    const proverbArea = document.querySelector('.proverb-area');

    // 最初はボタンを非表示にする
    retryBtn.style.display = "none";

    // ランダムにことわざを表示＋ぼかし演出
    function displayRandomProverb() {
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        const proverb = proverbs[randomIndex];

        proverbText.innerHTML = proverb.hiragana;
        proverbDesc.textContent = proverb.proverbDesc;

        proverbArea.classList.remove('is-revealing');
        // reflowでアニメーションを再トリガー
        void proverbArea.offsetWidth;
        proverbArea.classList.add('is-revealing');

        // 表示後にボタンを出す
        retryBtn.style.display = "block";
    }

    // 初回表示
    displayRandomProverb();

    // もう一度引く
    retryBtn.addEventListener('click', displayRandomProverb);
});