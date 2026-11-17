#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
( cd backend && gunicorn --bind 127.0.0.1:5000 app:app ) &
API_URL=http://127.0.0.1:5000 npm --prefix frontend install
API_URL=http://127.0.0.1:5000 npm --prefix frontend start
