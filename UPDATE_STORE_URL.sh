#!/bin/bash

echo "Enter your BigCommerce store hash (from https://store-HASH.mybigcommerce.com):"
read STORE_HASH

if [ -z "$STORE_HASH" ]; then
    echo "Error: Store hash cannot be empty"
    exit 1
fi

# Update the .stencil file with the actual store URL
sed -i '' "s|https://store-hash.mybigcommerce.com|https://store-${STORE_HASH}.mybigcommerce.com|g" .stencil

echo "✅ Updated .stencil with store URL: https://store-${STORE_HASH}.mybigcommerce.com"
echo ""
echo "Next steps:"
echo "1. Install Node.js: brew install node"
echo "2. Install Stencil CLI: npm install -g @bigcommerce/stencil-cli"
echo "3. Push theme: stencil push" 