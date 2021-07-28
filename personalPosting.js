/**
 * Click on the create button
 * For personal account
 * @param page
 * @returns {Promise<void>}
 */
async function clickCreateButton(page) {
    try {
        let button = await page.waitForXPath(
            "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div[2]/div/div[2]/div[1]/div/div/div/div/div[1]/div/div[1]/span"
        )
        button.click()
    } catch {
        throw new Error("Invalid page specified")
    }

}


/**
 * Create post
 * For personal
 * @param page
 * @param text
 * @returns {Promise<*>}
 */
async function createPost(page, text) {
    await clickCreateButton(page)

    let textField = await page.waitForXPath(
        "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/form/div/div[1]/div/div/div/div[2]/div[1]/div[1]/div[1]/div/div/div/div/div/div/div/div/div"
    );

    await textField.type(text)

    let publishButton = await page.waitForXPath(
        "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/form/div/div[1]/div/div/div/div[3]/div[2]/div/div/div[1]"
    )
    await publishButton.click();

    return page
}

module.exports = {createPost}