#!/usr/bin/env bash
# ===================================================
# FiguSwap — Script de pruebas de API
# Uso: BASE_URL=http://localhost:3000 bash scripts/test-api.sh
# ===================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0
EMAIL="testuser_$(date +%s)@figuswap.test"
PASSWORD="test1234"
NAME="Test User"
COOKIE_FILE="/tmp/figuswap_test_cookies.txt"
SESSION_TOKEN=""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ PASS${NC} $1"; ((PASS++)); }
fail() { echo -e "${RED}✗ FAIL${NC} $1"; ((FAIL++)); }
section() { echo -e "\n${YELLOW}━━━ $1 ━━━${NC}"; }

assert_status() {
  local label="$1" expected="$2" actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    pass "$label (HTTP $actual)"
  else
    fail "$label — expected HTTP $expected, got $actual"
  fi
}

assert_contains() {
  local label="$1" needle="$2" haystack="$3"
  if echo "$haystack" | grep -q "$needle"; then
    pass "$label (contains '$needle')"
  else
    fail "$label — expected to contain '$needle', got: $haystack"
  fi
}

# ─── 1. Catálogo de figuritas ─────────────────────
section "1. Catálogo de figuritas"

RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/stickers")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n 1)

assert_status "GET /api/stickers" 200 "$STATUS"
assert_contains "Respuesta contiene 'stickers'" '"stickers"' "$BODY"
assert_contains "Respuesta contiene 'teams'" '"teams"' "$BODY"

STICKER_COUNT=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['stickers']))" 2>/dev/null || echo "N/A")
echo "  → Total figuritas en catálogo: $STICKER_COUNT"
if [ "$STICKER_COUNT" -eq 980 ] 2>/dev/null; then
  pass "Catálogo tiene exactamente 980 figuritas"
else
  fail "Catálogo debería tener 980, tiene $STICKER_COUNT"
fi

# Verificar códigos específicos
assert_contains "ARG1 existe en catálogo" '"ARG1"' "$BODY"
assert_contains "BRA20 existe en catálogo" '"BRA20"' "$BODY"
assert_contains "FWC1 existe en catálogo" '"FWC1"' "$BODY"
assert_contains "FWC20 existe en catálogo" '"FWC20"' "$BODY"

# ─── 2. Registro de usuario ───────────────────────
section "2. Registro de usuario"

RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"city\":\"Buenos Aires\"}")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n 1)

assert_status "POST /api/register" 201 "$STATUS"
assert_contains "Respuesta contiene 'userId'" '"userId"' "$BODY"

# Registro duplicado
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "Registro duplicado rechazado" 409 "$STATUS"

# Registro sin campos obligatorios
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Incompleto"}')
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "Registro incompleto rechazado" 400 "$STATUS"

# ─── 3. Auth — Login con credenciales ────────────
section "3. Autenticación"

# Necesitamos un token de sesión para las rutas protegidas
# NextAuth v5: usamos el endpoint de credenciales directamente
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -c "$COOKIE_FILE" \
  -d "email=${EMAIL}&password=${PASSWORD}&csrfToken=test&callbackUrl=http://localhost:3000")
STATUS=$(echo "$RESP" | tail -n 1)

# Obtener CSRF token
CSRF=$(curl -s "$BASE_URL/api/auth/csrf" -c "$COOKIE_FILE" -b "$COOKIE_FILE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('csrfToken',''))" 2>/dev/null || echo "")

if [ -n "$CSRF" ]; then
  pass "CSRF token obtenido"

  # Login real
  curl -s -X POST "$BASE_URL/api/auth/callback/credentials" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
    -d "email=${EMAIL}&password=${PASSWORD}&csrfToken=${CSRF}&callbackUrl=/" > /dev/null

  echo "  → Sesión iniciada para $EMAIL"
else
  fail "No se pudo obtener CSRF token (¿está corriendo el servidor?)"
fi

# ─── 4. Figuritas de usuario (requiere sesión) ────
section "4. CRUD de figuritas de usuario"

# Sin sesión, debe dar 401
RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/user/stickers")
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "GET /api/user/stickers sin sesión → 401" 401 "$STATUS"

RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/user/stickers" \
  -H "Content-Type: application/json" \
  -d '{"action":"have","codes":["ARG1"]}')
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "POST /api/user/stickers sin sesión → 401" 401 "$STATUS"

echo "  (Las pruebas con sesión requieren token JWT válido — ver test-stickers.js)"

# ─── 5. Estadísticas globales ─────────────────────
section "5. Estadísticas globales"

RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/stats")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "GET /api/stats" 200 "$STATUS"
assert_contains "totalUsers presente" '"totalUsers"' "$BODY"
assert_contains "confirmedMatches presente" '"confirmedMatches"' "$BODY"
assert_contains "completedTrades presente" '"completedTrades"' "$BODY"

# ─── 6. Matches — sin sesión ─────────────────────
section "6. Matches (protección)"
RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/matches")
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "GET /api/matches sin sesión → 401" 401 "$STATUS"

RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/matches/confirmed")
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "GET /api/matches/confirmed sin sesión → 401" 401 "$STATUS"

# ─── 7. Chat — sin sesión ────────────────────────
section "7. Chat (protección)"
RESP=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/chat/nonexistentid123")
STATUS=$(echo "$RESP" | tail -n 1)
assert_status "GET /api/chat/:id sin sesión → 401" 401 "$STATUS"

# ─── Resumen ──────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Resultados: ${GREEN}$PASS passed${NC} / ${RED}$FAIL failed${NC}"
[ $FAIL -eq 0 ] && echo -e "${GREEN}✅ Todos los tests pasaron${NC}" || echo -e "${RED}❌ Hay $FAIL test(s) fallidos${NC}"

# Cleanup
rm -f "$COOKIE_FILE"
