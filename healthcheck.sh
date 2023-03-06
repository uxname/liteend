#!/bin/sh

HEALTHCHECK_URL="http://127.0.0.1:${PORT}/health"
HEALTHCHECK_RESPONSE=$(wget -qO- "$HEALTHCHECK_URL")

if echo "$HEALTHCHECK_RESPONSE" | grep -q "\"status\":\"ok\""; then
  echo "Healthcheck passed!"
  exit 0
else
  echo "Healthcheck failed."
  exit 1
fi
