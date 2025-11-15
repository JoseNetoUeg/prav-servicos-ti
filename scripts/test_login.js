const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const base = 'http://localhost:4200';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const log = { console: [], network: [], result: null };

  page.on('console', msg => log.console.push({type: msg.type(), text: msg.text()}));
  page.on('request', req => log.network.push({ type: 'request', url: req.url(), method: req.method(), postData: req.postData() }));
  page.on('response', async res => {
    let body = null;
    try { body = await res.text(); } catch(e) { body = '<non-text>'; }
    log.network.push({ type: 'response', url: res.url(), status: res.status(), body });
  });

  try {
    await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Fill with test credentials (adjust if needed)
    await page.fill('input[name="email"]', 'user@example.com').catch(()=>{});
    await page.fill('input[name="senha"]', 'Senha123').catch(()=>{});

    // Wait for response to /auth/login triggered by submit
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/auth/login') && r.request().method() === 'POST', { timeout: 10000 }).catch(e => null),
      page.click('button[type="submit"]').catch(()=>{})
    ]);

    if (resp) {
      const status = resp.status();
      const body = await resp.text().catch(()=>'<no-body>');
      log.result = { action: 'login_response', status, body };
    } else {
      log.result = { action: 'login_response', status: 'no-response' };
    }

    await page.screenshot({ path: 'logs/login_test.png' }).catch(()=>{});
  } catch (e) {
    log.result = { action: 'error', message: e.message };
  }

  await browser.close();
  try { fs.mkdirSync('logs', { recursive: true }); } catch(e) {}
  fs.writeFileSync('logs/login_test.json', JSON.stringify(log, null, 2));
  console.log('Saved logs/login_test.json and logs/login_test.png');
})();
