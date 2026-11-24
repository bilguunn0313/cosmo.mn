#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

target="${1:-origin/main}"
previous_commit="$(git rev-parse --short HEAD)"

trap 'echo "!! Deploy failed. Roll back with: bash scripts/deploy.sh $previous_commit" >&2' ERR

wait_for() {
  local url="$1"

  for _ in $(seq 1 30); do
    if curl -fsS -o /dev/null "$url"; then
      return 0
    fi
    sleep 2
  done

  echo "!! $url did not respond" >&2
  return 1
}

echo "==> Backing up database and uploads"
bash scripts/backup.sh

echo "==> Checking out $target"
git fetch origin
git checkout --detach "$target"

echo "==> Installing dependencies"
npm ci --include=dev

echo "==> Building shared package"
npm run build -w packages/shared

echo "==> Applying database migrations"
(cd apps/api && npx prisma migrate deploy && npx prisma generate)

echo "==> Building and restarting API"
npm run build -w apps/api
pm2 startOrReload ecosystem.config.cjs --only cosmo-api --update-env
wait_for http://127.0.0.1:4000/health

echo "==> Building and restarting web"
npm run build -w apps/web
pm2 startOrReload ecosystem.config.cjs --only cosmo-web --update-env
wait_for http://127.0.0.1:3000/mn

pm2 save

echo "==> Deployed $(git rev-parse --short HEAD) (previous: $previous_commit)"
echo "    Roll back with: bash scripts/deploy.sh $previous_commit"
