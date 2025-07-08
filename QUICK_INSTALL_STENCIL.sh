#!/bin/bash

echo "🚀 Southwest Mushrooms - Stencil CLI Quick Install"
echo "=================================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew already installed"
fi

# Install Node.js
echo ""
echo "📦 Installing Node.js..."
brew install node

# Install Stencil CLI
echo ""
echo "📦 Installing Stencil CLI..."
npm install -g @bigcommerce/stencil-cli

# Verify installations
echo ""
echo "🔍 Verifying installations..."
echo "Node version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "Stencil version: $(stencil --version 2>/dev/null || echo 'Not installed')"

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Next step: Run 'stencil push' to upload your enhanced theme" 