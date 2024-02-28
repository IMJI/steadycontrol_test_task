import playwright from "playwright";

class Browser {
    browser = null;
    context = null;
    page = null;

    async init() {
        this.browser = await playwright["chromium"].launch({ headless: true });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    _isInitialized() {
        return this.browser && this.context && this.page;
    }

    async auth() {
        if (!this._isInitialized) throw new Error("Окно браузера не было инициализировано");
        const username = process.env.RUTRACKER_USERNAME;
        const password = process.env.RUTRACKER_PASSWORD;
        console.log("Загрузка страницы входа");
        await this.page.goto("https://rutracker.org/forum/index.php");
        await this.page.getByRole("link", { name: "Вход" }).click();
        await this.page.getByPlaceholder("имя").fill(username);
        await this.page.getByPlaceholder("пароль").fill(password);
        await this.page.getByRole("button", { name: "вход" }).click();
        console.log("Вход выполнен успешно");
    }

    async loadHtmlFromUrl(url) {
        if (!this._isInitialized) throw new Error("Окно браузера не было инициализировано");
        console.log("Ожидание загрузки страницы");
        await this.page.goto(url, { timeout: 60000 });
        console.log("Ожидание загрузки списка поблагодаривших");
        await this.page.click(".sp-head.folded.sp-no-auto-open");
        return new Promise(resolve => setTimeout(async () => {
            const data = await this.page.content();
            resolve(data);
        }, 3000));
    }
}

export default Browser;