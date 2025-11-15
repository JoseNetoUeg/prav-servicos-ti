const http = require('http')

const data = JSON.stringify({
  email: process.env.EMAIL || 'user@example.com',
  senha: process.env.PASSWORD || 'Senha123'
})

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
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
  })
})

req.on('error', e => console.error('request error', e.message))
req.write(data)
req.end()
