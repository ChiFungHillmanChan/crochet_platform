# Deploy Commands

Deploy the Cosy Loops crochet platform to production.

## Production URLs

| Service | URL |
|---------|-----|
| **Website (Frontend)** | https://d25l7it29vlqk3.cloudfront.net |
| **API Gateway (Backend)** | https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com |
| **R2 Image CDN** | https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev |
| **Firebase Console** | https://console.firebase.google.com/project/resume-system-470420 |
| **GitHub Repo** | https://github.com/ChiFungHillmanChan/crochet_platform |

## AWS Resource IDs

| Resource | ID |
|----------|----|
| S3 Bucket | `cosy-loops-frontend` |
| CloudFront Distribution | `E19ZV6UUCIDAZY` |
| CloudFront Function | `cosy-loops-url-rewrite` |
| Admin Lambda | `cosy-loops-admin` |
| Webhook Lambda | `cosy-loops-webhook` |
| API Gateway | `2tqn1i1a3e` |
| IAM Role | `cosy-loops-lambda-role` |
| Region | `eu-west-2` (London) |

## Cloudflare Resource IDs

| Resource | ID |
|----------|----|
| Account | `7d2747f6cc21c13e70c7650314efbccc` |
| R2 Bucket | `cosy-loops-images` |
| R2 Public URL | `https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev` |

## Firebase / Google Cloud

| Resource | ID |
|----------|----|
| Firebase Project | `resume-system-470420` |
| Web App ID | `1:226341126994:web:fc008f0d1338985bccb08b` |

## Stripe

| Resource | ID |
|----------|----|
| Webhook Endpoint | `we_1T4pokRs2fXWDNeZfOwAVYFc` |
| Webhook URL | `https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com/webhook` |
| Mode | Test (switch to live for production) |

---

## Deploy Frontend

Automatic via CI/CD on push to `main`. For manual deploy:

```bash
# Build with production env vars (loaded from .env.local)
pnpm build

# Sync static assets (long cache)
aws s3 sync out/_next/ "s3://cosy-loops-frontend/_next/" \
  --delete --cache-control "public, max-age=31536000, immutable" --region eu-west-2

# Sync HTML + other files (no cache)
aws s3 sync out/ "s3://cosy-loops-frontend/" \
  --delete --exclude "_next/*" \
  --cache-control "public, max-age=0, must-revalidate" --region eu-west-2

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id E19ZV6UUCIDAZY --paths "/*"
```

Or use the script: `./scripts/deploy-frontend.sh`

## Deploy Lambda Functions

```bash
# Deploy both Lambdas (requires env vars: FIREBASE_SERVICE_ACCOUNT, STRIPE_SECRET_KEY, etc.)
./scripts/deploy-aws.sh
```

### Manual Admin Lambda deploy:

```bash
ADMIN_DIR=$(mktemp -d)
mkdir -p "$ADMIN_DIR/admin" "$ADMIN_DIR/shared"
cp lambda/admin/index.mjs "$ADMIN_DIR/admin/"
cp lambda/shared/firebase-admin.mjs "$ADMIN_DIR/shared/"
cp lambda/shared/response.mjs "$ADMIN_DIR/shared/"
cd "$ADMIN_DIR"
npm init -y --quiet
npm install firebase-admin stripe @aws-sdk/client-s3 @aws-sdk/s3-request-presigner --quiet
zip -r admin.zip . -q
aws lambda update-function-code --function-name cosy-loops-admin \
  --zip-file "fileb://$ADMIN_DIR/admin.zip" --region eu-west-2
```

Handler: `admin/index.handler`

### Manual Webhook Lambda deploy:

```bash
WEBHOOK_DIR=$(mktemp -d)
mkdir -p "$WEBHOOK_DIR/webhook" "$WEBHOOK_DIR/shared"
cp lambda/webhook/index.mjs "$WEBHOOK_DIR/webhook/"
cp lambda/webhook/emails.mjs "$WEBHOOK_DIR/webhook/"
cp lambda/shared/firebase-admin.mjs "$WEBHOOK_DIR/shared/"
cp lambda/shared/response.mjs "$WEBHOOK_DIR/shared/"
cd "$WEBHOOK_DIR"
npm init -y --quiet
npm install firebase-admin stripe @aws-sdk/client-ses --quiet
zip -r webhook.zip . -q
aws lambda update-function-code --function-name cosy-loops-webhook \
  --zip-file "fileb://$WEBHOOK_DIR/webhook.zip" --region eu-west-2
```

