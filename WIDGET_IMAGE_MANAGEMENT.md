# Widget Image Management Guide

## Overview
This guide explains how to manage and update widget images in your BigCommerce theme without touching the code.

## Image Storage Options

### 1. Theme Assets (Recommended)
Store images in your theme's assets folder:
```
assets/img/widgets/
├── mushroom-culture-icon.svg
├── grow-kit-icon.svg
├── dried-mushroom-icon.svg
├── tincture-icon.svg
├── equipment-icon.svg
└── supplies-icon.svg
```

**Template Usage:**
```html
<img src="{{cdn 'assets/img/widgets/mushroom-culture-icon.svg'}}" 
     alt="Mushroom Cultures" 
     class="widget-icon"
     loading="lazy">
```

### 2. BigCommerce Image Manager
Upload through Control Panel → Storefront → Image Manager

**Template Usage:**
```html
<img src="https://cdn11.bigcommerce.com/s-qe8ntvzzrw/images/stencil/original/image-manager/lc.png?t=1751701889" 
     alt="Liquid Cultures" 
     class="widget-icon"
     loading="lazy">
```

**Real Example (Liquid Cultures):**
Currently implemented in the circular widgets template using your existing BigCommerce hosted image.

### 3. WebDAV Upload
Use WebDAV to upload directly to your store's file system.

## Image Specifications

### Recommended Formats
- **SVG**: Vector graphics, scalable, best for icons
- **PNG**: Transparent backgrounds, good for detailed icons
- **WebP**: Modern format, smaller file sizes

### Size Guidelines
- **Dimensions**: 24x24px to 48x48px
- **File Size**: Under 10KB per image
- **Style**: Consistent design language across all widgets

## Current Widget Images Needed

### Product Category Widgets
1. **lc.png** - Liquid cultures (✅ **IMPLEMENTED** - BigCommerce hosted)
2. **grow-kit-icon.svg** - Ready-to-grow kits
3. **dried-mushroom-icon.svg** - Dried mushroom products
4. **tincture-icon.svg** - Liquid extracts and tinctures
5. **equipment-icon.svg** - Growing equipment and tools
6. **supplies-icon.svg** - Growing supplies and materials

### Status/Action Widgets
7. **search-icon.svg** - Search functionality
8. **cart-icon.svg** - Shopping cart
9. **account-icon.svg** - User account
10. **wishlist-icon.svg** - Wishlist/favorites
11. **compare-icon.svg** - Product comparison
12. **help-icon.svg** - Help and support

## Updating Widget Images

### Method 1: Replace Files (No Code Changes)
1. Create new image with same filename
2. Upload to same location
3. Clear BigCommerce cache
4. Image automatically updates

### Method 2: New Image with Code Update
1. Upload new image with different name
2. Update template reference:
```html
<!-- Change this -->
<img src="{{cdn 'assets/img/widgets/old-icon.svg'}}" 
     alt="Widget" class="widget-icon">

<!-- To this -->
<img src="{{cdn 'assets/img/widgets/new-icon.svg'}}" 
     alt="Widget" class="widget-icon">
```

## Widget Integration

### Adding to Sidebar
The widgets are integrated into the sidebar via:
```html
{{> components/common/circular-widgets}}
```

### Customizing Widget Links
Edit `templates/components/common/circular-widgets.html`:
```html
<a href="/your-custom-url/" 
   class="circular-widget circular-widget--gradient" 
   data-tooltip="Your Custom Widget"
   aria-label="Your Custom Widget">
    <img src="{{cdn 'assets/img/widgets/your-icon.svg'}}" 
         alt="Your Custom Widget" 
         class="widget-icon"
         loading="lazy">
</a>
```

## Best Practices

### Image Optimization
- Use SVG for simple icons
- Compress PNG/WebP images
- Use consistent color schemes
- Maintain aspect ratios

### Accessibility
- Always include `alt` attributes
- Use descriptive `aria-label`
- Ensure sufficient color contrast
- Test with screen readers

### Performance
- Add `loading="lazy"` for images
- Use appropriate file formats
- Optimize file sizes
- Consider CDN caching

## Quick Reference

### File Locations
- **Templates**: `templates/components/common/circular-widgets.html`
- **Styles**: `assets/scss/components/_circular-widgets.scss`
- **Images**: `assets/img/widgets/`

### CSS Classes
- `.circular-widget` - Base widget style
- `.circular-widget--primary` - Primary color variant
- `.circular-widget--success` - Success/green variant
- `.circular-widget--warning` - Warning/orange variant
- `.circular-widget--secondary` - Secondary/gray variant
- `.circular-widget--gradient` - Gradient background variant

### Update Process
1. Create/edit image
2. Upload to BigCommerce
3. Update template if needed
4. Test functionality
5. Deploy changes

This system allows you to update widget images anytime without code changes, giving you full control over the visual appearance of your sidebar widgets. 