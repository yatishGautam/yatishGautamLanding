#!/usr/bin/env bash
# Waits for the ACM cert to be ISSUED (i.e. after GoDaddy nameservers point to
# Route 53), then attaches yatishgautam.com + www to the CloudFront distribution.
# Safe to re-run; exits early if aliases are already attached.
set -euo pipefail

export AWS_PROFILE="${AWS_PROFILE:-personal}"
export AWS_REGION=us-east-1

CERT_ARN="arn:aws:acm:us-east-1:886436936089:certificate/e8bb3b57-c2d1-4ee3-9561-2536a18a1a71"
DIST_ID="E1QKUAQ05JBNVV"
MAX_MINUTES="${MAX_MINUTES:-720}"

existing=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query "DistributionConfig.Aliases.Quantity" --output text)
if [ "$existing" != "0" ]; then
  echo "Aliases already attached. Nothing to do."
  exit 0
fi

echo "Waiting for cert to be ISSUED (checks every 60s, up to ${MAX_MINUTES}m)..."
for i in $(seq 1 "$MAX_MINUTES"); do
  status=$(aws acm describe-certificate --certificate-arn "$CERT_ARN" --query "Certificate.Status" --output text)
  if [ "$status" = "ISSUED" ]; then
    echo "Cert ISSUED after ${i} minute(s). Attaching domain to CloudFront..."
    tmp=$(mktemp -d)
    aws cloudfront get-distribution-config --id "$DIST_ID" > "$tmp/full.json"
    etag=$(python3 -c "import json;print(json.load(open('$tmp/full.json'))['ETag'])")
    python3 - "$tmp" "$CERT_ARN" <<'EOF'
import json, sys
tmp, cert = sys.argv[1], sys.argv[2]
cfg = json.load(open(f"{tmp}/full.json"))["DistributionConfig"]
cfg["Aliases"] = {"Quantity": 2, "Items": ["yatishgautam.com", "www.yatishgautam.com"]}
cfg["ViewerCertificate"] = {
    "ACMCertificateArn": cert,
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": cert,
    "CertificateSource": "acm",
}
json.dump(cfg, open(f"{tmp}/cfg.json", "w"))
EOF
    aws cloudfront update-distribution --id "$DIST_ID" --distribution-config "file://$tmp/cfg.json" --if-match "$etag" --query "Distribution.Status" --output text
    echo "Done. https://yatishgautam.com will serve once CloudFront finishes deploying (~5 min)."
    exit 0
  fi
  sleep 60
done
echo "Timed out after ${MAX_MINUTES}m — cert still not issued. Did the GoDaddy nameservers get updated?"
exit 1
