// Optional real-browser regression. Start the lab in Sample mode first.
// Uses Playwright from your tooling installation; adds no app dependencies.
const assert = require('node:assert/strict');

async function main() {
    const base = new URL(process.argv[2] || 'http://localhost:5103');
    assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Only a local test server is allowed.');
    const home = await fetch(base);
    assert.equal(home.status, 200, 'App page must load.');
    assert.match(await home.text(), /Simulated stream/, 'Run this check in free Sample mode.');
    for (const asset of ['/app.css', '/_framework/blazor.web.js']) {
        const response = await fetch(new URL(asset, base));
        assert.equal(response.status, 200, `${asset} must be served, not merely present in a build manifest.`);
        assert.ok((await response.text()).length > 0, `${asset} must contain content.`);
    }
    console.log('PASS app, CSS and Blazor bootstrap HTTP 200');

    const playwright = require('playwright');
    const browser = await playwright.chromium.launch();
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base.href);
        await page.waitForFunction(() => !document.querySelector('#generate-draft').disabled, { timeout: 10000 });
        await page.locator('#ticket').fill('A fictional sample parcel is delayed.');
        await page.locator('#generate-draft').click();
        await page.waitForFunction(() => document.querySelector('#draft-output').textContent.length > 0);
        await page.waitForFunction(() => !document.querySelector('#staff-review').disabled);
        assert.match(await page.locator('#draft-output').innerText(), /Thank you for contacting/);
        assert.match(await page.locator('#draft-status').innerText(), /Ready for staff review/);
        await page.locator('#staff-review').check();
        assert.equal(await page.locator('#staff-review').isChecked(), true);
        assert.deepEqual(errors, [], 'No browser errors expected.');
        console.log('PASS live Blazor circuit: Generate, streamed sample, completion and review');
    } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
