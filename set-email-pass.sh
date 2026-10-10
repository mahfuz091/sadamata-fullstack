#!/usr/bin/env bash
# Writes EMAIL_PASS into all four .env files without echoing the secret.
# Run from the repo root:  bash set-email-pass.sh
set -euo pipefail

read -rsp "Zoho app password: " PASS
echo

if [ -z "$PASS" ]; then
  echo "Nothing entered, aborting." >&2
  exit 1
fi

for app in frontend merchant brand dashboard; do
  f="$app/.env"
  [ -f "$f" ] || { echo "missing $f" >&2; exit 1; }

  if grep -q '^EMAIL_PASS=' "$f"; then
    # Delete the old line and append the new one, so no shell metacharacter in
    # the password can be interpreted as sed syntax.
    grep -v '^EMAIL_PASS=' "$f" > "$f.tmp"
    printf 'EMAIL_PASS=%s\n' "$PASS" >> "$f.tmp"
    mv "$f.tmp" "$f"
  else
    printf 'EMAIL_PASS=%s\n' "$PASS" >> "$f"
  fi

  echo "set in $f"
done

unset PASS
echo "Done. Now run: node verify-zoho.mjs"
