#!/usr/bin/env python3
"""Verify the CSP script-src hash allowlist matches the inline scripts on disk.

Every page carries inline <script> blocks that CSP allows by SHA-256 hash
rather than 'unsafe-inline': one shared no-flash theme resolver, plus one
JSON-LD block per indexable page. Editing any of that content -- even a single
word inside JSON-LD -- changes its hash, and the browser then silently refuses
to run it. On the theme script that means a flash of the wrong colour scheme;
on JSON-LD it means the structured data disappears from Google's view.

Nothing warns you: the deploy succeeds and the page looks fine to whoever
edited it. Run this before every deploy.

    python3 tools/verify-csp.py

Reports both directions -- a script with no matching hash (would be blocked)
and a hash with no matching script (dead entry left behind by an old edit).
"""
import base64
import hashlib
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
public = root / "public"
headers = public / "_headers"

errors = []

if not headers.is_file():
    print("FAIL: public/_headers not found")
    raise SystemExit(1)

csp_lines = [l for l in headers.read_text(encoding="utf-8").splitlines()
             if l.strip().startswith("Content-Security-Policy:")]
if len(csp_lines) != 1:
    print(f"FAIL: expected exactly 1 Content-Security-Policy line, found {len(csp_lines)}")
    raise SystemExit(1)

csp = csp_lines[0]
allowed = set(re.findall(r"'(sha256-[^']+)'", csp))

if "'unsafe-inline'" in csp.split("script-src", 1)[-1].split(";", 1)[0]:
    errors.append("script-src has regained 'unsafe-inline' -- the hash allowlist is being bypassed")

# Inline blocks only: a <script src=...> loads an external file and is covered
# by 'self', not by a hash.
inline = re.compile(r"<script(?![^>]*\ssrc=)[^>]*>(.*?)</script>", re.S)

found = {}
pages = sorted(public.glob("*.html"))
blocks = 0
for page in pages:
    for match in inline.finditer(page.read_text(encoding="utf-8")):
        blocks += 1
        digest = hashlib.sha256(match.group(1).encode("utf-8")).digest()
        h = "sha256-" + base64.b64encode(digest).decode("ascii")
        found.setdefault(h, []).append(page.name)

for h, where in sorted(found.items()):
    if h not in allowed:
        errors.append(f"inline script would be BLOCKED -- no '{h}' in script-src (in: {', '.join(where)})")

for h in sorted(allowed - set(found)):
    errors.append(f"dead allowlist entry -- '{h}' matches no inline script on any page")

print(f"checked {len(pages)} pages, {blocks} inline script blocks, "
      f"{len(found)} unique hashes, {len(allowed)} allowlisted")

if errors:
    for e in errors:
        print("FAIL:", e)
    print(f"{len(errors)} failure(s)")
    print("\nTo repair: recompute the hash of the changed block and swap it into the\n"
          "script-src allowlist in public/_headers. This script prints the correct value above.")
    sys.exit(1)

print("0 failures - every inline script is allowlisted, no dead entries")
