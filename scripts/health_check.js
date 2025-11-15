const http = require('http')

const options = { hostname: 'localhost', port: 4200, path: '/', method: 'GET', timeout: 5000 }

const req = http.request(options, res => {
  console.log('STATUS', res.statusCode)
  res.on('data', () => {})
  res.on('end', () => process.exit(0))
})

req.on('error', e => { console.error('ERROR', e.message); process.exit(2) })
req.end()
