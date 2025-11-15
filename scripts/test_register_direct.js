const http = require('http')

const timestamp = Date.now()
const email = `e2e_register_${timestamp}@example.test`
const payload = JSON.stringify({ nome: `E2E Test ${timestamp}`, email, senha: 'Senha123!' })

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}

const req = http.request(options, res => {
  let body = ''
  res.setEncoding('utf8')
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    console.log('STATUS', res.statusCode)
    console.log('HEADERS', res.headers)
    console.log('BODY', body)
    console.log('\nRegistered user (if 200/201):', email)
  })
})

req.on('error', e => console.error('request error', e.message))
req.write(payload)
req.end()
