#!/bin/bash
set -euo pipefail

# Installs Headroom (https://github.com/headroomlabs-ai/headroom), a local
# context-compression tool, so its CLI is available in every Claude Code
# session on this repo.

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

python3 -m pip install --quiet --user "headroom-ai[all]"

USER_BASE="$(python3 -m site --user-base)"
echo "export PATH=\"$USER_BASE/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"

export PATH="$USER_BASE/bin:$PATH"
headroom doctor || true
