#!/bin/bash

# Fail on error
set -e

source .registry.env
echo "Using REGISTRY_BOND_ID: $REGISTRY_BOND_ID"
echo "Using DEPLOYER_LRN: $DEPLOYER_LRN"
echo "Using AUTHORITY: $AUTHORITY"

# Repository URL
REPO_URL="https://git.vdb.to/cerc-io/mtm-vpn-dashboard"

# Get the latest commit hash for a branch
BRANCH_NAME="main"
LATEST_HASH=$(git ls-remote $REPO_URL refs/heads/$BRANCH_NAME | awk '{print $1}')

# Gitea
PACKAGE_VERSION=$(curl -s $REPO_URL/raw/branch/$BRANCH_NAME/package.json | jq -r .version)

# GitHub
# PACKAGE_VERSION=$(curl -s $REPO_URL/raw/refs/heads/$BRANCH_NAME/package.json | jq -r .version)

APP_NAME=mtm-vpn-dashboard

echo "Repo: ${REPO_URL}"
echo "Latest hash: ${LATEST_HASH}"
echo "App version: ${PACKAGE_VERSION}"
echo "Deployment DNS: ${DEPLOYMENT_DNS}"

# Current date and time for note
CURRENT_DATE_TIME=$(date -u)

CONFIG_FILE=config.yml

# Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts

# Get latest version from registry and increment application-record version
NEW_APPLICATION_VERSION=$(laconic -c $CONFIG_FILE registry record list --type ApplicationRecord --all --name "$APP_NAME" 2>/dev/null | jq -r -s ".[] | sort_by(.createTime) | reverse | [ .[] | select(.bondId == \"$REGISTRY_BOND_ID\") ] | .[0].attributes.version" | awk -F. -v OFS=. '{$NF += 1 ; print}')

if [ -z "$NEW_APPLICATION_VERSION" ] || [ "1" == "$NEW_APPLICATION_VERSION" ]; then
  # Set application-record version if no previous records were found
  NEW_APPLICATION_VERSION=0.0.1
fi

# Generate application-record.yml with incremented version
mkdir -p records
RECORD_FILE=./records/application-record.yml

cat >$RECORD_FILE <<EOF
record:
  type: ApplicationRecord
  version: $NEW_APPLICATION_VERSION
  repository_ref: $LATEST_HASH
  repository: ["$REPO_URL"]
  app_type: webapp
  name: $APP_NAME
  app_version: $PACKAGE_VERSION
EOF

echo "Application record generated successfully: $RECORD_FILE"

# Publish ApplicationRecord
publish_response=$(laconic -c $CONFIG_FILE registry record publish --filename $RECORD_FILE)
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to publish record"
  exit $rc
fi
RECORD_ID=$(echo $publish_response | jq -r '.id')
echo "ApplicationRecord published, setting names next"
echo $RECORD_ID

# Set name to record
REGISTRY_APP_LRN="lrn://$AUTHORITY/applications/$APP_NAME"

name1="$REGISTRY_APP_LRN@${PACKAGE_VERSION}"
sleep 2
laconic -c $CONFIG_FILE registry name set "$name1" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set name: $REGISTRY_APP_LRN@${PACKAGE_VERSION}"
  exit $rc
fi
echo "$name1 set for ApplicationRecord"

name2="$REGISTRY_APP_LRN@${LATEST_HASH}"
sleep 2
laconic -c $CONFIG_FILE registry name set "$name2" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set hash"
  exit $rc
fi
echo "$name2 set for ApplicationRecord"

name3="$REGISTRY_APP_LRN"
sleep 2
# Set name if latest release
laconic -c $CONFIG_FILE registry name set "$name3" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set release"
  exit $rc
fi
echo "$name3 set for ApplicationRecord"

# Check if record found for REGISTRY_APP_LRN
query_response=$(laconic -c $CONFIG_FILE registry name resolve "$REGISTRY_APP_LRN")
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to query name"
  exit $rc
fi
APP_RECORD=$(echo $query_response | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $REGISTRY_APP_LRN."
  exit 1
fi
echo "Name resolution successful"

sleep 2
echo "Requesting a webapp deployment for $name2, using deployer $DEPLOYER_LRN"
laconic-so request-webapp-deployment \
  --laconic-config $CONFIG_FILE \
  --deployer $DEPLOYER_LRN \
  --app $name2 \
  --env-file ./.app.env \
  --dns $DEPLOYMENT_DNS \
  --make-payment auto

echo "Done"
