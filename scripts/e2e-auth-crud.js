const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const logs = { steps: [], network: [] };

  function pushNetwork(type, info) {
    logs.network.push({ type, ...info, timestamp: Date.now() });
  }

  page.on('request', req => {
    pushNetwork('request', { url: req.url(), method: req.method(), headers: req.headers(), postData: req.postData() });
  });
  page.on('response', async res => {
    let body = null;
    try {
      const ct = res.headers()['content-type'] || '';
      if (ct.includes('application/json') || ct.includes('text') || ct.includes('application/xml') || ct.includes('text/html')) {
        body = await res.text();
      } else {
        body = '<binary or non-text response>';
      }
    } catch (e) {
      body = '<error reading body: ' + e.message + '>';
    }
    pushNetwork('response', { url: res.url(), status: res.status(), headers: res.headers(), body });
  });

  const base = 'http://localhost:4200';
  const backendBase = 'http://localhost:8080';

  const user = {
    nome: 'Teste E2E',
    email: `e2e_${Date.now()}@example.test`,
    senha: 'Senha123!'
  };

  let tokenVar = null;

  // 1) Register
  try {
    logs.steps.push('navigate_register');
    await page.goto(`${base}/register`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.fill('input[name="nome"]', user.nome);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="senha"]', user.senha);
    // wait for network call to /auth/register
    const [regResp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/auth/register') && r.request().method() === 'POST', { timeout: 10000 }).catch(e => null),
      page.click('button[type="submit"]')
    ]);
    if (regResp) {
      const status = regResp.status();
      const body = await regResp.text();
      logs.steps.push({ action: 'register_response', status, body });
    } else {
      // fallback: call backend directly from Node
      try {
        const http = require('http');
        const payload = JSON.stringify({ nome: user.nome, email: user.email, senha: user.senha });
        const resp = await new Promise((resolve, reject) => {
          const req = http.request({ host: 'localhost', port: 8080, path: '/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({ status: res.statusCode, body: b }));
          });
          req.on('error', e => reject(e));
          req.write(payload); req.end();
        });
        logs.steps.push({ action: 'register_response_fallback', status: resp.status, body: resp.body });
      } catch (e) {
        logs.steps.push({ action: 'register_response', status: 'no-response', error: e.message });
      }
    }
    await page.screenshot({ path: 'logs/e2e_register.png' }).catch(()=>{});
  } catch (err) {
    logs.steps.push({ action: 'register_error', message: err.message });
  }

  // 2) Login
  try {
    logs.steps.push('navigate_login');
    await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="senha"]', user.senha);

    const [loginResp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/auth/login') && r.request().method() === 'POST', { timeout: 10000 }).catch(e => null),
      page.click('button[type="submit"]')
    ]);

    if (loginResp) {
      const status = loginResp.status();
      const body = await loginResp.text();
      logs.steps.push({ action: 'login_response', status, body });
    } else {
      // fallback: call backend /auth/login directly from Node
      try {
        const http = require('http');
        const payload = JSON.stringify({ email: user.email, senha: user.senha });
        const resp = await new Promise((resolve, reject) => {
          const req = http.request({ host: 'localhost', port: 8080, path: '/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({ status: res.statusCode, body: b }));
          });
          req.on('error', e => reject(e));
          req.write(payload); req.end();
        });
        logs.steps.push({ action: 'login_response_fallback', status: resp.status, body: resp.body });
        // if token found, set it into localStorage
        try {
          const parsed = JSON.parse(resp.body || '{}');
          const token = parsed.token || parsed.accessToken || parsed.jwt || null;
          if (token) {
            tokenVar = token;
            await page.evaluate(t => localStorage.setItem('auth_token', t), token);
            logs.steps.push({ action: 'token_set_via_fallback', token: token });
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        logs.steps.push({ action: 'login_response', status: 'no-response', error: e.message });
      }
    }
    await page.screenshot({ path: 'logs/e2e_login.png' }).catch(()=>{});

    // check localStorage token
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    logs.steps.push({ action: 'token_in_storage', token: token || null });
  } catch (err) {
    logs.steps.push({ action: 'login_error', message: err.message });
  }

  // 3) Create a servico (if logged)
  try {
    logs.steps.push('navigate_create');
    await page.goto(`${base}/servicos/create`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // fill fields
    await page.fill('input[name="tipo"]', 'E2E Tipo');
    await page.fill('textarea[name="descricao"]', 'Descrição enviadapor E2E');
    // set date to today
    const today = new Date().toISOString().slice(0,10);
    await page.fill('input[name="data"]', today);
    await page.fill('input[name="valor"]', '123.45');
    // check disponivel
    await page.check('input[name="disponivel"]');

    const [createResp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/cservico/servico') && r.request().method() === 'POST', { timeout: 10000 }).catch(e => null),
      page.click('button[type="submit"]')
    ]);

    let createdId = null;
    if (createResp) {
      const status = createResp.status();
      const body = await createResp.text();
      logs.steps.push({ action: 'create_response', status, body });
      try {
        const j = JSON.parse(body);
        createdId = j.id || j.codigo || j['idServico'] || null;
      } catch (e) {}
    } else {
      // fallback: call backend create directly from Node using tokenVar or token in localStorage
      try {
        const http = require('http');
        // try get token from page localStorage if tokenVar not set
        if (!tokenVar) {
          tokenVar = await page.evaluate(() => localStorage.getItem('auth_token'));
        }
        const payload = JSON.stringify({ tipoServico: 'E2E Tipo', descricaoDetalhada: 'Descrição enviadapor E2E', dataExecucao: new Date().toISOString().slice(0,10), valor: 123.45, disponivel: true });
        const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
        if (tokenVar) headers['Authorization'] = `Bearer ${tokenVar}`;
        const resp = await new Promise((resolve, reject) => {
          const req = http.request({ host: 'localhost', port: 8080, path: '/cservico/servico', method: 'POST', headers }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({ status: res.statusCode, body: b }));
          });
          req.on('error', e => reject(e));
          req.write(payload); req.end();
        });
        logs.steps.push({ action: 'create_response_fallback', status: resp.status, body: resp.body });
        try { const pj = JSON.parse(resp.body||'{}'); createdId = pj.id || pj.codigo || pj['idServico'] || null; } catch(e){}
      } catch (e) {
        logs.steps.push({ action: 'create_response', status: 'no-response', error: e.message });
      }
    }
    await page.screenshot({ path: 'logs/e2e_create.png' }).catch(()=>{});

    // 4) If createdId, try update and delete via fetch inside page
    if (createdId) {
      logs.steps.push({ action: 'created_id', createdId });
      // Playwright evaluate accepts a single serializable argument — wrap multiple values into an object
      const updateResult = await page.evaluate(async (args) => {
        try {
          const { backendBase, id } = args;
          const token = localStorage.getItem('auth_token');
          const resp = await fetch(`${backendBase}/cservico/servico/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
            body: JSON.stringify({ tipoServico: 'E2E Tipo Atualizado', descricaoDetalhada: 'Atualizado', dataExecucao: new Date().toISOString().slice(0,10), valor: 200.00, disponivel: false })
          });
          const txt = await resp.text();
          return { status: resp.status, body: txt };
        } catch (e) {
          return { status: 'error', body: String(e && e.message ? e.message : e) };
        }
      }, { backendBase, id: createdId });
      logs.steps.push({ action: 'update_result', updateResult });

      // If page-based update failed (CORS or fetch error), fallback to Node HTTP PUT
      if (updateResult && updateResult.status === 'error') {
        try {
          const http = require('http');
          if (!tokenVar) tokenVar = await page.evaluate(() => localStorage.getItem('auth_token'));
          const payload = JSON.stringify({ tipoServico: 'E2E Tipo Atualizado', descricaoDetalhada: 'Atualizado', dataExecucao: new Date().toISOString().slice(0,10), valor: 200.00, disponivel: false });
          const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
          if (tokenVar) headers['Authorization'] = `Bearer ${tokenVar}`;
          const putResp = await new Promise((resolve, reject) => {
            const req = http.request({ host: 'localhost', port: 8080, path: `/cservico/servico/${createdId}`, method: 'PUT', headers }, res => {
              let b = ''; res.on('data', c => b += c); res.on('end', () => resolve({ status: res.statusCode, body: b }));
            });
            req.on('error', e => reject(e)); req.write(payload); req.end();
          });
          logs.steps.push({ action: 'update_result_fallback', updateResult: putResp });
        } catch (e) {
          logs.steps.push({ action: 'update_result_fallback_error', error: e.message });
        }
      }

      const deleteResult = await page.evaluate(async (args) => {
        try {
          const { backendBase, id } = args;
          const token = localStorage.getItem('auth_token');
          const resp = await fetch(`${backendBase}/cservico/servico/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          });
          return { status: resp.status, body: await resp.text() };
        } catch (e) {
          return { status: 'error', body: String(e && e.message ? e.message : e) };
        }
      }, { backendBase, id: createdId });
      logs.steps.push({ action: 'delete_result', deleteResult });

      if (deleteResult && deleteResult.status === 'error') {
        try {
          const http = require('http');
          if (!tokenVar) tokenVar = await page.evaluate(() => localStorage.getItem('auth_token'));
          const headers = {};
          if (tokenVar) headers['Authorization'] = `Bearer ${tokenVar}`;
          const delResp = await new Promise((resolve, reject) => {
            const req = http.request({ host: 'localhost', port: 8080, path: `/cservico/servico/${createdId}`, method: 'DELETE', headers }, res => {
              let b = ''; res.on('data', c => b += c); res.on('end', () => resolve({ status: res.statusCode, body: b }));
            });
            req.on('error', e => reject(e)); req.end();
          });
          logs.steps.push({ action: 'delete_result_fallback', deleteResult: delResp });
        } catch (e) {
          logs.steps.push({ action: 'delete_result_fallback_error', error: e.message });
        }
      }
    }

  } catch (err) {
    logs.steps.push({ action: 'create_error', message: err.message });
  }

  await browser.close();

  try { fs.mkdirSync('logs', { recursive: true }); } catch (e) {}
  fs.writeFileSync('logs/e2e-auth-crud.json', JSON.stringify(logs, null, 2));
  console.log('E2E logs saved to logs/e2e-auth-crud.json and screenshots in logs/');
})();
