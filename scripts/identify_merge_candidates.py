#!/usr/bin/env python3
"""identify_merge_candidates.py
Read the upstream manifest and flag repositories that are part of the AutonomaX ecosystem.
Outputs a JSON file `reports/merge_candidates.json` with an array of candidates.
"""
import json, sys, os

MANIFEST_PATH = "reports/upstream_repo_manifest.json"
OUTPUT_PATH = "reports/merge_candidates.json"

# Known AutonomaX component repo names (case‑sensitive)
KNOWN_REPOS = {
    "AutonomaX_Commander_Engine",
    "autonomax_saas",
    "autonomax-agency-ops",
    "aikagan-web",
    "AutonomaX_Final_Pack",
    "AutonomaX_Registry_Installer",
}

if not os.path.isfile(MANIFEST_PATH):
    print(f"Manifest not found at {MANIFEST_PATH}", file=sys.stderr)
    sys.exit(1)

with open(MANIFEST_PATH) as f:
    data = json.load(f)

candidates = []
for repo in data:
    name = repo.get("name")
    if name in KNOWN_REPOS:
        repo["consider_merge"] = True
        candidates.append(repo)
    else:
        repo["consider_merge"] = False

# Write full manifest (with flags) for reference
with open(OUTPUT_PATH, "w") as out:
    json.dump(candidates, out, indent=2)

print(f"Generated {len(candidates)} merge candidates at {OUTPUT_PATH}")
