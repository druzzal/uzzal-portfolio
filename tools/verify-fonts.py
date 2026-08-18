#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]; public=root/"public"; fonts=public/"assets/fonts"
required=["fraunces-variable.woff2","fraunces-variable-italic.woff2","inter-variable.woff2","jetbrains-mono-variable.woff2"]
errors=[]
for n in required:
 p=fonts/n
 if not p.is_file() or p.stat().st_size==0: errors.append(f"missing font: {p}")
for p in public.rglob("*"):
 if p.is_file() and p.suffix.lower() in {".html",".css",".js"}:
  try: x=p.read_text(encoding="utf-8")
  except UnicodeDecodeError: continue
  if "fonts.googleapis.com" in x or "fonts.gstatic.com" in x: errors.append(f"external Google Font reference: {p}")
for p in public.glob("*.html"):
 x=p.read_text(encoding="utf-8")
 if "/assets/fonts/fraunces-variable.woff2" not in x: errors.append(f"missing font preload: {p}")
print(f"checked {len(list(public.glob('*.html')))} pages, {len(required)} font files")
if errors:
 for e in errors: print("FAIL:",e)
 print(f"{len(errors)} failure(s)"); raise SystemExit(1)
print("0 failures - fonts are fully self-hosted")
