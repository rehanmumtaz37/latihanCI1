import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import LoginPage from '../pages/pages_login.js';
import CheckoutPage from '../pages/pages_checkout.js';
import fs from 'fs';

describe('SAUCEDEMO', function () {
    this.timeout(50000);

    let driver;
    let options = new chrome.Options();
    options.addArguments('--incognito');
    // options.addArguments('--headless');
    options.addArguments('--log-level=3'); // suppress warning/error logs buat ngilangin eror

    beforeEach(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.manage().window().maximize();
        await driver.get('https://www.saucedemo.com/');
        const loginPage = new LoginPage(driver);
        await loginPage.login("standard_user", "secret_sauce");
    });

    afterEach(async function () {
        await driver.sleep(2000);
        await driver.quit();
    });

    it('Checkout', async () => {
        const checkoutPage = new CheckoutPage(driver);
        await checkoutPage.clickAddToCart();
        await checkoutPage.clickCart();
        await checkoutPage.clickCheckout();
        await checkoutPage.fillForm("yono", "bakrie", "12345");
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();

        const isCheckoutComplete = await checkoutPage.assertCheckoutComplete();
        assert.strictEqual(isCheckoutComplete, true, "Checkout berhasil");

        let full_ss = await driver.takeScreenshot();
        fs.writeFileSync('report_ss/checkout/success checkout.png', Buffer.from(full_ss, 'base64'));
    });
});