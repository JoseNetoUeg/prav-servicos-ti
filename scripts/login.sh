#!/usr/bin/env bash
# Usage: ./scripts/login.sh user@example.com Senha123
EMAIL=${1:-user@example.com}
SENHA=${2:-Senha123}
BASEURL=${3:-http://localhost:8080}

BODY=$(printf '{"email":"%s","senha":"%s"}' "$EMAIL" "$SENHA")
echo "POST $BASEURL/auth/login"
curl -s -X POST "$BASEURL/auth/login" -H "Content-Type: application/json" -d "$BODY" | jq '.'
