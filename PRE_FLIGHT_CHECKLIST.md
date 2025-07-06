# 🚁 Pre-Flight Checklist - Southwest Mushrooms Launch

**Status**: ⚡ IMMEDIATE ACTIONS REQUIRED  
**Timeline**: 2-4 hours to launch  
**Current Time**: Ready for final testing  

## 🎯 Phase 1: Final Quality Assurance (90 minutes)

### A. Performance Testing (30 minutes)
```bash
# Run Lighthouse audit on key pages
npm run lighthouse -- https://your-preview-url.bigcommerce.com/
npm run lighthouse -- https://your-preview-url.bigcommerce.com/videos
npm run lighthouse -- https://your-preview-url.bigcommerce.com/gpt-lab
npm run lighthouse -- https://your-preview-url.bigcommerce.com/apps
```

**Expected Results:**
- [ ] Performance Score: >90
- [ ] Accessibility Score: >95
- [ ] Best Practices Score: >90
- [ ] SEO Score: >95

### B. Cross-Browser Testing (45 minutes)

**Desktop Testing:**
- [ ] **Chrome** (latest) - Homepage, product pages, checkout
- [ ] **Safari** (latest) - Navigation, dark mode toggle
- [ ] **Firefox** (latest) - Form submissions, video gallery
- [ ] **Edge** (latest) - Search functionality, responsive design

**Mobile Testing:**
- [ ] **iOS Safari** - Touch interactions, mobile menu
- [ ] **Chrome Mobile** - Performance, load times
- [ ] **Samsung Internet** - Checkout process
- [ ] **Mobile responsiveness** - 320px to 768px widths

### C. Functionality Verification (15 minutes)
- [ ] **Dark Mode Toggle** - Switches themes correctly and persists
- [ ] **Navigation Links** - All sidebar links work with correct URLs
- [ ] **Video Gallery** - YouTube embeds load and play properly
- [ ] **GPT Lab Page** - Content displays correctly
- [ ] **Apps Hub** - All cards and buttons functional
- [ ] **Search Function** - Returns relevant results
- [ ] **Contact Forms** - Submit successfully

## 🎯 Phase 2: BigCommerce Setup (60 minutes)

### A. Theme Upload and Configuration (30 minutes)

**1. Create Theme Bundle:**
```bash
# From your local development environment
stencil bundle
```

**2. Upload to BigCommerce:**
- Login to BigCommerce Admin Panel
- Navigate to `Storefront > My Themes`
- Click "Upload Theme"
- Upload the generated `.zip` file
- Name: "Southwest Mushrooms - Crowe Logic Purple v1.3.0"

**3. Apply to Preview:**
- Select uploaded theme
- Click "Preview" (DO NOT make live yet)
- Note the preview URL for testing

### B. Page Creation (20 minutes)

**Create new pages in BigCommerce Admin:**

1. **Videos Page**
   - URL: `/videos`
   - Template: `pages/videos`
   - Meta Title: "Videos - Southwest Mushrooms"
   - Meta Description: "Watch our collection of educational and promotional videos showcasing Southwest Mushrooms' products and expertise."

2. **GPT Lab Page**
   - URL: `/gpt-lab`
   - Template: `pages/gpt-lab`
   - Meta Title: "GPT Lab - AI Assistant"
   - Meta Description: "Access our AI-powered assistant for instant help with products, orders, and mushroom cultivation advice."

3. **Apps Hub Page**
   - URL: `/apps`
   - Template: `pages/apps`
   - Meta Title: "Apps - Crowe Apps Hub"
   - Meta Description: "Discover our suite of tools and applications designed to enhance your Southwest Mushrooms experience."

### C. Script Manager Setup (10 minutes)

**Configure tracking and analytics:**
- Navigate to `Advanced Settings > Script Manager`
- Upload configuration from `script-manager-config.json`
- Verify Google Analytics tracking code
- Test conversion tracking (if applicable)

