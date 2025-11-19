# Social Sharing Testing Guide

## 🔍 Why Test Social Sharing?

Testing ensures your Open Graph and Twitter Card meta tags are working correctly and that your site appears beautifully when shared on social media.

---

## 1. Facebook Sharing Debugger

### URL
https://developers.facebook.com/tools/debug/

### Steps
1. Go to the Facebook Sharing Debugger
2. Enter your URL: `https://vanmarkic.github.io/how-not-to-diet/`
3. Click **"Debug"**
4. Review the preview:
   - ✅ Title should be: "How Not To Diet - Evidence-Based Weekly Menu Planner"
   - ✅ Description should show your full description
   - ✅ Image should be 1200x630px (og-image.png or og-image.svg)
5. Click **"Scrape Again"** if you made changes
6. Test other important pages:
   - `/foods` - Foods database page
   - `/foods/kale` - Individual food page
   - `/recipes` - Recipes page
   - `/planner` - Planner page

### Expected Results
```
Property            | Value
--------------------|--------------------------------------------------
og:url              | https://vanmarkic.github.io/how-not-to-diet/
og:type             | website
og:title            | How Not To Diet - Evidence-Based Weekly Menu...
og:description      | Free science-based meal planning tool...
og:image            | https://vanmarkic.github.io/how-not-to-diet/og-image.svg
og:image:width      | 1200
og:image:height     | 630
```

### Common Issues
- **Image not showing**: Check image URL is absolute, not relative
- **Old data cached**: Click "Scrape Again" to refresh
- **Image too small**: Must be at least 200x200px, recommended 1200x630px

---

## 2. Twitter Card Validator

### URL
https://cards-dev.twitter.com/validator

### Steps
1. Go to the Twitter Card Validator
2. Enter your URL: `https://vanmarkic.github.io/how-not-to-diet/`
3. Click **"Preview card"**
4. Review the preview:
   - ✅ Card type should be "Summary Card with Large Image"
   - ✅ Title, description, and image should appear
5. Test multiple pages

### Expected Results
```
Property              | Value
----------------------|--------------------------------------------------
twitter:card          | summary_large_image
twitter:title         | How Not To Diet - Evidence-Based Weekly...
twitter:description   | Free science-based meal planning tool...
twitter:image         | https://vanmarkic.github.io/.../og-image.svg
twitter:creator       | @draganmarkovic
```

### Common Issues
- **Card not showing**: Ensure `twitter:card` is set to `summary_large_image`
- **Image problems**: Twitter prefers JPG/PNG, may have issues with SVG
- **Title truncated**: Keep under 70 characters

---

## 3. LinkedIn Post Inspector

### URL
https://www.linkedin.com/post-inspector/

### Steps
1. Go to LinkedIn Post Inspector
2. Enter your URL: `https://vanmarkic.github.io/how-not-to-diet/`
3. Click **"Inspect"**
4. Review how it appears
5. LinkedIn uses Open Graph tags (same as Facebook)

### Expected Results
- Title, description, and image from Open Graph tags
- Professional appearance with clear branding
- Image displays correctly (1200x630px)

### Common Issues
- **No preview**: LinkedIn may take time to cache
- **Old preview**: Clear LinkedIn cache by re-inspecting
- **Image quality**: Ensure high-resolution image

---

## 4. Manual Testing (Real Sharing)

### Facebook
1. Create a test post (set to "Only Me" visibility)
2. Paste your URL
3. Wait for preview to load
4. Check if title, description, and image appear correctly
5. Delete test post after verification

### Twitter
1. Create a draft tweet
2. Paste your URL
3. Wait for card preview
4. Verify appearance
5. Discard draft

### LinkedIn
1. Click "Start a post"
2. Paste your URL
3. Wait for preview
4. Check appearance
5. Discard draft

---

## 5. Additional Testing Tools

### Microsoft Teams
- Paste URL in a Teams chat
- Should show rich preview

### Slack
- Paste URL in a Slack channel
- Should unfurl with preview

### WhatsApp
- Send URL in a chat
- Should show link preview

### iMessage
- Send URL in iMessage
- Should show preview on iOS

---

## 6. Testing Checklist

Test these URLs on each platform:

- [ ] **Homepage**: `https://vanmarkic.github.io/how-not-to-diet/`
- [ ] **Foods Page**: `https://vanmarkic.github.io/how-not-to-diet/foods`
- [ ] **Recipes Page**: `https://vanmarkic.github.io/how-not-to-diet/recipes`
- [ ] **Planner Page**: `https://vanmarkic.github.io/how-not-to-diet/planner`
- [ ] **Combos Page**: `https://vanmarkic.github.io/how-not-to-diet/combos`
- [ ] **Individual Food**: `https://vanmarkic.github.io/how-not-to-diet/foods/kale`

---

## 7. What to Look For

### ✅ Good Signs
- Image loads quickly
- Title is clear and enticing
- Description provides context
- No broken images or missing text
- Consistent branding across platforms
- Image is high-quality, not pixelated

### ❌ Red Flags
- Broken image icon
- Generic "No preview available"
- Title showing URL instead of page title
- Description is missing or truncated
- Image is wrong size or distorted
- Inconsistent information across platforms

---

## 8. Fixing Issues

### If Image Doesn't Load
1. Check image file exists in `public/` folder
2. Verify image URL is absolute (starts with `https://`)
3. Ensure image is publicly accessible
4. Try different image format (PNG instead of SVG)
5. Re-scrape in Facebook Debugger

### If Meta Tags Are Wrong
1. Check `src/layouts/Layout.astro` for meta tag configuration
2. Verify props are being passed correctly from page components
3. Rebuild and redeploy
4. Clear cache in social media validators

### If Title/Description Is Generic
1. Check page-specific props in each `.astro` file
2. Ensure `title` and `description` are being passed to Layout
3. Verify no default values are overriding custom values

---

## 9. Best Practices

1. **Image Guidelines**:
   - Minimum: 200x200px
   - Recommended: 1200x630px (Facebook/Twitter)
   - Format: JPG or PNG (SVG may not work everywhere)
   - File size: Under 1MB
   - Aspect ratio: 1.91:1

2. **Title Guidelines**:
   - Length: 50-70 characters
   - Include brand name
   - Clear and descriptive
   - Action-oriented when possible

3. **Description Guidelines**:
   - Length: 120-160 characters
   - Compelling call-to-action
   - Include key benefits
   - Natural, not keyword-stuffed

---

## 10. After Testing

Once all tests pass:

1. ✅ **Document results** in your notes
2. ✅ **Take screenshots** for reference
3. ✅ **Share on your personal accounts** to verify
4. ✅ **Monitor engagement** when shared by others
5. ✅ **Iterate and improve** based on performance

---

## Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices)
- [LinkedIn Post Inspector Help](https://www.linkedin.com/help/linkedin/answer/a521928)
