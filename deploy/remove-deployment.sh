#!/bin/bash

set -e

if [[ -z $DEPLOYMENT_RECORD_ID ]]; then
    echo "Error: please pass the deployment record ID" >&2
    exit 1
fi

source .registry.env
echo "Using DEPLOYER_LRN: $DEPLOYER_LRN"

echo "Deployment record ID: $DEPLOYMENT_RECORD_ID"

# Generate application-deployment-removal-request.yml
REMOVAL_REQUEST_RECORD_FILE=./records/application-deployment-removal-request.yml

cat > $REMOVAL_REQUEST_RECORD_FILE <<EOF
record:
  deployer: $DEPLOYER_LRN
  deployment: $DEPLOYMENT_RECORD_ID
  type: ApplicationDeploymentRemovalRequest
  version: 1.0.0
EOF

CONFIG_FILE=config.yml

sleep 2
REMOVAL_REQUEST_ID=$(laconic -c $CONFIG_FILE registry record publish --filename $REMOVAL_REQUEST_RECORD_FILE | jq -r '.id')
echo "ApplicationDeploymentRemovalRequest published"
echo $REMOVAL_REQUEST_ID

# Deployment checks
RETRY_INTERVAL=30
MAX_RETRIES=20

# Check that an ApplicationDeploymentRemovalRecord is published
retry_count=0
while true; do
  removal_records_response=$(laconic -c $CONFIG_FILE registry record list --type ApplicationDeploymentRemovalRecord --all request $REMOVAL_REQUEST_ID)
  len_removal_records=$(echo $removal_records_response | jq 'length')

  # Check if number of records returned is 0
  if [ $len_removal_records -eq 0 ]; then
    # Check if retries are exhausted
    if [ $retry_count -eq $MAX_RETRIES ]; then
      echo "Retries exhausted"
      echo "ApplicationDeploymentRemovalRecord for deployment removal request $REMOVAL_REQUEST_ID not found"
      exit 1
    else
      echo "ApplicationDeploymentRemovalRecord not found, retrying in $RETRY_INTERVAL sec..."
      sleep $RETRY_INTERVAL
      retry_count=$((retry_count+1))
    fi
  else
    echo "ApplicationDeploymentRemovalRecord found"
    REMOVAL_RECORD_ID=$(echo $removal_records_response | jq -r '.[0].id')
    echo $REMOVAL_RECORD_ID
    break
  fi
done

echo "Deployment removal successful"
