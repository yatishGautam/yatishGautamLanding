# Infrastructure (AWS account 886436936089, us-east-1)

Created 2026-09-01 via AWS CLI (profile `personal`).

| Resource | Value |
|---|---|
| S3 bucket (private, OAC-only) | `yatishgautam.com` |
| CloudFront distribution | `E1QKUAQ05JBNVV` → `dqv49utz84x7u.cloudfront.net` |
| Origin Access Control | `ETM2JG0I328RL` |
| ACM certificate (us-east-1) | `arn:aws:acm:us-east-1:886436936089:certificate/e8bb3b57-c2d1-4ee3-9561-2536a18a1a71` (yatishgautam.com + www) |
| Route 53 hosted zone | `Z02297922F3LFXD2SJS7O` |
| Deploy IAM role (GitHub OIDC) | `github-deploy-yatishgautam-com` (scoped to `repo:yatishGautam/yatishGautamLanding:ref:refs/heads/main`) |

## DNS (GoDaddy → Route 53)

Nameservers set at GoDaddy for yatishgautam.com:

```
ns-50.awsdns-06.com
ns-588.awsdns-09.net
ns-1745.awsdns-26.co.uk
ns-1154.awsdns-16.org
```

Route 53 holds: ACM validation CNAMEs, and A/AAAA aliases (apex + www) → CloudFront.

## Post-validation step

Once the ACM cert is ISSUED (after nameservers propagate), the CloudFront
distribution gets `Aliases: [yatishgautam.com, www.yatishgautam.com]` and the
ACM cert attached (TLSv1.2_2021, sni-only). See `infra/attach-domain.sh`.
