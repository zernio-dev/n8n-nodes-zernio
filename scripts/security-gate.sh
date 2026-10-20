#!/usr/bin/env bash
# Pre-push security gate: scan repository for hardcoded secrets before any push.
# Usage: scripts/security-gate.sh   (also runs automatically via .git/hooks/pre-push)
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1
FAILED=0

if command -v gitleaks >/dev/null 2>&1; then
  echo "[security-gate] gitleaks detect ..."
  gitleaks detect --source . --no-banner --redact || FAILED=1
else
  echo "[security-gate] gitleaks not found in PATH" >&2
  FAILED=1
fi

if command -v trufflehog >/dev/null 2>&1; then
  echo "[security-gate] trufflehog filesystem ..."
  # Inline whitelist drops known documentation placeholders (URI examples in README/AGENTS)
  trufflehog filesystem . --no-verification --json 2>/dev/null |
    node -e '
      const lines = require("fs").readFileSync(0, "utf8").trim().split("\n");
      let bad = 0;
      for (const l of lines) {
        let d; try { d = JSON.parse(l); } catch { continue; }
        const raw = d.Raw || "";
        // Documentation examples (RFC-style placeholder creds) are not secrets.
        if (/abc:xyz|123:xyz|abc:123|username:password@myproxy|user:pass@localhost/.test(raw)) continue;
        bad++;
        console.error(`[security-gate] ${d.DetectorName}: ${(raw || "").slice(0, 60)}`);
      }
      process.exit(bad ? 1 : 0);
    ' || FAILED=1
else
  echo "[security-gate] trufflehog not found in PATH" >&2
  FAILED=1
fi

if [ "$FAILED" -ne 0 ]; then
  echo "[security-gate] FAILED - do not push until findings are resolved." >&2
  exit 1
fi
echo "[security-gate] OK - no secrets detected."
