#!/usr/bin/env bash
set -e

echo "🌍 Adding missing translation keys to all locale files..."

add_key() {
  file="$1"
  key_path="$2"
  value="$3"
  
  # Use jq to add the key if it doesn't exist
  jq --arg key_path "$key_path" --arg value "$value" '
    def set_nested_key(path; value):
      path as $p |
      if ($p | length) == 1 then
        .[$p[0]] = value
      else
        .[$p[0]] = ((.[$p[0]] // {}) | set_nested_key($p[1:]; value))
      end;
    
    set_nested_key($key_path | split("."); $value)
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  
  echo "  ✓ Added $key_path to $(basename "$file")"
}

# Add missing keys to all language files
for file in lang/*.json; do
  if [[ -f "$file" ]]; then
    echo "📝 Processing $(basename "$file")..."
    
    # Add common.skip_to_main if missing
    if ! jq -e '.common.skip_to_main' "$file" >/dev/null 2>&1; then
      add_key "$file" "common.skip_to_main" "Skip to main content"
    fi
    
    # Add products.grid_aria_label if missing
    if ! jq -e '.products.grid_aria_label' "$file" >/dev/null 2>&1; then
      add_key "$file" "products.grid_aria_label" "Product grid listing"
    fi
  fi
done

echo ""
echo "✅ Successfully added missing translation keys to all locale files"
echo "🎯 Next: Run 'npm run build' and 'stencil push' to deploy without warnings"
