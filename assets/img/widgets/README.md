# Widget Images Directory

This directory contains images for the circular product widgets used in the sidebar navigation.

## Required Images

The following images are referenced in the circular widgets component:

### Quick Actions
- `home-widget.png` - Home/Dashboard icon

### Educational Resources  
- `business-blueprint.png` - Mushroom Business Starter Blueprint icon

### Product Categories
- `liquid-cultures.png` - Liquid Cultures product icon
- `desert-grow-kit.png` - Desert Grow Kit Duo icon
- `gourmet-chef.png` - Gourmet Chef Sampler icon
- `tincture-pair.png` - Focus & Immunity Tincture Pair icon
- `crowe-curated.png` - Crowe Curated Starter Business icon
- `substrate-bundle.png` - Substrate Starter Bundle icon
- `grain-spawn.png` - Mycelium Grain Spawn icon

### AI & Tools
- `crowe-logic-gpt.png` - Crowe Logic GPT icon
- `crowe-logic-apps.png` - Crowe Logic Apps icon

## Image Guidelines

- **Size**: 120x120px recommended (will be displayed at 60x60px on mobile)
- **Format**: PNG with transparency or SVG
- **Style**: Clean, minimalist icons that match the glass morphism aesthetic
- **Colors**: Should work on light backgrounds with subtle shadows

## Temporary SVG Placeholders

Until proper images are created, you can use these inline SVG data URIs as placeholders:

```html
<!-- Mushroom Icon Placeholder -->
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%234CAF50' opacity='0.1'/%3E%3Cpath d='M60 30c-11 0-20 9-20 20 0 5 2 10 5 13v27h30V63c3-3 5-8 5-13 0-11-9-20-20-20zm0 10c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10z' fill='%234CAF50'/%3E%3C/svg%3E

<!-- Flask/Culture Icon Placeholder -->
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%232196F3' opacity='0.1'/%3E%3Cpath d='M45 30v20L30 80c-2 4 0 10 5 10h50c5 0 7-6 5-10L75 50V30h-30zm10 10h10v15l15 25H40l15-25V40z' fill='%232196F3'/%3E%3C/svg%3E

<!-- Kit/Box Icon Placeholder -->
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FF9800' opacity='0.1'/%3E%3Cpath d='M30 40v40c0 5 5 10 10 10h40c5 0 10-5 10-10V40c0-5-5-10-10-10H40c-5 0-10 5-10 10zm10 0h40v40H40V40zm10 10v20h20V50H50z' fill='%23FF9800'/%3E%3C/svg%3E
```

## Implementation Note

To use these placeholders, update the circular-widgets.html template to use data URIs instead of missing images:

```handlebars
<img src="{{cdn 'assets/img/widgets/liquid-cultures.png' fallback='data:image/svg+xml,%3Csvg...'}}" 
     alt="Liquid Cultures" 
     class="widget-icon"
     loading="lazy">
``` 