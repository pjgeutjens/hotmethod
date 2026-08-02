# Hosting hotmethod.eboonad.com

The Hot Method roster is a static Eleventy site hosted on the same Hetzner VPS
as `www.eboonad.com` and Midash. It has no runtime service, token, database, or
write access: Caddy reads the generated files from `/opt/hotmethod` as its own
unprivileged group.

## DNS

The one.com A record for `hotmethod.eboonad.com` must resolve to
`91.107.203.134` before Caddy can obtain its certificate.

## First deployment

From this repository:

```sh
deploy/vps.sh pgs@91.107.203.134
```

This builds locally and synchronizes only `_site/` into `/opt/hotmethod` with
`root:caddy` ownership. Eleventy is not installed on the VPS.

Add `deploy/Caddyfile.example` to `/etc/caddy/Caddyfile`. Before reloading the
shared proxy, make a dated backup and validate the complete configuration:

```sh
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak-before-hotmethod-20260802
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
```

## Verification

After every production deployment, verify:

- `https://hotmethod.eboonad.com/`, `/robots.txt`, and `/sitemap.xml` return 200;
- the homepage canonical and Open Graph URL use `hotmethod.eboonad.com`;
- the homepage is indexable and the sitemap names the production hostname;
- a graduate portrait returns `image/webp`;
- unknown files return 404;
- `www.eboonad.com` remains healthy with a non-stale schedule;
- `midash.travoleh.com/health` remains healthy.

Do not modify the `nadsite` service or either Midash service for this static
site.
