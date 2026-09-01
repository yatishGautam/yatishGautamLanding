# Infrastructure (AWS account 886436936089, us-east-1)

Created 2026-09-01 via AWS CLI (profile `personal`).

| Resource | Value |
|---|---|
| S3 bucket (private, OAC-only) | `yatishgautam.com` |
| CloudFront distribution | `E1QKUAQ05JBNVV` → `dqv49utz84x7u.cloudfront.net` |
| Origin Access Control | `ETM2JG0I328RL` |
| ACM certificate (us-east-1) | `arn:aws:acm:us-east-1:886436936089:certificate/e8bb3b57-c2d1-4ee3-9561-2536a18a1a71` (yatishgautam.com + www) |
| Deploy IAM role (GitHub OIDC) | `github-deploy-yatishgautam-com` (scoped to `repo:yatishGautam/yatishGautamLanding:ref:refs/heads/main`, immutable-sub format included) |

## DNS — stays on GoDaddy (decided 2026-09-01)

The domain has other records (e.g. `adhd.yatishgautam.com`), so nameservers were
NOT moved to Route 53. A hosted zone was briefly created and then deleted.
Records to keep at GoDaddy:

| Type | Name (host) | Value |
|---|---|---|
| CNAME | `www` | `dqv49utz84x7u.cloudfront.net` |
| CNAME | `_3f30f59947a1c37e47a1758bfaed5ecb` | `_31347aaa9df6f739e268ea995864f49e.xlfgrmvvlj.acm-validations.aws` |
| CNAME | `_32af9eb4e7b1f4ee10d606657d89af07.www` | `_9b87677c720f329e12192fa99325cfb7.jkddzztszm.acm-validations.aws` |

Plus GoDaddy **Domain Forwarding**: `yatishgautam.com` → `https://www.yatishgautam.com`
(301 permanent, forward-only). The canonical URL is `https://www.yatishgautam.com`.

The two `_...` CNAMEs are ACM's DNS validation — they must stay (ACM re-checks
them for automatic certificate renewal).

## Post-validation step

Once the ACM cert is ISSUED (after the GoDaddy CNAMEs propagate),
`infra/attach-domain.sh` attaches both hostnames + the cert to the CloudFront
distribution (TLSv1.2_2021, sni-only). It polls every 60s for up to 12h; re-run
it if it timed out before the DNS records were added.