Handler: `webhook/index.handler`

## Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore --project resume-system-470420
```

## Seed Firestore

```bash
FIREBASE_SERVICE_ACCOUNT=<base64-encoded-key> npx tsx scripts/seed-firestore.ts
```

---

## Estimated Monthly Cost (Low Traffic)

| Service | Free Tier | Est. Cost (beyond free tier) |
|---------|-----------|------------------------------|
| **S3** | 5 GB storage, 20k GET | ~$0.50/mo (static assets ~70 MB) |
| **CloudFront** | 1 TB transfer, 10M requests | ~$0 (within free tier for low traffic) |
| **Lambda** (x2) | 1M requests, 400k GB-seconds | ~$0 (within free tier) |
| **API Gateway** | 1M HTTP API calls | ~$0 (within free tier) |
| **Firestore** | 50k reads/day, 20k writes/day | ~$0 (within free tier for ~100 orders/day) |
| **Firebase Auth** | 50k MAU (phone auth extra) | ~$0 (free for email + Google) |
| **Stripe** | No monthly fee | 1.4% + 20p per UK card transaction |
| **Cloudflare R2** | 10 GB storage, 10M reads | ~$0 (within free tier) |
| **GitHub Actions** | 2,000 min/mo (free repos) | ~$0 |
| **Total (low traffic)** | | **~$0.50/mo** + Stripe per-transaction fees |

### Scaling Cost Estimates

| Monthly Orders | Est. Total Cost |
|----------------|-----------------|
| 0–100 | ~$0.50 (mostly free tier) |
| 100–500 | ~$2–5 |
| 500–2,000 | ~$5–15 |
| 2,000–10,000 | ~$15–50 |

The vast majority of cost comes from Stripe transaction fees (1.4% + 20p per UK card, 2.9% + 20p for international). Infrastructure stays cheap due to serverless + static hosting.

---

## Environment Variables Reference

### GitHub Secrets (CI/CD)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET=cosy-loops-frontend
CF_DISTRIBUTION_ID=E19ZV6UUCIDAZY
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChD5bzhu44iQhD-yx4_CLHFVYBD2pWOOY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=resume-system-470420.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=resume-system-470420
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=resume-system-470420.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=226341126994
NEXT_PUBLIC_FIREBASE_APP_ID=1:226341126994:web:fc008f0d1338985bccb08b
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51PLlnWRs2fXWDNeZ...
NEXT_PUBLIC_API_URL=https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com/admin
```

### Admin Lambda Environment

```
FIREBASE_SERVICE_ACCOUNT=<base64>
STRIPE_SECRET_KEY=sk_test_...
ADMIN_EMAILS=hillmanchan709@gmail.com
FRONTEND_URL=https://d25l7it29vlqk3.cloudfront.net
ALLOWED_ORIGINS=https://d25l7it29vlqk3.cloudfront.net
R2_ACCOUNT_ID=7d2747f6cc21c13e70c7650314efbccc
R2_BUCKET_NAME=cosy-loops-images
R2_PUBLIC_URL=https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev
R2_ACCESS_KEY_ID=<from Cloudflare R2 API token>
R2_SECRET_ACCESS_KEY=<from Cloudflare R2 API token>
```

### Webhook Lambda Environment

```
FIREBASE_SERVICE_ACCOUNT=<base64>
STRIPE_WEBHOOK_SECRET=whsec_qyqAd59IJw9g31IdzLwITiycgfEwJeD3
SENDER_EMAIL=noreply@cosyloops.com
ADMIN_EMAIL=hillmanchan709@gmail.com
```

---

## Manual Setup Required (Cannot Be Done via CLI)

1. **Firebase Auth Providers**: Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password + Google
2. **Firebase Authorized Domains**: Add `d25l7it29vlqk3.cloudfront.net` to Authorized domains
3. **Cloudflare R2 API Token**: Create at Cloudflare Dashboard → R2 → Manage R2 API Tokens → add keys to Admin Lambda env
4. **Stripe Live Mode**: Replace test keys with live keys when ready to accept real payments
