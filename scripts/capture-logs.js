const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const logs = { console: [], network: [] };

  page.on('console', msg => {
    try {
      const location = msg.location();
      logs.console.push({ type: msg.type(), text: msg.text(), location });
    } catch (e) {
      logs.console.push({ type: msg.type(), text: msg.text() });
    }
  });

  page.on('request', request => {
    logs.network.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
      timestamp: Date.now()
    });
  });

  page.on('response', async response => {
    let body = null;
    try {
      const ct = response.headers()['content-type'] || '';
      if (ct.includes('application/json') || ct.includes('text') || ct.includes('application/xml') || ct.includes('text/html')) {
        body = await response.text();
      } else {
        body = '<binary or non-text response>';
      }
    } catch (e) {
      body = '<error reading body: ' + e.message + '>';
    }

    logs.network.push({
      type: 'response',
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      body,
      timestamp: Date.now()
    });
  });

  const paths = ['/', '/servicos', '/login', '/register'];
  const base = 'http://localhost:4200';

  for (const p of paths) {
    const url = base + p;
    try {
      console.log('Navigating to', url);
      // Avoid waiting for 'networkidle' which may hang due to HMR/websocket.
      // Use domcontentloaded and a longer timeout, with a retry on failure.
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1200);
      // Take a screenshot for visual inspection
      const safeName = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '') || 'root';
      await page.screenshot({ path: `logs/screenshot_${safeName}.png`, fullPage: false }).catch(()=>{});
    } catch (err) {
      // retry once with a longer timeout
      try {
        logs.console.push({ type: 'warn', text: `First navigation attempt failed for ${url}: ${err.message}. Retrying...` });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await page.waitForTimeout(1200);
        const safeName = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '') || 'root';
        await page.screenshot({ path: `logs/screenshot_${safeName}.png`, fullPage: false }).catch(()=>{});
      } catch (err2) {
        logs.console.push({ type: 'error', text: `Navigation error for ${url}: ${err2.message}` });
      }
    }
  }

  await browser.close();

  try { fs.mkdirSync('logs', { recursive: true }); } catch (e) {}
  fs.writeFileSync('logs/capture-logs.json', JSON.stringify(logs, null, 2));
  console.log('Logs saved to logs/capture-logs.json and screenshots in logs/');
})();
