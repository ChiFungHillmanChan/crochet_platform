#!/usr/bin/env bash
#
# setup-rate-limiting.sh
# Sets up API Gateway throttling and AWS WAF for Cosy Loops
#
# Prerequisites:
#   - AWS CLI configured with appropriate credentials
#   - Appropriate IAM permissions for API Gateway and WAF
#
# Usage: ./scripts/setup-rate-limiting.sh
#
# NOTE: This script is for reference. Review and adjust values before running.

set -euo pipefail

API_ID="2tqn1i1a3e"
STAGE_NAME="admin"
REGION="eu-west-2"

echo "=== Step 1: Configure API Gateway Stage Throttling ==="
echo "Setting rate limit: 100 req/s, burst limit: 200 requests"

aws apigatewayv2 update-stage \
  --api-id "$API_ID" \
  --stage-name "$STAGE_NAME" \
  --default-route-settings "ThrottlingBurstLimit=200,ThrottlingRateLimit=100" \
  --region "$REGION"

echo "API Gateway throttling configured."

echo ""
echo "=== Step 2: Create AWS WAF Web ACL ==="
echo "Creating WAF with rate-based rule: 2000 requests per 5 minutes per IP"

WAF_OUTPUT=$(aws wafv2 create-web-acl \
  --name cosy-loops-waf \
  --scope REGIONAL \
  --region "$REGION" \
  --default-action Allow={} \
  --rules '[
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": { "Block": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    },
    {
      "Name": "AWSManagedRulesCommonRuleSet",
      "Priority": 2,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "OverrideAction": { "None": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesCommonRuleSet"
      }
    }
  ]' \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=cosyLoopsWAF)

WAF_ARN=$(echo "$WAF_OUTPUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['Summary']['ARN'])")
echo "WAF Web ACL created: $WAF_ARN"

echo ""
echo "=== Step 3: Associate WAF with API Gateway ==="
echo "Attaching WAF to API Gateway stage"

# For HTTP API, the resource ARN format is different from REST API
RESOURCE_ARN="arn:aws:apigateway:${REGION}::/apis/${API_ID}/stages/${STAGE_NAME}"

aws wafv2 associate-web-acl \
  --web-acl-arn "$WAF_ARN" \
  --resource-arn "$RESOURCE_ARN" \
  --region "$REGION"

echo "WAF associated with API Gateway."

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Summary:"
echo "  - API Gateway throttling: 100 req/s rate, 200 burst"
echo "  - WAF rate limit: 2000 requests per 5 minutes per IP"
echo "  - WAF managed rules: AWS Common Rule Set enabled"
echo ""
echo "To verify:"
echo "  aws wafv2 get-web-acl --name cosy-loops-waf --scope REGIONAL --id <WAF_ID> --region $REGION"
echo "  aws apigatewayv2 get-stage --api-id $API_ID --stage-name $STAGE_NAME --region $REGION"
