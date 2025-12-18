# Lighthouse Audit Guide

## 🚀 Running Lighthouse Audits

Lighthouse is Google's automated tool for measuring web page quality across performance, accessibility, SEO, and best practices.

---

## Method 1: Chrome DevTools (Easiest)

### Steps
1. **Open your site** in Google Chrome
   - Development: `http://localhost:3000`
   - Production: `https://vanmarkic.github.io/how-not-to-diet/`

2. **Open DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Or right-click → "Inspect"

3. **Navigate to Lighthouse**
   - Click the **"Lighthouse"** tab in DevTools
   - If not visible, click the `>>` icon and select Lighthouse

4. **Configure the audit**
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - Device: **Desktop** (test both Desktop and Mobile)
   - Mode: **Navigation** (default)

5. **Run the audit**
   - Click **"Analyze page load"**
   - Wait 30-60 seconds for results

6. **Review scores**
   - Target: 90+ for all categories
   - Click each category for detailed recommendations

### Mobile vs Desktop
- Run audits for **both** device types
- Mobile scores are typically lower (more important for SEO)
- Google primarily uses mobile scores for ranking

---

## Method 2: PageSpeed Insights (Public URLs)

### URL
https://pagespeed.web.dev/

### Steps
1. Go to PageSpeed Insights
2. Enter your URL: `https://vanmarkic.github.io/how-not-to-diet/`
3. Click **"Analyze"**
4. Review both **Mobile** and **Desktop** tabs
5. Check **Core Web Vitals** section

### Advantages
- Tests from Google's servers (real-world conditions)
- Shows field data from real users (if available)
- Includes Core Web Vitals assessment
- Public shareable report URL

---

## Method 3: Lighthouse CI (Automated Testing)

### Installation
```bash
npm install -g @lhci/cli

# Run locally
lhci autorun --collect.url=http://localhost:3000

# Or in package.json
npm install --save-dev @lhci/cli
```

### Configuration
Create `.lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4321/how-not-to-diet/'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Run CI
```bash
npm run build
npm run preview &
lhci autorun
```

---

## Method 4: Web.dev Measure

### URL
https://web.dev/measure/

### Features
- Similar to PageSpeed Insights
- Additional resources and guides
- Detailed optimization recommendations

---

## 📊 Expected Scores

### Target Scores (Post-Optimization)

| Category | Target | Current Estimate |
|----------|--------|------------------|
| **Performance** | 90-100 | 90-95 |
| **Accessibility** | 95-100 | 95-98 |
| **Best Practices** | 95-100 | 95-100 |
| **SEO** | 95-100 | 98-100 |

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

---

## 🔍 What Each Score Measures

### Performance (90-95 expected)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- Speed Index

**Key Factors:**
- Astro SSG = Fast static pages ✅
- Minimal JavaScript ✅
- Optimized fonts with preconnect ✅
- No large images (mainly SVG) ✅

### Accessibility (95-98 expected)
- ARIA attributes ✅
- Color contrast ✅
- Alt text on images ✅
- Semantic HTML ✅
- Keyboard navigation ✅
- Skip links ✅

**Implemented:**
- role attributes on all major elements
- aria-label on navigation
- Skip to main content link
- Proper heading hierarchy

### Best Practices (95-100 expected)
- HTTPS ✅ (GitHub Pages)
- Console errors ❓ (check in DevTools)
- Image aspect ratios ✅
- No vulnerable libraries ✅

### SEO (98-100 expected)
- Meta description ✅
- Title tag ✅
- Crawlable links ✅
- Valid HTML ✅
- robots.txt ✅
- Sitemap ✅
- Mobile-friendly ✅
- Structured data ✅

---

## 🛠️ Common Issues & Fixes

### Performance Issues

#### Issue: Large JavaScript bundles
**Current:** Minimal JS (only React islands)
**Action:** Already optimized ✅

#### Issue: Unoptimized images
**Current:** Mostly SVG, no large images
**Action:** If adding images, use `<Image>` component from `@astrojs/image`

#### Issue: Render-blocking resources
**Current:** Fonts with preconnect
**Action:** Consider font-display: swap (already using) ✅

#### Issue: Large DOM size
**Current:** Static pages, reasonable size
**Action:** Monitor as content grows

### Accessibility Issues

#### Issue: Color contrast
**Check:** Test with contrast checker
**Action:** Ensure 4.5:1 ratio minimum

#### Issue: Missing alt text
**Current:** No images requiring alt text yet
**Action:** Add alt text when adding images

#### Issue: Missing labels
**Current:** aria-label on navigation
**Action:** Add labels to any new form inputs

### SEO Issues

#### Issue: Missing meta description
**Current:** Implemented on all pages ✅
**Action:** None needed

#### Issue: Document doesn't have a valid hreflang
**Current:** Not using multi-language
**Action:** Add if creating translations

#### Issue: Links are not crawlable
**Current:** Using proper `<a>` tags
**Action:** Avoid JavaScript-only navigation

---

## 📈 Monitoring Over Time

### After Each Deploy
1. Run Lighthouse audit
2. Compare with previous scores
3. Investigate any regressions
4. Document significant changes

### Tools for Continuous Monitoring
- **Lighthouse CI** - Automated checks on every commit
- **Google Search Console** - Real user Core Web Vitals
- **PageSpeed Insights** - On-demand checks
- **Calibre** - Professional monitoring (paid)
- **SpeedCurve** - Performance monitoring (paid)

---

## ✅ Action Items

### Immediate
- [ ] Run Lighthouse on homepage (Desktop & Mobile)
- [ ] Run Lighthouse on `/foods` page
- [ ] Run Lighthouse on `/planner` page
- [ ] Document baseline scores
- [ ] Screenshot any issues

### After First Audit
- [ ] Address any red/orange items
- [ ] Optimize any images added
- [ ] Fix console errors if any
- [ ] Re-run to verify improvements

### Ongoing
- [ ] Run before each major release
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Set up automated Lighthouse CI
- [ ] Track scores in a spreadsheet

---

## 📝 Lighthouse Report Checklist

For each audit, document:

| Item | Value |
|------|-------|
| Date | ___________ |
| URL | ___________ |
| Device | Desktop / Mobile |
| Performance | ___/100 |
| Accessibility | ___/100 |
| Best Practices | ___/100 |
| SEO | ___/100 |
| LCP | ___s |
| FID | ___ms |
| CLS | _____ |
| Issues Found | ___________ |
| Actions Taken | ___________ |

---

## 🎯 Quick Audit Script

Add to `package.json`:
```json
{
  "scripts": {
    "audit": "npm run build && npm run preview & sleep 3 && open http://localhost:4321/how-not-to-diet/"
  }
}
```

Then open DevTools and run Lighthouse manually.

---

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Performance](https://web.dev/performance/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Guide](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
