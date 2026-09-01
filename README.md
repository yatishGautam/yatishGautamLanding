# yatishgautam.com

Personal site. Hand-rolled HTML/CSS/vanilla JS — no framework, no build step.

## Structure

- `site/` — the static site (this is what gets deployed)
- `.github/workflows/deploy.yml` — CI/CD: push to `main` → sync to S3 → CloudFront invalidation
- `infra/` — notes on the AWS setup

## Local dev

```
python3 -m http.server 8123 --directory site
```

## Deploy

Push to `main`. GitHub Actions assumes an AWS IAM role via OIDC (no stored keys),
syncs `site/` to the private S3 bucket behind CloudFront, and invalidates the cache.
