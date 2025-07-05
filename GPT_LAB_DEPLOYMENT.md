# GPT Lab Deployment Guide

## 🚀 **Quick Setup**

### 1. **Create Web Page in BigCommerce Admin**

1. Go to **Storefront → Web Pages**
2. Click **Add Web Page**
3. Configure:
   - **Page Type**: WYSIWYG content
   - **Name**: Crowe GPT Lab
   - **URL**: `/gpt-lab`
   - **Template File**: `gpt-lab` (select after first save)
4. Save

### 2. **Verify Sidebar Link**

The sidebar already includes the GPT Lab link:
```html
<a href="/gpt-lab" class="nav-link" role="menuitem" aria-label="Access Crowe AI assistant for mushroom cultivation help">
  <span class="nav-icon" aria-hidden="true">🤖</span>Crowe GPT Lab
</a>
```

## 🔧 **Configuration**

### **Environment Variables**

Set these in your hosting environment:

```bash
GPT_API_KEY=your_openai_api_key_here
STORE_HASH=your_bigcommerce_store_hash
CROWELOGIC_URL=https://app.crowelogic.ai
```

### **Security Headers**

Add to your server configuration:

```nginx
# Nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header Content-Security-Policy "frame-src https://app.crowelogic.ai;";

# Apache
Header set X-Frame-Options "SAMEORIGIN"
Header set Content-Security-Policy "frame-src https://app.crowelogic.ai;"
```

## 🧪 **Testing Checklist**

### **Desktop Testing**
- [ ] Iframe loads within 10 seconds
- [ ] Dark mode toggle updates iframe theme
- [ ] Responsive design works at different screen sizes
- [ ] Error fallback displays if iframe fails

### **Mobile Testing**
- [ ] Iframe is 100% width on mobile
- [ ] Touch interactions work properly
- [ ] Keyboard navigation accessible
- [ ] Fallback content is mobile-friendly

### **Security Testing**
- [ ] Only allows iframe from `app.crowelogic.ai`
- [ ] PostMessage origin verification works
- [ ] No XSS vulnerabilities in fallback content
- [ ] API keys are not exposed in client-side code

### **Performance Testing**
- [ ] Iframe loads asynchronously
- [ ] Fallback displays quickly if needed
- [ ] Theme switching is smooth
- [ ] No memory leaks from event listeners

## 🔄 **Troubleshooting**

### **Common Issues**

1. **Iframe Not Loading**
   - Check CORS settings on hosting server
   - Verify `app.crowelogic.ai` is accessible
   - Check browser console for errors

2. **Theme Not Syncing**
   - Verify `data-theme` attribute is set on `<html>`
   - Check iframe URL includes theme parameter
   - Ensure MutationObserver is working

3. **Fallback Not Showing**
   - Check JavaScript console for errors
   - Verify fallback div exists in template
   - Test timeout functionality

### **Debug Mode**

Add this to enable debug logging:

```javascript
// Add to base.html for debugging
window.GPT_DEBUG = true;
```

## 📈 **Analytics & Monitoring**

### **Track Usage**

Add Google Analytics events:

```javascript
// Track GPT Lab visits
gtag('event', 'page_view', {
  page_title: 'GPT Lab',
  page_location: '/gpt-lab'
});

// Track iframe interactions
window.addEventListener('message', function(event) {
  if (event.origin === 'https://app.crowelogic.ai') {
    gtag('event', 'gpt_interaction', {
      event_category: 'AI Assistant',
      event_label: event.data.type
    });
  }
});
```

## 🔮 **Future Enhancements**

### **Phase 2 Features**
- [ ] Modal popup for quick questions
- [ ] Product recommendation integration
- [ ] Chat history persistence
- [ ] Voice input support

### **Phase 3 Features**
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom training data integration
- [ ] API rate limiting

## 📞 **Support**

For technical support:
- **Email**: support@southwestmushrooms.com
- **Documentation**: [GPT Lab API Docs](https://docs.crowelogic.ai)
- **Status Page**: [status.crowelogic.ai](https://status.crowelogic.ai)

---

**Last Updated**: December 2024
**Version**: 1.0.0 