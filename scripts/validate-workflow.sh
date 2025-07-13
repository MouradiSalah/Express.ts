#!/bin/bash

# Express.ts Development Workflow Validation Script
# This script validates that all development tools are working correctly

echo "🔧 Express.ts Development Workflow Validation"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "📦 Installing dependencies..."
npm ci > /dev/null 2>&1
print_status $? "Dependencies installed"

echo ""
echo "🔍 Running ESLint..."
npm run lint > /dev/null 2>&1
print_status $? "ESLint passed"

echo ""
echo "💅 Checking Prettier formatting..."
npm run format:check > /dev/null 2>&1
print_status $? "Code formatting is correct"

echo ""
echo "🧪 Running tests..."
npm test > /dev/null 2>&1
print_status $? "All tests passed"

echo ""
echo "🏗️  Testing TypeScript build..."
npm run build > /dev/null 2>&1
print_status $? "TypeScript compilation successful"

echo ""
echo "🔐 Running security audit..."
npm audit --audit-level=moderate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status 0 "Security audit passed"
else
    print_warning "Security audit found issues - please review"
fi

echo ""
echo "🎯 Testing Git hooks..."
if [ -f ".husky/pre-commit" ]; then
    print_status 0 "Pre-commit hook configured"
else
    echo -e "${RED}❌ Pre-commit hook not found${NC}"
    exit 1
fi

if [ -f ".husky/pre-push" ]; then
    print_status 0 "Pre-push hook configured"
else
    echo -e "${RED}❌ Pre-push hook not found${NC}"
    exit 1
fi

echo ""
echo "📋 Checking project structure..."
required_files=(
    "src/app.ts"
    "src/express.ts" 
    "src/types/index.ts"
    "src/utils/index.ts"
    "tests/app.test.ts"
    "tests/integration.test.ts"
    "package.json"
    "tsconfig.json"
    "jest.config.json"
    ".gitignore"
    "CONTRIBUTING.md"
    "README.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done

echo ""
echo "🚀 Workflow validation complete!"
echo ""
echo "Your development environment is ready!"
echo "Next steps:"
echo "  • Make your changes"
echo "  • Git hooks will automatically:"
echo "    - Lint and format code on commit"
echo "    - Run tests before push"
echo "  • Create a PR to trigger CI/CD pipeline"
echo ""
echo "Happy coding! 🎉"
