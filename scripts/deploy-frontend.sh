#!/usr/bin/env bash
set -euo pipefail

# Cosy Loops — Frontend Deployment to S3 + CloudFront
# Same pattern as hillman_portfolio
# Usage: ./scripts/deploy-frontend.sh

S3_BUCKET="${S3_BUCKET:-cosy-loops-frontend}"
CF_DISTRIBUTION="${CF_DISTRIBUTION_ID:-}"
REGION="${AWS_REGION:-eu-west-2}"

echo "=== Cosy Loops Frontend Deployment ==="

# Generate SEO files
echo "--- Generating SEO files ---"
pnpm generate:seo

# Build
echo "--- Building ---"
pnpm build

# Sync static assets with long cache (CSS/JS/media)
echo "--- Deploying static assets to S3 ---"
aws s3 sync out/_next/ "s3://$S3_BUCKET/_next/" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --region "$REGION"

# Sync generated images/assets
aws s3 sync out/generated/ "s3://$S3_BUCKET/generated/" \
  --cache-control "public, max-age=31536000, immutable" \
  --region "$REGION"

# Sync everything else (excludes what we already handled)
aws s3 sync out/ "s3://$S3_BUCKET/" \
  --delete \
  --exclude "_next/*" \
  --exclude "generated/*" \
  --cache-control "public, max-age=0, must-revalidate" \
  --region "$REGION"

# Fix MIME types for special files
echo "--- Fixing MIME types ---"
aws s3 cp "s3://$S3_BUCKET/sitemap.xml" "s3://$S3_BUCKET/sitemap.xml" \
  --content-type "application/xml" \
  --cache-control "public, max-age=3600" \
  --metadata-directive REPLACE \
  --region "$REGION"

aws s3 cp "s3://$S3_BUCKET/robots.txt" "s3://$S3_BUCKET/robots.txt" \
  --content-type "text/plain" \
  --cache-control "public, max-age=3600" \
  --metadata-directive REPLACE \
  --region "$REGION"

aws s3 cp "s3://$S3_BUCKET/manifest.json" "s3://$S3_BUCKET/manifest.json" \
  --content-type "application/manifest+json" \
  --cache-control "public, max-age=86400" \
  --metadata-directive REPLACE \
  --region "$REGION"

# Invalidate CloudFront
if [ -n "$CF_DISTRIBUTION" ]; then
  echo "--- Invalidating CloudFront ---"
  aws cloudfront create-invalidation \
    --distribution-id "$CF_DISTRIBUTION" \
    --paths "/*" > /dev/null
  echo "CloudFront invalidation created."
fi

echo "=== Frontend deployed ==="
