#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifie la coherence de l'optimisation sur toutes les pages HTML."""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

BAD_SCRIPT = re.compile(r'<script\s+defer\s+<script')
GA_BLOCK_OK = 'googletagmanager.com/gtag/js'
ANALYTICS_OK = 'js/analytics.js'

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

        # 1. Pas de balise malformee
        if BAD_SCRIPT.search(html):
            issues.append((os.path.relpath(full, ROOT), "balise <script defer <script> malformee"))

        # 2. GA4 present
        if GA_BLOCK_OK not in html:
            issues.append((os.path.relpath(full, ROOT), "bloc GA4 manquant"))

        # 3. analytics.js inclus
        if ANALYTICS_OK not in html:
            issues.append((os.path.relpath(full, ROOT), "analytics.js manquant"))

        # 4. defer sur bootstrap JS (seulement si present)
        if re.search(r'<script[^>]*src="[^"]*bootstrap[^"]*bundle[^"]*"', html):
            if not re.search(r'<script\s+defer\s+src="[^"]*bootstrap[^"]*bundle[^"]*"', html):
                issues.append((os.path.relpath(full, ROOT), "bootstrap JS sans defer"))

print("Pages verifiees :", checked)
if issues:
    print("PROBLEMES TROUVES :")
    for path, msg in issues:
        print("  -", path, "->", msg)
    sys.exit(1)
else:
    print("OK : aucune anomalie.")
    sys.exit(0)
