# Southwest Mushrooms - BigCommerce Theme

A premium BigCommerce theme designed specifically for Southwest Mushrooms, featuring modern UI/UX, AI-powered assistance, and comprehensive mushroom cultivation resources.

## 🌟 Features

### **Core Theme Features**
- **Responsive Design**: Mobile-first approach with perfect scaling across all devices
- **Dark Mode Toggle**: Seamless theme switching with localStorage persistence
- **Modern UI/UX**: Premium gradients, animations, and interactive elements
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation

### **AI Integration**
- **Crowe GPT Lab**: AI-powered mushroom cultivation assistant
- **Iframe Integration**: Secure, performant AI chat interface
- **Theme Synchronization**: AI interface adapts to site theme
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### **Content Pages**
- **Video Gallery**: Lazy-loaded YouTube videos with placeholders
- **Facility Tour**: Hero video section on homepage
- **Product Showcase**: Featured products with enhanced styling
- **Testimonials**: Customer reviews and success stories

### **Performance Optimizations**
- **Lazy Loading**: Images and videos load on demand
- **Minified Assets**: Optimized CSS and JavaScript
- **CDN Integration**: Fast content delivery
- **Caching Strategy**: Efficient resource management

## 🚀 Quick Start

### **Prerequisites**
- BigCommerce store with API access
- Node.js (for development)
- Git for version control

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/MichaelCrowe11/mushrooms.git
   cd mushrooms
   ```

2. Install dependencies (if using Stencil CLI):
   ```bash
   npm install
   ```

3. Configure your BigCommerce store settings in `config.json`

4. Upload theme to BigCommerce via admin panel

## 📁 Project Structure

```
mushrooms/
├── assets/
│   ├── scss/           # Stylesheets with modern CSS
│   ├── js/            # JavaScript functionality
│   └── icons/         # SVG icons and assets
├── templates/         # Handlebars templates
│   ├── layout/        # Base layout templates
│   ├── pages/         # Page-specific templates
│   └── components/    # Reusable components
├── config/           # Configuration files
└── docs/            # Documentation
```

## 🎨 Customization

### **Colors & Branding**
The theme uses CSS custom properties for easy customization:
```scss
:root {
  --primary-color: #2d5016;      // Southwest Mushrooms green
  --secondary-color: #8bc34a;    // Light green accent
  --accent-color: #ff8c42;       // Orange highlight
  --dark-bg: #1a1a1a;           // Dark theme background
  --light-bg: #f8f9fa;          // Light theme background
}
```

### **GPT Lab Configuration**
Configure the AI assistant in `config/gpt-security.json`:
```json
{
  "gpt_lab": {
    "iframe_url": "https://app.crowelogic.ai/embed",
    "allowed_origins": ["https://app.crowelogic.ai"],
    "timeout_ms": 10000
  }
}
```

## 🔧 Development

### **Local Development**
1. Install Stencil CLI: `npm install -g @bigcommerce/stencil-cli`
2. Start development server: `stencil start`
3. Watch for changes: `stencil bundle`

### **Building for Production**
```bash
stencil bundle
stencil download
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px - 1440px
- **Large Desktop**: > 1440px

## 🔒 Security

- **CORS Protection**: Restricted iframe origins
- **XSS Prevention**: Sanitized user inputs
- **Content Security Policy**: Frame-src restrictions
- **API Key Management**: Secure environment variables

## 🧪 Testing

### **Browser Testing**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### **Device Testing**
- iPhone (iOS 14+)
- Android (Chrome)
- iPad (Safari)
- Desktop (all major browsers)

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is proprietary to Southwest Mushrooms. All rights reserved.

## 🆘 Support

For technical support or questions:
- **Email**: michael@southwestmushrooms.online
- **Documentation**: See `/docs` folder
- **Issues**: Create an issue on GitHub

---

**Built with ❤️ for Southwest Mushrooms**

*Last updated: December 2024*
