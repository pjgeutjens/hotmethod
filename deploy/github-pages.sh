#!/usr/bin/env sh
set -eu

repo="${GITHUB_REPOSITORY:-pjgeutjens/hotmethod}"
branch="${GITHUB_PAGES_BRANCH:-gh-pages}"
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(CDPATH= cd -- "$script_dir/.." && pwd)

cd "$root"
npm run build:pages

staging=$(mktemp -d)
trap 'rm -rf "$staging"' EXIT HUP INT TERM
cp -R "$root/_site/." "$staging/"

git -C "$staging" init --initial-branch="$branch"
git -C "$staging" config user.name "Pieter Geutjens"
git -C "$staging" config user.email "pieter.geutjens@leapconsulting.be"
git -C "$staging" add --all
git -C "$staging" commit -m "Publish review site"
git -C "$staging" remote add origin "https://github.com/${repo}.git"
git -C "$staging" push --force origin "$branch"
