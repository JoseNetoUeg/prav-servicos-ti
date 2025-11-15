const http = require('http');
const fs = require('fs');
const path = require('path');

async function main(){
  const logPath = path.resolve(__dirname, '..', 'logs', 'e2e-auth-crud.json');
  if (!fs.existsSync(logPath)){
    console.error('logs/e2e-auth-crud.json not found. Run the E2E script first.');
    process.exit(2);
  }

  const raw = fs.readFileSync(logPath, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch(e){ console.error('failed to parse log json:', e.message); process.exit(2); }

  // find last token and last createdId
  // Allow overriding token via env var DEBUG_TOKEN (useful for manual tests)
  let token = process.env.DEBUG_TOKEN || null;
  let createdId = null;
  for (const s of j.steps){
    if (!token && s && s.action === 'token_set_via_fallback' && s.token) token = s.token;
    if (!token && s && s.action === 'token_in_storage' && s.token) token = token || s.token;
    if (s && s.action === 'created_id' && s.createdId) createdId = s.createdId;
    if (s && s.action === 'create_response_fallback'){
      try{ const p = JSON.parse(s.body||'{}'); createdId = createdId || (p.id||p.codigo||p.idServico||null); }catch(e){}
    }
  }

  if (!token) { console.error('No token found in logs. Aborting.'); process.exit(2); }
  if (!createdId) { console.error('No createdId found in logs. Aborting.'); process.exit(2); }

  console.log('Using token (first 80 chars):', token.slice(0,80));
  console.log('Using createdId:', createdId);

  const payload = JSON.stringify({ tipoServico: 'E2E Tipo Atualizado (debug)', descricaoDetalhada: 'Atualizado via debug_put', dataExecucao: new Date().toISOString().slice(0,10), valor: 250.00, disponivel: false });

  const options = {
    host: 'localhost', port: 8080, path: `/cservico/servico/${createdId}`, method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${token}` }
  };

  const req = http.request(options, res => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', res.headers);
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('BODY:', b);
      process.exit(0);
    });
  });

  req.on('error', e => {
    console.error('Request error:', e.message);
    process.exit(2);
  });

  req.write(payload);
  req.end();
}

main();
