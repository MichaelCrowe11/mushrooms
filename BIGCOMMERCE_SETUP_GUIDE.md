# BigCommerce Page Setup Guide

## Web Pages Creation

Follow these steps to create the custom pages in your BigCommerce admin:

### 1. Videos Page
```
Navigate to: Storefront → Web Pages → Create Page

Page Details:
- Page Title: Video Library
- Page URL: /videos
- Meta Description: Watch mushroom cultivation videos, facility tours, and growing tutorials from Southwest Mushrooms
- Search Keywords: mushroom videos, cultivation tutorials, growing guides, facility tour
- Page Content: (Leave empty - template will handle content)
- Template Layout File: videos.html
- Sort Order: 1
- Visible: ✓ Yes
```

### 2. GPT Lab Page
```
Navigate to: Storefront → Web Pages → Create Page

Page Details:
- Page Title: Crowe GPT Lab
- Page URL: /gpt-lab
- Meta Description: Get expert mushroom cultivation advice from Crowe, our AI assistant. Ask questions about growing techniques, products, and more
- Search Keywords: AI assistant, mushroom advice, growing help, cultivation assistant, crowe
- Page Content: (Leave empty - template will handle content)
- Template Layout File: gpt-lab.html
- Sort Order: 2
- Visible: ✓ Yes
```

### 3. Apps Hub Page
```
Navigate to: Storefront → Web Pages → Create Page

Page Details:
- Page Title: Apps Hub
- Page URL: /apps
- Meta Description: Discover powerful tools and integrations to enhance your mushroom cultivation journey
- Search Keywords: apps, tools, integrations, cultivation apps, mushroom tools
- Page Content: (Leave empty - template will handle content)
- Template Layout File: apps.html
- Sort Order: 3
- Visible: ✓ Yes
```

## Script Manager Setup

### 1. Google Analytics 4
```
Navigate to: Advanced Settings → Script Manager → Create Script

Script Details:
- Name: Google Analytics 4 - Southwest Mushrooms
- Description: Track website performance and user behavior
- Location: Head
- Select pages: All pages
- Script category: Analytics
- Script type: Script

Copy script content from: script-manager-config.json → analytics.google_analytics_4.script
Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID
```

### 2. Facebook Pixel (Optional)
```
Navigate to: Advanced Settings → Script Manager → Create Script

Script Details:
- Name: Facebook Pixel - Southwest Mushrooms
- Description: Track conversions and retarget website visitors
- Location: Head
- Select pages: All pages
- Script category: Marketing
- Script type: Script

Copy script content from: script-manager-config.json → marketing.facebook_pixel.script
Replace 'FACEBOOK_PIXEL_ID' with your actual Facebook Pixel ID
```

### 3. Live Chat Integration (Optional)
```
Navigate to: Advanced Settings → Script Manager → Create Script

Script Details:
- Name: Crisp Live Chat - Southwest Mushrooms
- Description: Provide real-time customer support
- Location: Footer
- Select pages: All pages
- Script category: Functional
- Script type: Script

Copy script content from: script-manager-config.json → customer_support.crisp_chat.script
Replace 'CRISP_WEBSITE_ID' with your actual Crisp Website ID
```

## Navigation Setup

The navigation has been automatically updated in the theme to include:
- Videos (🎥)
- Crowe GPT Lab (🤖)
- Apps Hub (⚡)

No additional navigation setup is required.

## SEO Configuration

### Meta Tags
Each page template includes proper meta tags and Open Graph tags. Ensure you:

1. Set up proper canonical URLs in BigCommerce settings
2. Configure XML sitemap to include new pages
3. Set up 301 redirects if moving from existing pages

### Structured Data
The templates include schema.org markup for:
- Breadcrumbs
- Organization data
- WebPage schema

## Testing Checklist

### Pre-Launch Testing
- [ ] Preview theme before applying
- [ ] Test all page templates load correctly
- [ ] Verify navigation links work on desktop and mobile
- [ ] Check dark/light mode toggle functionality
- [ ] Test video gallery interactions
- [ ] Verify GPT Lab iframe loads properly
- [ ] Test Apps Hub responsive design
- [ ] Validate all forms and CTAs work

### Post-Launch Testing
- [ ] Run Lighthouse audit on all pages
- [ ] Test Core Web Vitals performance
- [ ] Verify analytics tracking works
- [ ] Check mobile responsiveness
- [ ] Test accessibility with screen readers
- [ ] Validate SEO meta tags are correct

### Performance Benchmarks
Target scores:
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Lighthouse SEO: >95
- Core Web Vitals: All Green

## Go-Live Process

1. **Preview Theme**: Test thoroughly in preview mode
2. **Apply Theme**: Make live when ready
3. **Clear CDN Cache**: Advanced Settings → CDN Cache → Purge All
4. **Monitor**: Check analytics and error logs
5. **Backup**: Save theme files and configuration

## Support & Maintenance

### Regular Tasks
- Monitor Core Web Vitals monthly
- Update video content quarterly
- Review analytics data weekly
- Test mobile experience monthly
- Update GPT Lab features as needed

### Emergency Contacts
- Theme Developer: [Contact info]
- BigCommerce Support: support@bigcommerce.com
- Analytics Specialist: [Contact info]
