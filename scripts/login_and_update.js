const http = require('http')

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

;(async ()=>{
  try{
    const creds = { email: process.env.EMAIL || 'user@example.com', senha: process.env.PASSWORD || 'Senha123' }
    const login = await request({ hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, JSON.stringify(creds))
    console.log('LOGIN', login.status)
    if(login.status!==200){ console.log('Login body', login.body); process.exit(0) }
    const token = JSON.parse(login.body).token
    console.log('TOKEN', token)

    // List servicos
    const list = await request({ hostname: 'localhost', port: 8080, path: '/cservico/servico', method: 'GET', headers: { 'Authorization': 'Bearer '+token } })
    console.log('LIST STATUS', list.status)
    let items = []
    try{ items = JSON.parse(list.body) }catch(e){ console.log('List body parse error', list.body) }
    console.log('LIST LENGTH', items.length)

    if(items.length===0){ console.log('No items to update'); process.exit(0) }

    const first = items[0]
    const id = process.env.ID || first.codigo || first.id || first.code || first["codigo"]
    console.log('Using id:', id)

    const updated = Object.assign({}, first, { tipoServico: (first.tipoServico||'Tipo')+'-UPDATED' })

    const put = await request({ hostname: 'localhost', port: 8080, path: '/cservico/servico/'+id, method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token } }, JSON.stringify(updated))
    console.log('PUT STATUS', put.status)
    console.log('PUT BODY', put.body)
  }catch(e){ console.error('ERROR', e && e.message ? e.message : e) }
})()
