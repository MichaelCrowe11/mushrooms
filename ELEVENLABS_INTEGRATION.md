# ElevenLabs Conversational AI Widget Integration

## Overview
Your Southwest Mushrooms theme now includes an integrated ElevenLabs conversational AI assistant that provides an interactive voice-based shopping experience for your customers.

## What's Been Added

### 1. Widget Implementation
- **Location**: Added to `templates/layout/base.html`
- **Position**: Bottom right corner of all pages (except checkout)
- **Agent ID**: `agent_01jz4jgxksfj7v6tkc6f1g7d9y`

### 2. Custom Styling
- **File**: `assets/scss/components/_elevenlabs-widget.scss`
- **Features**:
  - Glass morphism effect matching your theme
  - Purple gradient button design
  - Responsive positioning
  - Dark mode support
  - Smooth animations
  - Mobile optimization

### 3. Smart Behavior
- **Auto-hides on checkout pages** for better UX
- **Adjusts position** when cart sidebar is open
- **Scales down** on mobile devices
- **Respects reduced motion** preferences
- **Fades when mobile menu** is open

## How It Works

### Customer Experience
1. **Widget appears** as a floating button in the bottom right
2. **Click to activate** voice conversation
3. **Ask questions** about products, orders, or store info
4. **Get instant responses** from your AI assistant

### Technical Details
```html
<!-- Widget Code -->
<elevenlabs-convai agent-id="agent_01jz4jgxksfj7v6tkc6f1g7d9y"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

### Styling Features
- **Glass morphism background** with blur effect
- **Gradient button** (purple theme: #667eea to #764ba2)
- **Hover effects** with scale and shadow
- **Entrance animation** (slideInUp)
- **Z-index: 9999** to stay above other elements

## Customization Options

### Change Position
Edit in `_elevenlabs-widget.scss`:
```scss
elevenlabs-convai {
    bottom: 20px !important;  // Adjust distance from bottom
    right: 20px !important;   // Adjust distance from right
}
```

### Change Colors
Edit the gradient in `_elevenlabs-widget.scss`:
```scss
elevenlabs-convai::part(launch-button) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Hide on Specific Pages
Add page templates to hide list:
```scss
.template-checkout,
.template-login {
    elevenlabs-convai {
        display: none !important;
    }
}
```

## Benefits

### For Customers
- **24/7 Support** - Always available to answer questions
- **Voice Shopping** - Natural conversation interface
- **Product Discovery** - Help finding the right mushrooms
- **Order Assistance** - Track orders and shipping

### For Your Business
- **Reduced Support Load** - AI handles common questions
- **Increased Engagement** - Interactive shopping experience
- **Better Conversions** - Guided product recommendations
- **Data Insights** - Learn what customers ask about

## Troubleshooting

### Widget Not Appearing
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Clear browser cache
4. Check if blocked by ad blockers

### Position Issues
- Widget moves left when cart opens
- Scales down on mobile automatically
- Hidden during checkout process

### Performance
- Loads asynchronously (won't slow page)
- Uses modern web components
- Minimal impact on page speed

## Next Steps

1. **Test the widget** on your staging environment
2. **Configure your AI assistant** in ElevenLabs dashboard
3. **Train it** with your product information
4. **Monitor conversations** for insights

## Support
- **ElevenLabs Documentation**: https://elevenlabs.io/docs
- **Theme Support**: support@croweossystems.com
- **Agent ID**: `agent_01jz4jgxksfj7v6tkc6f1g7d9y`

---

The ElevenLabs widget is now fully integrated into your Southwest Mushrooms theme, providing an innovative conversational shopping experience that matches your premium glass morphism design! 🍄🎙️✨ 