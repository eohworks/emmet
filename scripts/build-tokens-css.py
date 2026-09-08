#!/usr/bin/env python3
"""Generate tokens.css from tokens.json. Do not hand-edit tokens.css — edit tokens.json and rerun this."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
tokens = json.loads((ROOT / "tokens.json").read_text())

lines = []


def css_name(path):
    # Drop the top-level tier ("primitive"/"semantic"/"component"), join the rest with hyphens.
    return "--" + "-".join(path[1:])


def resolve_value(value):
    if isinstance(value, str) and value.startswith("{") and value.endswith("}"):
        ref_path = value.strip("{}").split(".")
        return f"var({css_name(ref_path)})"
    return value


def walk(node, path):
    if not isinstance(node, dict):
        return
    if "$value" in node:
        lines.append(f"  {css_name(path)}: {resolve_value(node['$value'])};")
        return
    for key, child in node.items():
        if key.startswith("$"):
            continue
        walk(child, path + [key])


for tier in ["primitive", "semantic", "component"]:
    lines.append(f"\n  /* ---- {tier} ---- */")
    walk(tokens[tier], [tier])

css = "/* AUTO-GENERATED from tokens.json — run scripts/build-tokens-css.py to regenerate. Do not hand-edit. */\n:root {\n" + "\n".join(lines) + "\n}\n"
(ROOT / "tokens.css").write_text(css)
print(f"Wrote tokens.css with {sum(1 for l in lines if l.strip().startswith('--'))} custom properties")
