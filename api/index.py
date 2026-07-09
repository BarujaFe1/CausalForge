"""Vercel Python entrypoint for the CausalForge FastAPI app."""

from __future__ import annotations

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API_ROOT = os.path.join(ROOT, "apps", "api")
if API_ROOT not in sys.path:
    sys.path.insert(0, API_ROOT)

from app.main import app  # noqa: E402,F401
