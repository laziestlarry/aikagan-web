#!/usr/bin/env bash
# Identify AutonomaX-related repos from manifest
MANIFEST="reports/upstream_repo_manifest.json"
OUTPUT="reports/merge_candidates.json"
KNOWN=("AutonomaX_Commander_Engine" "autonomax_saas" "autonomax-agency-ops" "aikagan-web" "AutonomaX_Final_Pack" "AutonomaX_Registry_Installer")
# Build a jq filter that selects repos whose name is in the known list
FILTER=$(printf '"%s",' "${KNOWN[@]}")
FILTER=${FILTER%,}
# Use jq IN function for matching
jq -c "[ .[] | select(.name | IN($FILTER)) ]" "$MANIFEST" > "$OUTPUT"
echo "Generated $(jq length "$OUTPUT") merge candidates at $OUTPUT"
