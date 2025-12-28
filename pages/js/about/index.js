try {
    // <section id="title"> を取得
    const titleSection = document.querySelector('section#title');

    if (!titleSection) {
        console.warn('section#title が見つかりませんでした。');
        throw new Error('title section not found'); // 必要に応じて
    }

    // section#title のテキスト内容を取得（空白除去）
    const newTitleText = titleSection.textContent.trim();

    if (newTitleText) {
        // <title> タグに反映
        document.title = newTitleText;

        // <head>内の<title>タグも確実に更新（念のため）
        let titleTag = document.querySelector('title');
        if (!titleTag) {
            titleTag = document.createElement('title');
            document.head.appendChild(titleTag);
        }
        titleTag.textContent = newTitleText;
    }

    // section#title をDOMから削除
    titleSection.remove();

} catch (error) {
    console.error('タイトル更新処理でエラーが発生しました:', error);
}

try {
    const response = await fetch('/lunanthus/pwa/manifest.json');
    const data = await response.json();
    const versionElement = document.getElementById('app-version');
    if (versionElement) {
        versionElement.textContent = data.version;
    }

    const jTest = $("#jTest");
    jTest.html("テスト");

} catch (error) {
    console.error('Error :', error);
}

try {
    const response = await fetch('/js/tinytools.progressbar.js');
    const scriptText = await response.text();

    const script = document.createElement('script');
    script.textContent = scriptText;

    // スクリプトの読み込み完了を待つ
    document.head.appendChild(script);

    // 少し待ってから実行（確実に評価されるように）
    $(document).ready(function(){
        setTimeout(() => {
            if (typeof $.fn.progressBar === 'function') {
                $('#mini').progressBar({
                    percent: 50,
                    split: 8,
                    width: "200px",
                    height: "40px"
                });
            } else {
                console.warn('progressBar プラグインが読み込まれていません');
            }
        }, 0);
    });
} catch (error) {
    console.error('Error:', error);
}

try {
    const response = await fetch('/pages/assets/menu.html');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();

    const blockTiles = document.querySelectorAll('section[id="menu"]');

    if (blockTiles.length === 0) {
        console.warn('section#menu が見つかりませんでした。メニューを読み込めません。');
        // return; を削除 → ここで処理を終了したいなら以下のようにする
        // 以降の処理をスキップ
    } else {
        // 既存のmenuBlockを削除
        document.querySelectorAll('#menuBlock').forEach(el => el.remove());

        const div = document.createElement('div');
        div.id = 'menuBlock';
        div.innerHTML = text;

        blockTiles[0].appendChild(div);
    }

} catch (error) {
    console.error('メニュー読み込みエラー:', error);
}