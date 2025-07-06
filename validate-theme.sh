#!/bin/bash

# Southwest Mushrooms Theme - Comprehensive Testing & Validation Script
# Run this script before deployment to ensure everything is working correctly

echo "🚀 Starting Southwest Mushrooms Theme Validation..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

# 1. Check Node.js and npm versions
echo -e "\n${BLUE}📋 Checking System Requirements...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
    if [[ "$NODE_VERSION" =~ ^v1[6-9]\.|^v[2-9][0-9]\. ]]; then
        print_status 0 "Node.js version is compatible"
    else
        print_status 1 "Node.js version may be incompatible (requires v16+)"
    fi
else
    print_status 1 "Node.js is not installed"
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_info "npm version: $NPM_VERSION"
    print_status 0 "npm is available"
else
    print_status 1 "npm is not installed"
fi

# 2. Check if all dependencies are installed
echo -e "\n${BLUE}📦 Checking Dependencies...${NC}"
if [ -f "package.json" ]; then
    print_status 0 "package.json found"
    
    if [ -d "node_modules" ]; then
        print_status 0 "node_modules directory exists"
    else
        print_warning "node_modules not found, running npm install..."
        npm install
        if [ $? -eq 0 ]; then
            print_status 0 "Dependencies installed successfully"
        else
            print_status 1 "Failed to install dependencies"
        fi
    fi
else
    print_status 1 "package.json not found"
fi

# 3. Validate critical files
echo -e "\n${BLUE}📄 Validating Critical Files...${NC}"

