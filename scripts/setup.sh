#!/usr/bin/env bash
set -euo pipefail
cd /workspace/vox-ai-documentary.
command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
test -x /usr/bin/chromium
npm --cache /tmp/documentary-npm ci --no-audit --no-fund
if [ ! -x .venv/bin/python ]; then python3 -m venv .venv; fi
.venv/bin/pip install --no-cache-dir -r requirements.lock.txt
.venv/bin/python scripts/download_models.py
.venv/bin/python scripts/assets.py
.venv/bin/python scripts/audio.py
.venv/bin/python scripts/docs.py
npx --cache /tmp/documentary-npm tsc --noEmit
