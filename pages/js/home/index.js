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