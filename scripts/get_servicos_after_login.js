const http = require('http')

const EMAIL = process.env.EMAIL || 'user@example.com'
const PASSWORD = process.env.PASSWORD || 'Senha123'

function request(options, body=null){
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }))
    })
    req.on('error', reject)
    if(body) req.write(body)
    req.end()
  })
}

(async ()=>{
  try{
    const payload = JSON.stringify({ email: EMAIL, senha: PASSWORD })
    const login = await request({ hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, payload)
    console.log('LOGIN STATUS', login.status)
    console.log('LOGIN BODY', login.body)
    if(login.status !== 200){ process.exit(1) }
    const parsed = JSON.parse(login.body || '{}')
    const token = parsed.token || parsed.accessToken || parsed.jwt || null
    if(!token){ console.error('No token in login response'); process.exit(2) }

    const list = await request({ hostname: 'localhost', port: 8080, path: '/cservico/servico', method: 'GET', headers: { 'Authorization': 'Bearer '+token } })
    console.log('\nGET /cservico/servico STATUS', list.status)
    console.log('HEADERS', list.headers)
    console.log('BODY', list.body)
  }catch(e){ console.error('ERROR', e && e.message ? e.message : e) }
})()
