#!/usr/bin/env bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3001/api/auth"

echo -e "${YELLOW}=== AUTH API VERIFICATION SCRIPT ===${NC}"
echo "Target URL: $API_URL"
echo "--------------------------------------"

# 1. Register a new user
echo -e "\n${YELLOW}[1/6] Registering new user (test@example.com)...${NC}"
REG_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123", "name":"Test User"}')

REG_STATUS=$(echo "$REG_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
REG_BODY=$(echo "$REG_RESP" | grep -v "HTTP_STATUS")

if [ "$REG_STATUS" -eq 201 ]; then
  echo -e "${GREEN}SUCCESS: User registered successfully (Status $REG_STATUS)${NC}"
  echo "Response: $REG_BODY"
else
  echo -e "${RED}FAILED: Register returned status $REG_STATUS${NC}"
  echo "Response: $REG_BODY"
fi

# 2. Register duplicate email
echo -e "\n${YELLOW}[2/6] Testing duplicate email registration...${NC}"
DUP_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123", "name":"Test User"}')

DUP_STATUS=$(echo "$DUP_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
DUP_BODY=$(echo "$DUP_RESP" | grep -v "HTTP_STATUS")

if [ "$DUP_STATUS" -eq 409 ] && [[ "$DUP_BODY" == *"Email already exists"* ]]; then
  echo -e "${GREEN}SUCCESS: Correctly blocked duplicate email with status 409${NC}"
  echo "Response: $DUP_BODY"
else
  echo -e "${RED}FAILED: Expected 409 with 'Email already exists', got status $DUP_STATUS${NC}"
  echo "Response: $DUP_BODY"
fi

# 3. Login
echo -e "\n${YELLOW}[3/6] Logging in with correct credentials...${NC}"
LOGIN_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}')

LOGIN_STATUS=$(echo "$LOGIN_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
LOGIN_BODY=$(echo "$LOGIN_RESP" | grep -v "HTTP_STATUS")

if [ "$LOGIN_STATUS" -eq 200 ]; then
  echo -e "${GREEN}SUCCESS: Logged in successfully (Status $LOGIN_STATUS)${NC}"
  echo "Response: $LOGIN_BODY"
  
  # Extract tokens using grep/sed (fallback if jq not installed)
  ACCESS_TOKEN=$(echo "$LOGIN_BODY" | grep -o '"accessToken":"[^"]*' | grep -o '[^"]*$')
  REFRESH_TOKEN=$(echo "$LOGIN_BODY" | grep -o '"refreshToken":"[^"]*' | grep -o '[^"]*$')
else
  echo -e "${RED}FAILED: Login returned status $LOGIN_STATUS${NC}"
  echo "Response: $LOGIN_BODY"
  exit 1
fi

# 4. Login fail (Wrong password)
echo -e "\n${YELLOW}[4/6] Testing login failure (incorrect password)...${NC}"
FAIL_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"wrongpassword"}')

FAIL_STATUS=$(echo "$FAIL_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
FAIL_BODY=$(echo "$FAIL_RESP" | grep -v "HTTP_STATUS")

if [ "$FAIL_STATUS" -eq 401 ] && [[ "$FAIL_BODY" == *"Email or password incorrect"* ]]; then
  echo -e "${GREEN}SUCCESS: Correctly returned 401 for bad password${NC}"
  echo "Response: $FAIL_BODY"
else
  echo -e "${RED}FAILED: Expected 401, got status $FAIL_STATUS${NC}"
  echo "Response: $FAIL_BODY"
fi

# 5. Access protected /me route
echo -e "\n${YELLOW}[5/6] Accessing protected route /me...${NC}"
ME_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

ME_STATUS=$(echo "$ME_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
ME_BODY=$(echo "$ME_RESP" | grep -v "HTTP_STATUS")

if [ "$ME_STATUS" -eq 200 ] && [[ "$ME_BODY" == *"test@example.com"* ]]; then
  echo -e "${GREEN}SUCCESS: Authorized and retrieved profile (Status $ME_STATUS)${NC}"
  echo "Response: $ME_BODY"
else
  echo -e "${RED}FAILED: /me returned status $ME_STATUS${NC}"
  echo "Response: $ME_BODY"
fi

# 6. Refresh tokens
echo -e "\n${YELLOW}[6/6] Refreshing tokens...${NC}"
REF_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

REF_STATUS=$(echo "$REF_RESP" | tr -d '\r' | grep "HTTP_STATUS" | cut -d':' -f2)
REF_BODY=$(echo "$REF_RESP" | grep -v "HTTP_STATUS")

if [ "$REF_STATUS" -eq 200 ]; then
  echo -e "${GREEN}SUCCESS: Token refreshed successfully (Status $REF_STATUS)${NC}"
  echo "Response: $REF_BODY"
else
  echo -e "${RED}FAILED: Refresh returned status $REF_STATUS${NC}"
  echo "Response: $REF_BODY"
fi

echo -e "\n${GREEN}=== Verification completed! ===${NC}"
