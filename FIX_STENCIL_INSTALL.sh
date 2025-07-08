#!/bin/bash

echo "🔧 Fixing Stencil CLI Installation"
echo "=================================="
echo ""
echo "This will install Node.js v18 (LTS) which is compatible with Stencil CLI"
echo ""

# Install nvm (Node Version Manager) if not installed
if ! command -v nvm &> /dev/null; then
    echo "📦 Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "✅ nvm already installed"
fi

# Install Node.js v18 LTS
echo ""
echo "📦 Installing Node.js v18 LTS..."
nvm install 18
nvm use 18
nvm alias default 18

# Verify Node version
echo ""
echo "🔍 Node.js version:"
node --version

# Install Stencil CLI
echo ""
echo "📦 Installing Stencil CLI..."
npm install -g @bigcommerce/stencil-cli

# Verify Stencil installation
echo ""
echo "✅ Verifying installation..."
stencil --version

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Restart your terminal"
echo "2. Run: stencil push" 