# Check for essential theme files
critical_files=(
    "assets/js/theme/common/product-details.js"
    "assets/js/theme/cart.js"
    "assets/js/theme/global/advanced-analytics.js"
    "assets/scss/theme.scss"
    "templates/layout/base.html"
    "webpack.prod.js"
    "performance-optimization.js"
    "sw.js"
    "offline.html"
    "site.webmanifest"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Found $file"
    else
        print_status 1 "Missing $file"
    fi
done

# 4. Run linting
echo -e "\n${BLUE}🧹 Running Code Quality Checks...${NC}"

# ESLint
if command_exists npx && [ -f ".eslintrc.json" ]; then
    echo "Running ESLint..."
    npx eslint assets/js --ext .js --max-warnings 10 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status 0 "ESLint passed (≤10 warnings)"
    else
        print_warning "ESLint found issues (check manually)"
    fi
else
    print_warning "ESLint not configured or not available"
fi

# 5. Build validation
echo -e "\n${BLUE}🔨 Testing Build Process...${NC}"

if [ -f "webpack.prod.js" ]; then
    print_info "Running production build..."
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status 0 "Production build completed successfully"
        
        # Check if dist files were created
        if [ -d "assets/dist" ] && [ "$(ls -A assets/dist)" ]; then
            print_status 0 "Build artifacts created in assets/dist"
            
            # Check for main bundle files
            if [ -f "assets/dist/theme-bundle.main.js" ]; then
                print_status 0 "Main bundle file created"
            else
                print_status 1 "Main bundle file not found"
            fi
        else
            print_status 1 "No build artifacts found"
        fi
    else
        print_status 1 "Production build failed"
    fi
else
    print_status 1 "webpack.prod.js not found"
fi

# 6. Check SCSS compilation
echo -e "\n${BLUE}🎨 Testing SCSS Compilation...${NC}"
if command_exists sass; then
    sass assets/scss/theme.scss --no-source-map --style compressed > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status 0 "SCSS compiles without errors"
    else
        print_status 1 "SCSS compilation failed"
    fi
else
    print_warning "Sass compiler not available for direct testing"
fi

# 7. Validate JSON files
echo -e "\n${BLUE}📋 Validating JSON Configuration...${NC}"

json_files=(
    "package.json"
    "site.webmanifest"
    "config.json"
    ".eslintrc.json"
)

for file in "${json_files[@]}"; do
    if [ -f "$file" ]; then
        if command_exists jq; then
            jq empty "$file" > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                print_status 0 "$file is valid JSON"
            else
                print_status 1 "$file contains invalid JSON"
            fi
        else
            # Fallback JSON validation
            node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                print_status 0 "$file is valid JSON"
            else
                print_status 1 "$file contains invalid JSON"
            fi
        fi
    fi
done

# 8. Check for accessibility features
echo -e "\n${BLUE}♿ Checking Accessibility Features...${NC}"

# Check for ARIA labels and accessibility attributes in templates
aria_checks=(
    "aria-label"
    "role="
    "aria-describedby"
    "aria-expanded"
)

for check in "${aria_checks[@]}"; do
    if grep -r "$check" templates/ > /dev/null 2>&1; then
        print_status 0 "Found $check attributes in templates"
    else
        print_warning "No $check attributes found (manual review recommended)"
    fi
done

# 9. Performance checks
echo -e "\n${BLUE}⚡ Performance Validation...${NC}"

# Check if performance optimization script exists and has key features
if [ -f "performance-optimization.js" ]; then
    key_features=(
        "IntersectionObserver"
        "preload"
        "prefetch"
        "serviceWorker"
    )
    
    for feature in "${key_features[@]}"; do
        if grep -q "$feature" performance-optimization.js; then
            print_status 0 "Performance script includes $feature optimization"
        else
            print_warning "Performance script missing $feature optimization"
        fi
    done
fi

# 10. PWA features check
echo -e "\n${BLUE}📱 PWA Features Validation...${NC}"

if [ -f "sw.js" ]; then
    print_status 0 "Service Worker file exists"
    
    # Check for key service worker features
    sw_features=(
        "caches"
        "fetch"
        "install"
        "activate"
    )
    
    for feature in "${sw_features[@]}"; do
        if grep -q "$feature" sw.js; then
            print_status 0 "Service Worker includes $feature functionality"
        else
            print_warning "Service Worker missing $feature functionality"
        fi
    done
else
    print_status 1 "Service Worker file not found"
fi

if [ -f "site.webmanifest" ]; then
    print_status 0 "Web App Manifest exists"
else
    print_status 1 "Web App Manifest not found"
fi

# 11. Security checks
echo -e "\n${BLUE}🔒 Basic Security Validation...${NC}"

# Check for common security issues
if grep -r "eval(" assets/js/ > /dev/null 2>&1; then
    print_status 1 "Found potentially unsafe eval() usage"
else
    print_status 0 "No eval() usage found"
fi

if grep -r "innerHTML.*\+" assets/js/ > /dev/null 2>&1; then
    print_warning "Found potential XSS risk with innerHTML concatenation"
else
    print_status 0 "No obvious innerHTML concatenation risks found"
fi

# 12. Analytics validation
echo -e "\n${BLUE}📊 Analytics Configuration Check...${NC}"

if [ -f "assets/js/theme/global/advanced-analytics.js" ]; then
    analytics_features=(
        "trackProductView"
        "trackAddToCart"
        "trackPurchase"
        "trackPerformanceMetrics"
    )
    
    for feature in "${analytics_features[@]}"; do
        if grep -q "$feature" assets/js/theme/global/advanced-analytics.js; then
            print_status 0 "Analytics includes $feature tracking"
        else
            print_status 1 "Analytics missing $feature tracking"
        fi
    done
else
    print_status 1 "Advanced analytics file not found"
fi

# Summary
echo -e "\n${BLUE}📊 VALIDATION SUMMARY${NC}"
echo "=============================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo -e "Success Rate: ${SUCCESS_RATE}%"

if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "\n${GREEN}🎉 EXCELLENT! Theme is ready for deployment.${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 75 ]; then
    echo -e "\n${YELLOW}⚠️  GOOD. Minor issues found, review warnings.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ NEEDS WORK. Please fix critical issues before deployment.${NC}"
    exit 1
fi
