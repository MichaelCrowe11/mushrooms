# Stencil CLI Setup Guide

## Your API Credentials (Saved)
- **Client ID**: ix2loqm2x7ou32blh8xn7pgcfioaeih
- **Access Token**: djv3ty5lislrj22kuzx36rvpvupfk1c
- **Client Secret**: 6c03e18ade264600cffa5bf6ed7035c0f18497293427b4a21e1e6e8f3f4476a0

These have been saved to `.stencil` file (excluded from git for security).

## Installation Steps

### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js
```bash
brew install node
```

### 3. Install Stencil CLI
```bash
npm install -g @bigcommerce/stencil-cli
```

### 4. Update Store URL
You need to update the `.stencil` file with your actual store URL:

1. Find your store hash in BigCommerce admin:
   - Go to Settings > API > Store API Accounts
   - Your store hash is in the URL: `https://store-{HASH}.mybigcommerce.com`

2. Edit `.stencil` file and replace:
   ```json
   "normalStoreUrl": "https://store-hash.mybigcommerce.com"
   ```
   with:
   ```json
   "normalStoreUrl": "https://store-YOUR_ACTUAL_HASH.mybigcommerce.com"
   ```

### 5. Bundle and Push Theme
```bash
# Bundle the theme
stencil bundle

# Push to your store
stencil push
```

## Alternative: Direct Upload
If you prefer not to install Node.js/Stencil CLI:

1. Use the already created bundle:
   - `southwest-mushrooms-enhanced-v2.zip`

2. Upload via BigCommerce Admin:
   - Go to Storefront > Themes
   - Click "Upload Theme"
   - Select the zip file

## Troubleshooting

### If bundle fails:
```bash
# Clear cache
rm -rf .stencil-cache
rm -rf node_modules
npm install
```

### If push fails:
- Verify your store URL is correct
- Check that your API token hasn't expired
- Ensure you have the necessary permissions

## Testing Your Theme Locally (Optional)
```bash
# Start local development server
stencil start

# View at: http://localhost:3000
``` 