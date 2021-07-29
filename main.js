// require('dotenv').config() for debug

const puppeteer = require('puppeteer');

const business = require('./businessPosting');
const personal = require('./personalPosting');
const fs = require("fs");


/**
 * The type name corresponding to the business account
 * @type {string}
 */
const BUSINESS_ACCOUNT = "business"

/**
 * The type name corresponding to the personal account
 * @type {string}
 */
const PERSONAL_ACCOUNT = "personal"

/**
 * The site on which the parsing will be performed
 * @type {string}
 */
const SITE = "https://www.facebook.com"

/**
 * Account type
 *
 * BUSINESS\PERSONAL
 * @type {string}
 */
const ACCOUNT_TYPE = ((type) => {
    if (type === BUSINESS_ACCOUNT || type === PERSONAL_ACCOUNT) {
        return type
    } else {
        throw new Error("Account type is incorrect")
    }
})(process.env.FB_ACCOUNT_TYPE);

/**
 * Static link to personal page
 * @type {string}
 */
const PERSONAL_ACCOUNT_LINK = "me"

/**
 * Static link to business account page
 * @type {string}
 */
const BUSINESS_ACCOUNT_LINK = process.env.FB_BUSINESS_ACCOUNT_PAGE ?? (() => {
    if (ACCOUNT_TYPE === BUSINESS_ACCOUNT) {
        throw new Error("Link to business account missing")
    }
    return undefined
})();

/**
 * Login
 * @type {string}
 */
const LOGIN = process.env.FB_LOGIN ?? (() => {
    throw new Error("Login is incorrect")
})();

/**
 * Password
 * @type {string}
 */
const PASSWORD = process.env.FB_PASSWORD ?? (() => {
    throw new Error("Password is incorrect")
})();

/**
 * Attachments
 * @type {string}
 */
const POST_ATTACHMENT = ((attachment) => {
    if (fs.existsSync(attachment)) {
        return attachment
    } else {
        throw new Error("File does not exist")
    }
})(process.env.FB_POST_ATTACHMENT);


async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox'],
        // slowMo: 70
    });

    try {
        const context = browser.defaultBrowserContext();

        /**
         * Block access to geolocation and notifications
         */
        await context.overridePermissions(SITE, ["geolocation", "notifications"]);

        const page = await browser.newPage();


        await page.setDefaultNavigationTimeout(60000);
        // await page.setViewport({width: 1200, height: 800});

        await page.goto(SITE);
        await authorise(page, LOGIN, PASSWORD)
        // await page.waitForNavigation();

        /**
         * Create a post on personal page
         */
        if (ACCOUNT_TYPE === PERSONAL_ACCOUNT) {
            await page.goto(SITE + "/" + PERSONAL_ACCOUNT_LINK);
            await personal.createPost(page,[POST_ATTACHMENT])
        }

        /**
         * Create a post on business page
         */
        if (ACCOUNT_TYPE === BUSINESS_ACCOUNT) {
            await page.goto(SITE + "/" + BUSINESS_ACCOUNT_LINK);
            await business.createPost(page, [POST_ATTACHMENT])
        }

    } catch (error) {
        console.error(error);
    } finally {
        await browser.close()
    }
}

/**
 * Log in to account
 * @param page
 * @param login
 * @param password
 * @returns {Promise<void>}
 */
async function authorise(page, login, password) {
    await page.waitForSelector('#email');

    await page.type('#email', login);
    await page.type('#pass', password);

    await page.click(`[type="submit"]`);

    let profileButton = "/html/body/div[1]/div/div[1]/div/div[2]/div[4]/div[1]/span/div/div[1]/img"
    try {
        await page.waitForXPath(profileButton, {timeout: 30000})
    } catch {
        throw new Error("Wrong login or password")
    }
}

main();
