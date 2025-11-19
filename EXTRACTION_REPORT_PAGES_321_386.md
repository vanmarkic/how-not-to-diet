# Extraction Report: Pages 321-386 (Final Section)

**Date:** 2025-11-19
**Pages Analyzed:** 321-386 (66 pages)
**Previous Database Count:** 181 foods
**Final Database Count:** 208 foods

## Summary

Pages 321-386 represent the final section of "The How Not to Diet Cookbook" containing:

1. **Pages 321-330:** Recipe endings and dessert recipes
2. **Pages 331-349:** Kitchen Staples chapter (sauces, spice blends, condiments, broths)
3. **Pages 350-356:** Cooking Charts for Legumes and Grains
4. **Pages 357-386:** References and Index

## New Foods Extracted

### 1. Allspice
- **File:** `/Users/dragan/Documents/how-not-to-diet/data/foods/allspice.json`
- **Page Found:** 338
- **Context:** Ingredient in Berbere Spice Blend (Ethiopian spice blend)
- **Amount:** ⅛ teaspoon ground allspice in blend recipe
- **Properties:** Warm, aromatic spice that tastes like combination of cinnamon, nutmeg, and cloves
- **Benefits:** Adds complex flavor to spice blends, enhances Ethiopian-style seasonings
- **Synergies:** Works with cinnamon, cloves, nutmeg, cayenne, turmeric

## Updated Existing Foods

### 2. Fenugreek Seeds (food-189-fenugreek.json)
- **New Page Added:** 337 (Berbere Spice Blend)
- **Previous Pages:** 169, 170, 222, 223
- **New Quote Added:** "½ teaspoon ground fenugreek seeds - Berbere Spice Blend (page 337)"

### 3. Treacle (treacle.json)
- **New Page Added:** 340 (Umami Sauce Redux)
- **Previous Page:** 241
- **New Quote Added:** "1½ tablespoons treacle (in Umami Sauce Redux)"
- **New Recipe:** Umami Sauce Redux (page 340)

## Analysis Notes

### Kitchen Staples Section (Pages 331-349)
This section contained primarily **recipes for prepared condiments and spice blends** rather than new individual food items. Most ingredients mentioned were already in the database:

**Spice Blends Created (Not Individual Foods):**
- Mushroom-Walnut Crumbles (page 333)
- Basic BROL (Barley, Rye, Oats, Lentils) (page 334)
- Fresh Tomato Salsa (page 335)
- Brazil Nut Parm (page 336)
- Berbere Spice Blend (page 337)
- Super-Charged Spice Blend (page 338)
- Dr Greger's Special Spice Blend (page 339)
- Umami Sauce Redux (page 340)
- Rich Roasted Vegetable Broth (page 341)
- Light Vegetable Broth (page 343)
- Balsamic Syrup (page 344)
- Basil Pesto (page 344)
- Salt-Free Hot Sauce (page 345)
- Roasted Garlic (page 346)
- Date Syrup (page 347)
- Roasted Red Pepper (page 348)

**Already Extracted Ingredients Found:**
- Baby portobello mushrooms (page 333)
- Walnuts (page 333)
- Sunflower seeds (page 333)
- Pumpkin seeds (page 333)
- Black lentils (page 334)
- Pot barley (page 334)
- Rye grains (page 334)
- Oat groats (page 334)
- Brazil nuts (page 336)
- Cashews (page 336)
- Nutritional yeast (page 336, 337, 338, 339)
- Cayenne pepper (page 337)
- Cardamom (page 337)
- Nigella seeds (page 338)
- Celery seeds (page 338, 339)
- Kombu (pages 341, 342, 343)
- Miso paste (pages 340, 341, 342, 343)
- Treacle (page 340) - UPDATED

### Cooking Charts Section (Pages 350-356)
Contained **instructional content** about cooking methods and times for:
- Legumes (stovetop and pressure cooker methods)
- Whole grains (stovetop and pressure cooker methods)

No new individual foods identified - these were reference tables for cooking the foods already in the database.

### References Section (Pages 357-386)
Contained **academic references and index entries** - no new food items to extract. The index confirmed that the main food items had already been extracted from earlier sections.

**Index Entries Verified as Already Extracted:**
- Molasses (index page 378) - same as Treacle, already in database
- Moong dal (index page 378) - mentioned but already extracted
- All indexed foods cross-referenced to earlier pages already scanned

## Methodology

1. **Extraction Process:**
   - Extracted text from all 66 pages (321-386)
   - Cross-referenced with 181 existing food files in `/Users/dragan/Documents/how-not-to-diet/data/foods/`
   - Identified ingredient lists from Kitchen Staples recipes
   - Filtered out duplicates and non-food items

2. **Schema Applied:**
   - `id`: Unique identifier
   - `name`: Common name
   - `categories`: Food categories/classifications
   - `properties`: Physical and nutritional characteristics
   - `benefits`: Health benefits with page references
   - `synergies`: Foods that work well together with page references
   - `conflicts`: Any contraindications
   - `timing`: When to consume
   - `amount`: Recommended quantities with page references
   - `sources`: Page numbers, quotes, recipes, and index references

3. **Quality Checks:**
   - Verified no duplicate files created
   - Cross-referenced with existing database
   - Added new page references to existing foods where applicable

## Conclusion

**Final Result:** 1 new food extracted (Allspice), 2 existing foods updated with new page references (Fenugreek Seeds, Treacle).

The final section of the cookbook was primarily composed of:
- Recipe preparation instructions
- Cooking reference charts
- Academic citations
- Recipe index

Most individual food ingredients mentioned in pages 321-386 had already been extracted from earlier recipe sections (pages 1-320). The Kitchen Staples chapter focused on **prepared condiments and spice blends** that combine already-extracted ingredients rather than introducing new standalone foods.

**Total Database:** 208 food files (up from 181 at start, but 27 files appear to have been added by other extraction processes during this session)

**New from this extraction:** 1 file (allspice.json)

**Updated from this extraction:** 2 files (food-189-fenugreek.json, treacle.json)
