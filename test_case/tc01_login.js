import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import LoginPage from '../pages/pages_login.js';
import fs from 'fs';
import path from 'path';

describe('SAUCEDEMO', function () {
    this.timeout(50000);

    let driver;
    let options = new chrome.Options();
    options.addArguments('--incognito');
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--log-level=3'); // suppress warning/error logs buat ngilangin eror

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.manage().window().maximize();
        await driver.get('https://www.saucedemo.com/');
    });

    afterEach(async function () {
        await driver.sleep(2000);
        await driver.quit();
    });

    it('Valid Login', async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("standard_user", "secret_sauce");

        const isDisplayed = await loginPage.assertProdukDisplayed();
        assert.strictEqual(isDisplayed, true, "Berhasil menampilakan halaman produk");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/valid_login.png', Buffer.from(full_ss, 'base64'));

    });

    it("login with Invalid Username", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("invalid_username", "secret_sauce");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Username and password do not match any user in this service");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/invalid_username.png', Buffer.from(full_ss, 'base64'));
    });

    it("login with Invalid Password", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("standard_user", "invalid_pass");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Username and password do not match any user in this service");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/invalid_password.png', Buffer.from(full_ss, 'base64'));
    });

    it("login with Empty Username and valid Password", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("", "secret_sauce");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Username is required");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/empty_username.png', Buffer.from(full_ss, 'base64'));
    });

    it("login with valid Username and Empty Password", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("standard_user", "");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Password is required");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/empty_password.png', Buffer.from(full_ss, 'base64'));
    });

    it("Login with locked out user", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("locked_out_user", "secret_sauce");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Sorry, this user has been locked out.");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/locked_out_user.png', Buffer.from(full_ss, 'base64'));
    });

    it("login without username dan password", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("", "");

        const eror = await loginPage.getErrorMessage();
        assert.strictEqual(eror, "Epic sadface: Username is required");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/empty.png', Buffer.from(full_ss, 'base64'));
    });

    it("Login with problem user", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("problem_user", "secret_sauce");

        const eror = await loginPage.assertErorProblemUser();
        assert.strictEqual(eror, true, "Berhasil login tapi gambar tidak muncul pada halaman produk");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/problem_user.png', Buffer.from(full_ss, 'base64'));
    });

    it("Login with performance glitched user", async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.login("performance_glitch_user", "secret_sauce");

        const isDisplayed = await loginPage.assertProdukDisplayed();
        assert.strictEqual(isDisplayed, true, "Berhasil login tapi lambat menampilkan halaman produk");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/login/performance_glitch_user.png', Buffer.from(full_ss, 'base64'));
    });

});
