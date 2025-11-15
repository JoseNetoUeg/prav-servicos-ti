# Autenticação — exemplos de uso

Este documento reúne exemplos práticos para registrar, autenticar e usar o token (JWT) com o backend de serviços.

URLs usadas nos exemplos: `http://localhost:8080`

## 1) Registrar um usuário (PowerShell)

```powershell
$body = @{ email='user@example.com'; senha='Senha123'; nome='Fulano' } | ConvertTo-Json
$reg = Invoke-RestMethod -Method Post -Uri http://localhost:8080/auth/register -Body $body -ContentType 'application/json'
$reg | Format-List
```

Resposta esperada (exemplo):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

## 2) Login (PowerShell)

```powershell
$body = @{ email='user@example.com'; senha='Senha123' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8080/auth/login -Body $body -ContentType 'application/json'
$login | Format-List
```

Se o campo retornado não for `token`, verifique `accessToken` ou `jwt`.

## 3) Usar o token em uma requisição protegida (PowerShell)

```powershell
$token = $login.token
Invoke-RestMethod -Method Get -Uri http://localhost:8080/cservico/servico -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5
```

## 4) Exemplos com curl (Linux / macOS / Git Bash)

Registrar:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"Senha123","nome":"Fulano"}'
```

Login (retorna token):

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"Senha123"}'
```

Usar token em requisição protegida:

```bash
curl -H "Authorization: Bearer <SEU_TOKEN_AQUI>" http://localhost:8080/cservico/servico
```

## 5) Observações sobre o token

- O token retornado é um JWT: header.payload.signature (três partes separadas por ponto).
- Se receber 401/403 ao acessar um endpoint protegido, verifique:
  - o token não expirou (claim `exp`);
  - o header `Authorization` está no formato `Bearer <token>`;
  - o `jwt.secret` no backend corresponde ao usado para validar o token;
  - se o endpoint exige roles/claims específicas (por ex., `ROLE_ADMIN`).

## 6) Salvar token localmente (PowerShell)

```powershell
$login.token | Out-File -Encoding utf8 .\token.txt
```

## 7) Troubleshooting rápido

- `Email já cadastrado`: use `/auth/login` em vez de registrar.
- `jwt.secret` não configurado: defina `jwt.secret` em `src/main/resources/application.properties` ou via variável de ambiente `JWT_SECRET`.
- `expiração do token`: verifique a claim `exp` decodificando o payload do JWT.

## 8) Scripts de ajuda
Na pasta `scripts/` incluí exemplos prontos de login em PowerShell e bash (curl). Use-os para validar rapidamente.

---
Documento gerado automaticamente a partir do README fornecido.

## 9) Nota sobre testes E2E em ambiente de desenvolvimento

Durante o desenvolvimento usamos um servidor com HMR (vite) e o backend local. Em muitos ambientes de dev o backend não está configurado para liberar CORS para `http://localhost:4200`, então requisições feitas diretamente pelo navegador (UI) serão bloqueadas por políticas de CORS.

Para contornar isso em scripts automatizados e testes E2E locais criamos um fallback seguro:

- Primeiro tentamos executar a ação via navegador (simulando usuário). Se a requisição for bloqueada por CORS ou não for observada, o script faz a mesma chamada diretamente do Node (processo local) para o backend. Chamadas Node não são afetadas por CORS e permitem validar o endpoint e obter tokens para testes posteriores.

Este fallback é apenas para testes locais e não deve ser considerado uma solução para produção. A correção ideal é habilitar CORS no backend para permitir chamadas do frontend (ver seção acima sobre configuração CORS).

