#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifie que les metadonnees OG/Twitter/canonical sont bien formees sur toutes les pages."""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

issues = []
checked = 0

for dirpath, _, files in os.walk(ROOT):
    parts = dirpath.split(os.sep)
    if any(p in ("css", "js", "assets", ".git", "node_modules") for p in parts):
        continue
    for fname in files:
        if not fname.endswith(".html"):
            continue
        full = os.path.join(dirpath, fname)
        with open(full, "r", encoding="utf-8") as f:
            html = f.read()
        checked += 1
        rel = os.path.relpath(full, ROOT)

        # og:title doit etre present et bien ferme
        if 'property="og:title"' not in html:
            issues.append((rel, "og:title manquant"))
        if re.search(r'<meta\s+property="og:type"\s+content="[^"]*"\s*$', html, re.M):
            issues.append((rel, "og:type non ferme"))
        # canonical doit etre ferme
        if re.search(r'rel="canonical"\s+href="[^"]*"\s*$', html, re.M):
            issues.append((rel, "canonical non ferme"))
        # pas de ' />' orphelin
        if re.search(r'^\s*/\s*>\s*$', html, re.M):
            issues.append((rel, "' />' orphelin"))

print("Pages verifiees :", checked)
if issues:
    print("PROBLEMES :")
    for p, m in issues:
        print("  -", p, "->", m)
    sys.exit(1)
else:
    print("OK : metadonnees bien formees.")
    sys.exit(0)
