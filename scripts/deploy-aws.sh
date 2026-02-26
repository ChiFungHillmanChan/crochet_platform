#!/usr/bin/env bash
set -euo pipefail

# Cosy Loops — AWS Lambda Deployment Script
# Usage: ./scripts/deploy-aws.sh
# Prerequisites: aws-cli configured, environment variables set

REGION="${AWS_REGION:-eu-west-2}"
LAMBDA_ROLE_NAME="cosy-loops-lambda-role"
WEBHOOK_FUNCTION="cosy-loops-webhook"
ADMIN_FUNCTION="cosy-loops-admin"

echo "=== Cosy Loops AWS Deployment ==="
echo "Region: $REGION"

# Validate required env vars
for var in FIREBASE_SERVICE_ACCOUNT STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
done

# Create IAM role if it doesn't exist
echo "--- Setting up IAM role ---"
ROLE_ARN=$(aws iam get-role --role-name "$LAMBDA_ROLE_NAME" --query 'Role.Arn' --output text 2>/dev/null || true)
if [ -z "$ROLE_ARN" ] || [ "$ROLE_ARN" = "None" ]; then
  TRUST_POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
  ROLE_ARN=$(aws iam create-role \
    --role-name "$LAMBDA_ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --query 'Role.Arn' --output text)
  aws iam attach-role-policy --role-name "$LAMBDA_ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  aws iam attach-role-policy --role-name "$LAMBDA_ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
  echo "Waiting for role propagation..."
  sleep 10
fi
echo "Role ARN: $ROLE_ARN"

# Package and deploy webhook Lambda
echo "--- Deploying Webhook Lambda ---"
WEBHOOK_DIR=$(mktemp -d)
mkdir -p "$WEBHOOK_DIR/webhook" "$WEBHOOK_DIR/shared"
cp lambda/webhook/index.mjs "$WEBHOOK_DIR/webhook/"
cp lambda/webhook/emails.mjs "$WEBHOOK_DIR/webhook/"
cp lambda/shared/firebase-admin.mjs "$WEBHOOK_DIR/shared/"
cp lambda/shared/response.mjs "$WEBHOOK_DIR/shared/"
(cd "$WEBHOOK_DIR" && npm init -y --quiet && npm install firebase-admin @aws-sdk/client-ses stripe --quiet)
(cd "$WEBHOOK_DIR" && zip -r webhook.zip . -q)

aws lambda get-function --function-name "$WEBHOOK_FUNCTION" --region "$REGION" > /dev/null 2>&1 && \
  aws lambda update-function-code \
    --function-name "$WEBHOOK_FUNCTION" \
    --zip-file "fileb://$WEBHOOK_DIR/webhook.zip" \
    --region "$REGION" > /dev/null || \
  aws lambda create-function \
    --function-name "$WEBHOOK_FUNCTION" \
    --runtime nodejs20.x \
    --handler index.handler \
    --role "$ROLE_ARN" \
    --zip-file "fileb://$WEBHOOK_DIR/webhook.zip" \
    --timeout 30 \
    --memory-size 256 \
    --region "$REGION" \
    --environment "Variables={FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT,STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET,SENDER_EMAIL=${SENDER_EMAIL:-noreply@cosyloops.com},ADMIN_EMAIL=${ADMIN_EMAIL:-}}" > /dev/null

rm -rf "$WEBHOOK_DIR"
echo "Webhook Lambda deployed."

# Package and deploy admin Lambda
echo "--- Deploying Admin Lambda ---"
ADMIN_DIR=$(mktemp -d)
mkdir -p "$ADMIN_DIR/admin" "$ADMIN_DIR/shared"
cp lambda/admin/index.mjs "$ADMIN_DIR/admin/"
cp lambda/admin/checkout.mjs "$ADMIN_DIR/admin/"
cp lambda/admin/reviews.mjs "$ADMIN_DIR/admin/"
cp lambda/shared/firebase-admin.mjs "$ADMIN_DIR/shared/"
cp lambda/shared/response.mjs "$ADMIN_DIR/shared/"
(cd "$ADMIN_DIR" && npm init -y --quiet && npm install firebase-admin stripe @aws-sdk/s3-request-presigner @aws-sdk/client-s3 --quiet)
(cd "$ADMIN_DIR" && zip -r admin.zip . -q)

aws lambda get-function --function-name "$ADMIN_FUNCTION" --region "$REGION" > /dev/null 2>&1 && \
  aws lambda update-function-code \
    --function-name "$ADMIN_FUNCTION" \
    --zip-file "fileb://$ADMIN_DIR/admin.zip" \
    --region "$REGION" > /dev/null || \
  aws lambda create-function \
    --function-name "$ADMIN_FUNCTION" \
    --runtime nodejs20.x \
    --handler index.handler \
    --role "$ROLE_ARN" \
    --zip-file "fileb://$ADMIN_DIR/admin.zip" \
    --timeout 30 \
    --memory-size 256 \
    --region "$REGION" \
    --environment "Variables={FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,ADMIN_EMAILS=${ADMIN_EMAILS:-},FRONTEND_URL=${FRONTEND_URL:-https://cosyloops.com},ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-https://cosyloops.com}}" > /dev/null

rm -rf "$ADMIN_DIR"
echo "Admin Lambda deployed."

echo ""
echo "=== Deployment Complete ==="
echo "Next steps:"
echo "1. Set up API Gateway with routes: POST /webhook -> $WEBHOOK_FUNCTION, POST /admin -> $ADMIN_FUNCTION"
echo "2. Configure Stripe webhook URL to point to the API Gateway /webhook endpoint"
echo "3. Verify SES sender email: $SENDER_EMAIL"
