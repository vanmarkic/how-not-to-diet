#!/usr/bin/env python3
from pathlib import Path
import os

base_dir = Path("/Users/dragan/Documents/how-not-to-diet")
print("Searching for PDF files...")
for p in base_dir.glob("*.pdf"):
    print(f"\nFound: {p}")
    print(f"  Name: {p.name}")
    print(f"  Exists: {p.exists()}")
    print(f"  Is file: {p.is_file()}")
    print(f"  Is symlink: {p.is_symlink()}")
    if p.is_symlink():
        print(f"  Symlink target: {os.readlink(p)}")
    if p.is_file():
        print(f"  Size: {p.stat().st_size} bytes")
        print(f"  Repr: {repr(str(p))}")