## 🎯 Phase 3: Preview Testing (45 minutes)

### A. BigCommerce Preview Validation (30 minutes)

**Using the preview URL, test:**
- [ ] **Homepage** - Loads correctly with purple theme
- [ ] **Navigation** - All sidebar links work
- [ ] **Product Pages** - Display properly with new styling
- [ ] **Shopping Cart** - Add/remove items functionality
- [ ] **Checkout Process** - Complete test transaction
- [ ] **Search Results** - Styling and functionality
- [ ] **Category Pages** - Product listings display correctly

### B. Mobile Preview Testing (15 minutes)
- [ ] **Responsive Design** - All breakpoints work correctly
- [ ] **Touch Interactions** - Buttons and links respond properly
- [ ] **Mobile Menu** - Navigation works on small screens
- [ ] **Performance** - Pages load quickly on mobile

## 🎯 Phase 4: Stakeholder Approval (30 minutes)

### A. Business Review Checklist
**Send preview link to stakeholders with checklist:**
- [ ] **Brand Consistency** - Crowe Logic purple theme approved
- [ ] **Navigation Updates** - All links point to correct destinations
- [ ] **New Pages** - Videos, GPT Lab, and Apps hub meet requirements
- [ ] **Professional Appearance** - Meets industry standards
- [ ] **User Experience** - Intuitive and accessible design
- [ ] **Mobile Experience** - Optimized for all devices

### B. Final Approval Sign-offs
- [ ] **Technical Lead**: [NAME] - Theme functionality approved
- [ ] **Marketing Lead**: [NAME] - Brand representation approved  
- [ ] **Business Owner**: [NAME] - Overall implementation approved
- [ ] **Project Manager**: [NAME] - Timeline and delivery approved

## 🎯 Phase 5: Launch Execution (15 minutes)

### A. Pre-Launch Actions (5 minutes)
- [ ] **Backup Current Theme** - Download current live theme
- [ ] **Clear CDN Cache** - Prepare for immediate propagation
- [ ] **Notify Team** - Alert all stakeholders of go-live
- [ ] **Monitor Setup** - Ensure error tracking is active

### B. Go-Live Process (5 minutes)
1. **Apply Theme**: In BigCommerce admin, change from Preview to Live
2. **Clear Caches**: Purge all CDN and browser caches
3. **Verify Homepage**: Confirm new theme is live
4. **Test Critical Path**: Quick checkout and search test

### C. Immediate Post-Launch (5 minutes)
- [ ] **Homepage Check** - Loads with new theme
- [ ] **Navigation Test** - Key links functional
- [ ] **Mobile Check** - Responsive design working
- [ ] **Error Monitoring** - No critical JavaScript errors
- [ ] **Analytics Verification** - Tracking data collecting

## 🚨 Emergency Contacts

**If issues arise during launch:**
- **BigCommerce Support**: 1-888-248-9325
- **Technical Issues**: Document in detail for rollback decision
- **Business Critical**: Immediate rollback to previous theme

## ✅ Success Criteria

**Launch is successful when:**
- [ ] Homepage loads correctly with purple theme
- [ ] All navigation links work properly
- [ ] New pages (Videos, GPT Lab, Apps) are accessible
- [ ] Mobile experience is fully functional
- [ ] No critical errors in console or error logs
- [ ] Analytics tracking is working
- [ ] Stakeholders confirm satisfaction

## 📊 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Final QA Testing | 90 min | ⏳ Pending |
| BigCommerce Setup | 60 min | ⏳ Pending |
| Preview Testing | 45 min | ⏳ Pending |
| Stakeholder Approval | 30 min | ⏳ Pending |
| Launch Execution | 15 min | ⏳ Pending |
| **Total Time** | **4 hours** | **Ready to Start** |

---

**Next Action**: Begin Phase 1 - Final Quality Assurance Testing  
**Expected Launch Time**: 4 hours from start  
**Status**: 🟢 **READY TO PROCEED**
