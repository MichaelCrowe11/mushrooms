# Mobile Navigation & Image Fixes - Testing Guide

## Pre-Testing Setup

1. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear site data in browser developer tools

2. **Enable Mobile View**
   - Open Chrome DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Select a mobile device preset (e.g., iPhone 12 Pro)

3. **Check Console for Errors**
   - Keep DevTools console open during testing
   - Note any JavaScript errors or warnings

## Test Scenarios

### 1. Product Image Rendering Tests

#### Desktop View
- [ ] Navigate to home page
- [ ] Verify all product card images are sharp and clear
- [ ] Hover over product cards - images should NOT blur
- [ ] Check that glass effect is only on card background, not images
- [ ] Inspect element: images should have `filter: none !important`

#### Mobile View
- [ ] Switch to mobile viewport (< 991px)
- [ ] Scroll through product grid
- [ ] Verify images load progressively (lazy loading)
- [ ] Check image quality remains consistent

### 2. Mobile Sidebar Navigation Tests

#### Opening Sidebar
- [ ] Look for floating logo button (bottom-left corner)
- [ ] Tap logo button - sidebar should slide in from left
- [ ] Alternative: Swipe from left edge of screen
- [ ] Verify smooth animation (300ms transition)

#### Sidebar Interaction
- [ ] Check all 6 product widgets are visible
- [ ] Verify widget labels are readable
- [ ] Test scroll if content exceeds viewport height
- [ ] Tap outside sidebar - should close
- [ ] Swipe left on sidebar - should close

#### Touch Gestures
- [ ] Start swipe from leftmost 20px of screen
- [ ] Swipe right at least 50px - sidebar opens
- [ ] With sidebar open, swipe left - sidebar closes
- [ ] Test rapid open/close - should handle gracefully

### 3. Product Widget Navigation Tests

#### Widget Click Behavior
- [ ] Open mobile sidebar
- [ ] Click "Lion's Mane" widget
- [ ] Should navigate to: `/lions-mane-mushroom-capsules/?quick-checkout=true`
- [ ] Verify loading animation appears during navigation

#### Test All Widgets
- [ ] **Lion's Mane**: `/lions-mane-mushroom-capsules/?quick-checkout=true`
- [ ] **Reishi**: `/reishi-mushroom-extract/?quick-checkout=true`
- [ ] **Cordyceps**: `/cordyceps-militaris-capsules/?quick-checkout=true`
- [ ] **Turkey Tail**: `/turkey-tail-mushroom-powder/?quick-checkout=true`
- [ ] **Chaga**: `/chaga-mushroom-tincture/?quick-checkout=true`
- [ ] **Shiitake**: `/shiitake-mushroom-blend/?quick-checkout=true`

### 4. Quick Checkout Feature Tests

#### On Product Page
- [ ] Navigate via widget click (with quick-checkout parameter)
- [ ] Page should auto-scroll to product form
- [ ] Add to Cart button should have pulsing animation
- [ ] Default product options should be pre-selected

#### Cart Addition
- [ ] Click highlighted Add to Cart button
- [ ] Success toast notification should appear
- [ ] Cart count should update
- [ ] Button should show "Added!" temporarily

### 5. Accessibility Tests

#### Keyboard Navigation
- [ ] Tab to logo button and press Enter - sidebar opens
- [ ] Tab through sidebar widgets
- [ ] Press Escape - sidebar closes
- [ ] Focus should return to logo button

#### Screen Reader
- [ ] Enable screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify "Navigation menu opened" announcement
- [ ] Check widget labels are announced correctly
- [ ] Verify "Navigation menu closed" announcement

### 6. Performance Tests

#### Page Load
- [ ] Check Network tab - images should lazy load
- [ ] Verify no layout shifts when images load
- [ ] Check total page weight is reasonable

#### Animation Performance
- [ ] Open Performance profiler
- [ ] Test sidebar open/close animations
- [ ] Should maintain 60fps
- [ ] No jank or stuttering

## Common Issues & Solutions

### Issue: Sidebar won't open
**Solution**: 
- Check if MobileSidebar is initialized in console
- Verify logo button exists in DOM
- Check for JavaScript errors

### Issue: Images still appear blurry
**Solution**:
- Hard refresh the page
- Check CSS is loaded (no 404s in Network tab)
- Inspect image element for conflicting styles

### Issue: Quick checkout not working
**Solution**:
- Verify URL has `?quick-checkout=true` parameter
- Check QuickCheckout module is loaded
- Look for console errors on product page

### Issue: Touch gestures not responsive
**Solution**:
- Ensure testing on actual device or accurate emulation
- Check touch event listeners are attached
- Verify no overlapping elements blocking touch

## Browser-Specific Tests

### iOS Safari
- [ ] Test on actual iPhone if possible
- [ ] Check safe area insets for notched devices
- [ ] Verify smooth momentum scrolling
- [ ] Test in both portrait and landscape

### Android Chrome
- [ ] Test on various Android devices
- [ ] Check performance on mid-range devices
- [ ] Verify touch responsiveness
- [ ] Test with different screen densities

## Regression Tests

### Existing Features
- [ ] Regular navigation still works
- [ ] Desktop experience unchanged
- [ ] Cart functionality intact
- [ ] Search still functions
- [ ] Other JavaScript features work

## Performance Metrics

Target metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Sign-off Checklist

- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Accessibility standards maintained
- [ ] Cross-browser compatibility verified
- [ ] Mobile UX is smooth and intuitive

## Notes Section

Use this space to document any issues found during testing:

```
Date: 
Tester: 
Device/Browser: 
Issues Found: 