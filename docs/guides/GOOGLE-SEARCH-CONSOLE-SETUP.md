# Google Search Console Setup Guide

## Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"**

## Step 2: Verify Your Site

### Option A: HTML File Upload (Recommended)
1. Select **"URL prefix"** property type
2. Enter: `https://vanmarkic.github.io/how-not-to-diet/`
3. Choose **"HTML file"** verification method
4. Download the verification file (e.g., `google1234567890abcdef.html`)
5. Upload it to `public/` folder in your project
6. Rebuild and deploy: `npm run build && git add . && git commit -m "Add GSC verification" && git push`
7. Click **"Verify"** in Search Console

### Option B: HTML Tag Method
1. Choose **"HTML tag"** verification
2. Copy the meta tag provided
3. Add it to `src/layouts/Layout.astro` in the `<head>` section:
```astro
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```
4. Deploy and verify

### Option C: DNS Verification (if you have a custom domain)
1. Choose **"Domain"** property type
2. Add the TXT record to your DNS settings
3. Wait for DNS propagation (can take up to 48 hours)
4. Click **"Verify"**

## Step 3: Submit Your Sitemap

1. After verification, go to **"Sitemaps"** in the left sidebar
2. Enter your sitemap URL: `sitemap-index.xml`
3. Click **"Submit"**
4. Your sitemap URL will be: `https://vanmarkic.github.io/how-not-to-diet/sitemap-index.xml`

## Step 4: Initial Setup

1. **Coverage Report**: Check for any indexing issues
2. **Performance**: View search performance data (takes 1-2 days to populate)
3. **URL Inspection**: Test individual URLs for indexing status
4. **Mobile Usability**: Ensure no mobile issues

## Step 5: Monitor Regularly

### Weekly Tasks
- Check **Coverage** for errors
- Review **Performance** trends
- Look for **Manual Actions** (penalties)

### Monthly Tasks
- Analyze top-performing queries
- Review click-through rates (CTR)
- Check for crawl errors
- Update sitemaps if needed

## Expected Timeline

| Action | Timeline |
|--------|----------|
| Verification | Immediate |
| Sitemap submission | Immediate |
| First crawl | 1-3 days |
| Initial indexing | 3-7 days |
| Performance data | 2-3 days |
| Full site indexed | 1-2 weeks |

## Troubleshooting

### Issue: Verification Failed
- Ensure the verification file is accessible
- Check that you've deployed the changes
- Try clearing cache and reverifying

### Issue: Sitemap Not Found
- Verify sitemap URL is correct
- Check that `sitemap-index.xml` exists in your deployed site
- Ensure robots.txt points to the sitemap

### Issue: Pages Not Indexed
- Wait 1-2 weeks for initial crawling
- Use **URL Inspection Tool** to request indexing
- Check for noindex tags or robots.txt blocks

## Pro Tips

1. **Set up email alerts** for critical issues
2. **Link Google Analytics** for combined insights
3. **Use URL Parameters** tool if you have tracking parameters
4. **Submit individual URLs** for faster indexing using URL Inspection
5. **Monitor Core Web Vitals** for performance insights

## Resources

- [Search Console Help](https://support.google.com/webmasters/)
- [Search Console Training](https://developers.google.com/search/docs/beginner/search-console)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
