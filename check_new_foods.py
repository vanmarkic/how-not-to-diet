#!/usr/bin/env python3
import json
import os

foods_dir = "/Users/dragan/Documents/how-not-to-diet/data/foods"

new_files = [
    "teff.json",
    "berbere-spice-blend.json",
    "onion-powder.json",
    "moong-dal-split-mung-beans.json",
    "green-chilli.json",
    "cocoa-powder-unsweetened.json",
    "cherries-dark.json",
    "cacao-nibs.json",
    "chocolate-balsamic-vinegar.json",
    "plums.json",
    "nectarines.json",
    "dates-soft-medjool.json",
    "pumpkin-puree.json",
    "treacle.json",
    "date-syrup.json",
    "vanilla-extract-pure.json"
]

print("NEW FOODS FROM PAGES 271-320:")
print("=" * 60)

for filename in new_files:
    filepath = os.path.join(foods_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            data = json.load(f)
            food_id = data.get('id', 'NO ID')
            name = data.get('name', 'NO NAME')
            pages = data.get('sources', {}).get('pages', [])
            print(f"{food_id:12} | {name:35} | Pages: {pages}")
    else:
        print(f"MISSING     | {filename:35} | NOT FOUND")

print("=" * 60)
