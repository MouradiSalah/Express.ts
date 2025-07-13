#!/bin/bash

# Check if we're running on a compatible system
if ! command -v sed &> /dev/null; then
    echo "❌ Error: 'sed' command not found. This build process requires a Linux/Unix environment."
    echo "For Windows users, please use WSL, Docker, or a Linux-based CI/CD environment."
    exit 1
fi

# Fix ES module imports in built files
echo "🔧 Fixing ES module imports in dist folder..."

# Function to fix imports in a file
fix_imports() {
    local file="$1"
    echo "  Fixing imports in $file"
    
    # Fix specific import patterns
    sed -i "s/from '\.\/types'/from '\.\/types\/index.js'/g" "$file"
    sed -i "s/from '\.\/utils'/from '\.\/utils\/index.js'/g" "$file"
    sed -i "s/from '\.\/app'/from '\.\/app.js'/g" "$file"
    sed -i "s/from '\.\/express'/from '\.\/express.js'/g" "$file"
    
    # Fix double quotes
    sed -i 's/from "\.\/types"/from "\.\/types\/index.js"/g' "$file"
    sed -i 's/from "\.\/utils"/from "\.\/utils\/index.js"/g' "$file"
    sed -i 's/from "\.\/app"/from "\.\/app.js"/g' "$file"
    sed -i 's/from "\.\/express"/from "\.\/express.js"/g' "$file"
    
    # Fix utility specific imports
    sed -i "s/from '\.\/route-parser'/from '\.\/route-parser.js'/g" "$file"
    sed -i "s/from '\.\/body-parser'/from '\.\/body-parser.js'/g" "$file"
    sed -i 's/from "\.\/route-parser"/from "\.\/route-parser.js"/g' "$file"
    sed -i 's/from "\.\/body-parser"/from "\.\/body-parser.js"/g' "$file"
}

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Please run 'tsc' first."
    exit 1
fi

# Find all .js files in dist and fix them
file_count=0
find dist -name "*.js" -type f | while read file; do
    fix_imports "$file"
    ((file_count++))
done

echo "✅ ES module imports fixed for all JavaScript files!"
echo "📦 Package is ready for both TypeScript and JavaScript consumers!"
