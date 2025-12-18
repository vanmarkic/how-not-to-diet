# Pre-Deployment SEO Checklist

Use this checklist before deploying to ensure all SEO elements are properly configured.

## ✅ Core SEO Elements

- [x] **Robots.txt**: Created at `public/robots.txt`
- [x] **XML Sitemap**: Auto-generated via @astrojs/sitemap
- [x] **Meta Tags**: Title, description, keywords on all pages
- [x] **Open Graph Tags**: OG tags for social sharing
- [x] **Twitter Cards**: Twitter meta tags configured
- [x] **Canonical URLs**: Set on all pages
- [x] **Structured Data**: JSON-LD schemas implemented

## ✅ Content Optimization

- [x] **Page Titles**: Unique, descriptive, keyword-rich (50-60 chars)
- [x] **Meta Descriptions**: Compelling, under 160 characters
- [x] **Heading Hierarchy**: Proper H1→H2→H3 structure
- [x] **Internal Links**: Contextual links between pages
- [x] **Keywords**: Primary and LSI keywords in content

## ✅ Technical SEO

- [x] **Site Speed**: Astro SSG ensures fast loading
- [x] **Mobile-Friendly**: Responsive design
- [x] **HTTPS**: Served via GitHub Pages (automatic)
- [x] **Clean URLs**: No query parameters in main routes
- [x] **404 Page**: Astro default 404 handling

## ✅ Accessibility

- [x] **ARIA Labels**: Navigation and interactive elements
- [x] **Skip Links**: Skip to main content
- [x] **Semantic HTML**: Proper use of HTML5 elements
- [x] **Keyboard Navigation**: All interactive elements accessible

## ⚠️ Manual Tasks Required

### 1. Create Open Graph Image
- [ ] Design 1200x630px image
- [ ] Save as `public/og-image.png`
- [ ] Update if using different filename in Layout.astro

### 2. Set Up Google Tools
- [ ] Create Google Search Console account
- [ ] Verify site ownership
- [ ] Submit sitemap URL: `https://vanmarkic.github.io/how-not-to-diet/sitemap-index.xml`
- [ ] Set up Google Analytics (optional)

### 3. Test Social Sharing
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### 4. Run Audits
- [ ] Lighthouse audit (aim for 95+ SEO score)
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Schema.org Validator: https://validator.schema.org/

### 5. Monitor & Track
- [ ] Set up Search Console monitoring
- [ ] Check indexing status weekly
- [ ] Review organic traffic monthly

## 🎯 SEO Score Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| Lighthouse SEO | 95-100 | ✅ Expected: 98-100 |
| Lighthouse Accessibility | 95-100 | ✅ Expected: 95-98 |
| Lighthouse Performance | 90+ | ✅ Expected: 90-95 |
| Lighthouse Best Practices | 95-100 | ✅ Expected: 95-100 |
| Structured Data Errors | 0 | ✅ 0 expected |

## 📊 Post-Launch Actions

### Week 1
- [ ] Verify Google Search Console shows no errors
- [ ] Check that sitemap is being crawled
- [ ] Test all social sharing links

### Week 2
- [ ] Review initial search impressions
- [ ] Check for crawl errors
- [ ] Verify structured data is showing in search

### Month 1
- [ ] Analyze which pages rank for which keywords
- [ ] Review bounce rate and time on page
- [ ] Consider creating FAQ page for common queries

### Month 3
- [ ] Full content audit
- [ ] Update meta descriptions based on CTR data
- [ ] Plan content expansion (blog posts, guides)

## 🚀 Advanced Optimizations (Future)

- [ ] Add FAQ schema markup
- [ ] Create blog section for content marketing
- [ ] Add user reviews/testimonials
- [ ] Implement breadcrumbs on all pages
- [ ] Add video content with VideoObject schema
- [ ] Create downloadable resources (PDFs)
- [ ] Build backlinks through guest posting
- [ ] Launch email newsletter
- [ ] Create infographics for social sharing

## 📝 Notes

- All meta tags are configured to receive props from each page
- Structured data is page-specific and comprehensive
- Site uses semantic HTML5 throughout
- Mobile-first responsive design ensures good mobile rankings
- Fast build times and small bundle sizes for optimal performance

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
