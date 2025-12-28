document.addEventListener("DOMContentLoaded", async () => {
    const routes = await import("/lunanthus/routes.js");
    const app = document.getElementById("app");

    const renderPage = async () => {
        const path = location.pathname;
        const route = routes.default.find(r => r.path === path);
        if (route) {
            const pathName = route.path.slice(1);

        const getLastModifiedDate = async (route) => {
            try {
                const response = await fetch(route.file, { method: 'HEAD' }); // 本文不要ならHEADで高速化
                const lastModified = response.headers.get('Last-Modified');

                if (lastModified) {
                    const date = new Date(lastModified);
                    // YYYYMMDDHHMMSS 形式
                    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
                }
            } catch (error) {
                // 何も処理せずフォールバックへ
            }

            // 取得失敗またはヘッダーなしの場合：現在時刻
            const now = new Date();
            return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        };

        const lastModifiedDate = await getLastModifiedDate(route);

            const response = await fetch(route.file+`?t=${lastModifiedDate}`);

            const html = await response.text();
            app.innerHTML = html;

            if (route.script) {
                const existingScript = document.querySelector(`script[type="module"]`);
                if (existingScript) {
                    existingScript.remove();
                }

                const script = document.createElement("script");
                script.src = route.script + `?t=${Date.now()}`;
                script.type = "module";
                document.body.appendChild(script);
            } else {
                const existingScript = document.querySelector(`script[type="module"]`);
                if (existingScript) {
                    existingScript.remove();
                }
            }
            if (route.style) {
                const existingStyle = document.head.querySelector(`link[title="Style-${pathName}"]`);
                if (existingStyle) {
                    existingStyle.remove();
                }

                const style = document.createElement("link");
                style.rel = ("stylesheet");
                style.href = `${route.style}?t=${Date.now()}`;
                style.setAttribute("type","text/css");
                style.setAttribute("title",`Style-${pathName}`);
                document.head.appendChild(style);
            } else {
                const existingStyle = document.head.querySelector(`link[rel="stylesheet"]`);
                if (existingStyle) {
                    existingStyle.remove();
                }
            }
        } else {
            app.innerHTML = "<h1>404<br>Not Found</h1>";
        }
    };

    window.addEventListener("popstate", renderPage);

    document.body.addEventListener("click", (event) => {
        const target = event.target.closest("a");
        if (target && target.href && target.origin === location.origin) {
            const pathname = new URL(target.href).pathname;
            if (routes.default.some(r => r.path === pathname)) {
                event.preventDefault();
                history.pushState(null, "", pathname);
                renderPage();
            }
        }
    });

    renderPage();
});
