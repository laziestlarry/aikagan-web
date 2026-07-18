#!/usr/bin/env bash
# fetch_upstream_refs.sh – generate a manifest of LaziestLarry's public repos and branches
# Requires: curl, jq
# Output: reports/upstream_repo_manifest.json

set -euo pipefail

API_URL="https://api.github.com/users/laziestLarry/repos"
OUTPUT_FILE="reports/upstream_repo_manifest.json"
TMP_DIR=$(mktemp -d)

# Ensure reports directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Fetch all repos (paginated)
PAGE=1
while true; do
  RESPONSE=$(curl -s "${API_URL}?per_page=100&page=${PAGE}")
  COUNT=$(echo "$RESPONSE" | jq '. | length')
  if [ "$COUNT" -eq 0 ]; then
    break
  fi
  # Process each repo in the page
  echo "$RESPONSE" | jq -c '.[]' | while read -r REPO; do
    REPO_NAME=$(echo "$REPO" | jq -r '.name')
    REPO_URL=$(echo "$REPO" | jq -r '.clone_url')
    PUSHED_AT=$(echo "$REPO" | jq -r '.pushed_at')
    # Fetch branches for this repo
    BRANCHES=$(curl -s "https://api.github.com/repos/laziestLarry/${REPO_NAME}/branches?per_page=100" |
      jq '[.[] | {name: .name, sha: .commit.sha}]')
    # Build repo object with branches and write to temp file
    echo "$REPO" | jq --arg url "$REPO_URL" \
      --arg pushed "$PUSHED_AT" \
      --argjson branches "$BRANCHES" \
      '. + {clone_url: $url, pushed_at: $pushed, branches: $branches}' > "$TMP_DIR/${REPO_NAME}.json"
  done
  PAGE=$((PAGE + 1))
done

# Combine all repo JSON files into one array
jq -s '.' "$TMP_DIR"/*.json > "$OUTPUT_FILE"

rm -rf "$TMP_DIR"

echo "Generated manifest at $OUTPUT_FILE"
