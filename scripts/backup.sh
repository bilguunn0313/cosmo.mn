#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

read_env() {
  grep -E "^$1=" apps/api/.env | tail -n 1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/' || true
}

database_url="$(read_env DATABASE_URL)"
uploads_dir="$(read_env UPLOADS_DIR)"
uploads_dir="${uploads_dir:-apps/api/uploads}"
backup_dir="${BACKUP_DIR:-/srv/cosmo-data/backups}"
keep_days=14
timestamp="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$backup_dir/db" "$backup_dir/uploads" "$uploads_dir"

echo "==> Dumping database"
pg_dump --format=custom --file="$backup_dir/db/cosmo-$timestamp.dump" "${database_url%%[?]*}"

echo "==> Copying uploads"
rsync -a "$uploads_dir/" "$backup_dir/uploads/"

find "$backup_dir/db" -name "*.dump" -mtime +"$keep_days" -delete

echo "==> Backup saved to $backup_dir"
