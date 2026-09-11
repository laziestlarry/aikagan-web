#!/usr/bin/env python3
"""Load commerce secrets from the operator environment into Vercel.

Never place provider credentials in this file. Export them in the current
shell from an approved secret store, then run this script. Values are passed
to the Vercel CLI through stdin so they are not printed or embedded in the
repository.
"""

from __future__ import annotations

import os
import subprocess
import sys


REQUIRED_VARIABLES = (
    "GUMROAD_ACCESS_TOKEN",
    "GUMROAD_WEBHOOK_TOKEN",
    "CUSTOMER_SESSION_SECRET",
    "DOWNLOAD_TOKEN_SECRET",
)

OPTIONAL_VARIABLES = (
    "SHOPIER_PAT",
    "LEMONSQUEEZY_API_KEY",
    "LEMONSQUEEZY_STORE_ID",
    "LEMONSQUEEZY_WEBHOOK_SECRET",
)


def configured(names: tuple[str, ...]) -> dict[str, str]:
    return {name: value for name in names if (value := os.environ.get(name, "").strip())}


missing = [name for name in REQUIRED_VARIABLES if not os.environ.get(name, "").strip()]
if missing:
    sys.exit("Missing required environment variables: " + ", ".join(missing))

variables = {**configured(REQUIRED_VARIABLES), **configured(OPTIONAL_VARIABLES)}

print("Setting Vercel production environment variables from the current shell...")
for key, value in variables.items():
    command = ["npx", "vercel", "env", "add", key, "production", "--yes", "--force"]
    result = subprocess.run(command, input=value + "\n", capture_output=True, text=True, check=False)
    if result.returncode != 0:
        print(f"Failed to add {key}: {result.stderr.strip() or result.stdout.strip()}")
        sys.exit(1)
    print(f"Added {key}")

print(f"Configured {len(variables)} environment variables without writing their values to source.")
