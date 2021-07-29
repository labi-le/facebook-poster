/**
 * Click on the create button
 * For personal account
 * @param page
 * @param {array} filePath
 * @returns {Promise<void>}
 */
async function createPost(page, filePath) {
    try {
        await uploadAttachments(page, filePath)
        await clickPublish(page)

        await waitForPublish(page)
    } catch {
        throw new Error("Invalid page specified")
    }

}

/**
 * @param page
 * @returns {Promise<*>}
 */
async function waitButtonsCreatePost(page) {
    return await page.waitForXPath(
        "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div[2]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div[1]/span[2]/span"
    )
}

/**
 * Upload attachments
 * @param page
 * @param attachments
 * @returns {Promise<*>}
 */
async function uploadAttachments(page, attachments) {
    let button = await waitButtonsCreatePost(page)
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        button.click()
    ])

    await fileChooser.accept(attachments)

    /**
     * Speed limit
     */
    return await new Promise(r => setTimeout(r, 3000));
}

/**
 * Click publish button
 * @param page
 * @returns {Promise<>}
 */
async function clickPublish(page) {
    await new Promise(r => setTimeout(r, 10000));

    let publishButton = await page.waitForXPath(
        "/html/body/div[1]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/form/div/div[1]/div/div[2]/div/div[3]/div[4]/div/div[1]",
    )
    return await publishButton.click();
}


/**
 * Super duper trick
 * Wait for publication complete
 * @param page
 * @returns {Promise<>}
 */
async function waitForPublish(page) {
    return await new Promise(r => setTimeout(r, 20000));
}

module.exports = {createPost}