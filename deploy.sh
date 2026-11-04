#!/usr/bin/env bash
# Deploy the Sadamata stack on the production EC2 box.
#
# Assumes the repo at APP_DIR has already been updated (git fetch + reset) and
# that this script is run from the repo root. Apps are discovered dynamically:
# every top-level folder that owns a package.json is treated as an app, so
# nothing here hardcodes "frontend"/"merchant"/etc.
set -euo pipefail

APP_DIR=/mnt/mydrive/sadamata-fullstack
STATE="$HOME/.last_deployed_sha"
LOCK=/tmp/deploy.lock

# Non-interactive SSH sessions start with a bare PATH: no node, no pm2.
export PATH="/usr/local/bin:$HOME/.npm-global/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh"
fi

cd "$APP_DIR"

# Never let two deploys overlap.
exec 9>"$LOCK"
flock 9

NEW=$(git rev-parse HEAD)
OLD=""
if [ -f "$STATE" ]; then
  OLD=$(cat "$STATE")
fi

if [ "$OLD" = "$NEW" ]; then
  echo "no change ($NEW)"
  exit 0
fi

# Every top-level directory that has a package.json is an app.
discover_apps() {
  for d in */; do
    d="${d%/}"
    if [ -f "$d/package.json" ]; then
      echo "$d"
    fi
  done
  return 0
}

FULL=0
if [ -z "$OLD" ] || ! git cat-file -e "${OLD}^{commit}" 2>/dev/null; then
  echo "no valid previous SHA on record - rebuilding every app"
  APPS=$(discover_apps)
  FULL=1
else
  echo "deploying $OLD -> $NEW"
  APPS=$(
    discover_apps | while read -r app; do
      if git diff --name-only "$OLD" "$NEW" -- "$app" | grep -q .; then
        echo "$app"
      fi
    done
  )
fi

# Root tooling changed (or we cannot diff) - refresh root deps.
if [ "$FULL" = 1 ]; then
  npm install
elif git diff --name-only "$OLD" "$NEW" -- package.json | grep -q .; then
  npm install
fi

for app in $APPS; do
  echo "==> building $app"
  (
    cd "$app"
    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install
    fi
    if node -e "process.exit(require('./package.json').scripts?.build ? 0 : 1)"; then
      npm run build
    fi
  )
done

# Only after every build succeeded: reload the PM2 apps.
pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
pm2 save

# Written last, so a failed build is retried on the next deploy.
echo "$NEW" >"$STATE"
echo "deployed $NEW"
