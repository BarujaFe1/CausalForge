#!/usr/bin/env bash
# Generate placeholder visual assets if Pillow is available.
set -euo pipefail
python "$(dirname "$0")/generate_assets.py"
