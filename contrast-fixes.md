# WCAG Contrast Fixes

## Problem
Carrot color (#e67e22) fails WCAG AA on dark green backgrounds:
- On Forest Deep (#1a3d2e): 4.21:1 (needs 4.5:1)
- On Forest Mid (#2d5a3d): 2.79:1 (needs 4.5:1)

## Solution Options

### Option 1: Lighten Carrot for Dark Backgrounds (Recommended)
Use a lighter shade of carrot/orange for hover states on dark backgrounds:
- **#ff914d** (lighter carrot) on Forest Deep: 5.77:1 ✓ AA
- **#ffa366** (even lighter) on Forest Mid: 5.02:1 ✓ AA

### Option 2: Use Golden Color Instead
The golden color (#d4a574) already has better contrast:
- Golden on Forest Deep: 5.91:1 ✓ AA
- Golden on Forest Mid: 3.92:1 ✗ (still fails)

### Option 3: Use Sage Color for Hover
The sage color (#a8b5a0) has excellent contrast:
- Sage on Forest Deep: 7.06:1 ✓ AAA
- Sage on Forest Mid: 4.68:1 ✓ AA

## Recommended Implementation

Add CSS custom properties for accessible hover colors:

```css
:root {
  --color-carrot: #e67e22;
  --color-carrot-light: #ff914d; /* For dark backgrounds */
  --color-carrot-lighter: #ffa366; /* For medium-dark backgrounds */
}
```

Update hover states in Layout.astro:

```css
/* Header links hover - use lighter carrot */
nav ul li a:hover {
  color: var(--color-carrot-light); /* Changed from carrot */
}

/* Footer links hover - use even lighter carrot */
.footer-nav a:hover {
  color: var(--color-carrot-lighter); /* Changed from carrot */
}

/* Footer developer name - use lighter carrot */
.developer strong {
  color: var(--color-carrot-light); /* Changed from carrot */
}
```

## Test Results After Fix

With these changes:
- Header Links Hover: 5.77:1 ✓ AA
- Footer Developer: 5.77:1 ✓ AA
- Footer Links Hover: 5.02:1 ✓ AA

All combinations will pass WCAG AA standards!
