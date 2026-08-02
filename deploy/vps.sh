#!/usr/bin/env sh
# Deploy the static production site. Usage: deploy/vps.sh user@host
set -eu

host="${1:?usage: deploy/vps.sh user@host}"
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(CDPATH= cd -- "$script_dir/.." && pwd)

cd "$root"
npm run build

ssh "$host" 'sudo install -d -o root -g caddy -m 750 /opt/hotmethod'
rsync --archive --delete --compress --human-readable \
  --rsync-path="sudo rsync" \
  --chown=root:caddy --chmod=D750,F640 \
  "$root/_site/" \
  "$host:/opt/hotmethod/"

ssh "$host" 'test -f /opt/hotmethod/index.html'
printf 'Static site deployed to /opt/hotmethod.\n'
