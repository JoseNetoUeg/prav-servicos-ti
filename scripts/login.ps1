<#
  scripts/login.ps1
  Uso: powershell -File .\scripts\login.ps1 -Email user@example.com -Senha Senha123
  Faz login e salva o token em ./token.txt
#>

param(
  [string]$Email = 'user@example.com',
  [string]$Senha = 'Senha123',
  [string]$BaseUrl = 'http://localhost:8080'
)

$body = @{ email=$Email; senha=$Senha } | ConvertTo-Json
try {
  $login = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/login" -Body $body -ContentType 'application/json'
  $login | Format-List
  if ($login -and $login.token) {
    $login.token | Out-File -Encoding utf8 .\token.txt
    Write-Host "Token salvo em ./token.txt"
  } else {
    Write-Host "Resposta não contém 'token'. Salve manualmente ou inspecione o objeto.`n`$login:`n$($login | ConvertTo-Json -Depth 5)"
  }
} catch {
  Write-Host "Erro: $($_.Exception.Message)"
}
