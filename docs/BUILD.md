# Build Environment Documentation

Express.ts requires a **Linux/Unix environment** for building from source. This document explains why and provides solutions for different platforms.

## Platform Requirements

### Required Environment

- **Linux/Unix** (Ubuntu, macOS, Alpine, etc.)
- **Bash shell** version 4.0+
- **sed** command-line utility
- **Node.js** 18.0.0+

### Environment Check

```bash
npm run build:check
```

## Why Linux/Unix is Required

1. **Bash Scripts**: The build process uses `scripts/fix-esm-imports.sh` which requires bash
2. **sed Commands**: Post-build processing uses `sed` for ES module import fixing
3. **Unix File Paths**: Build scripts assume Unix-style path separators

## Build Process Details

The build consists of two steps:

```bash
# 1. TypeScript compilation
tsc

# 2. ES module import fixing
bash scripts/fix-esm-imports.sh
```

The second step adds `.js` extensions to import statements for Node.js ES module compatibility.

### Before ES Module Fixing:

```javascript
export { App } from './app';
export { RouteParser } from './utils';
```

### After ES Module Fixing:

```javascript
export { App } from './app.js';
export { RouteParser } from './utils/index.js';
```

## Cross-Platform Solutions

### For Windows Users

#### Option 1: WSL (Recommended)

```bash
# Install WSL
wsl --install

# Clone in WSL environment
wsl
git clone https://github.com/yourusername/express.ts.git
cd express.ts
npm install
npm run build
```

#### Option 2: Docker

```bash
# Use Node.js Alpine container (Windows)
docker run -it --rm -v "%cd%":/workspace -w /workspace node:18-alpine sh

# Use Node.js Alpine container (PowerShell)
docker run -it --rm -v "${PWD}:/workspace" -w /workspace node:18-alpine sh

# Inside container:
npm install
npm run build
```

#### Option 3: GitHub Codespaces

Use GitHub's online development environment which runs on Linux automatically.

#### Option 4: CI/CD Only

Develop on Windows but use GitHub Actions or other Linux-based CI/CD for building and publishing.

### For macOS Users

macOS has a Unix environment and should work without issues:

```bash
npm run build:check  # Should show ✅
npm run build        # Should complete successfully
```

## Build Artifacts

The build generates these files in `dist/`:

```
dist/
├── index.js              # Main entry point (ES modules)
├── index.d.ts           # TypeScript declarations
├── app.js               # Core App class
├── express.js           # Factory function
├── types/               # Type definitions
│   ├── index.js
│   └── *.d.ts
└── utils/               # Utility modules
    ├── index.js
    ├── body-parser.js
    └── route-parser.js
```

## Package Consumption (End Users)

**Important**: End users installing from npm don't need Linux/Unix. The build requirement only applies to:

- **Contributors** building from source
- **Maintainers** publishing to npm
- **Developers** forking the repository

### End User Installation (Any Platform)

```bash
# Works on Windows, macOS, Linux
npm install express.ts

# Import and use (works everywhere)
import { createApplication } from 'express.ts';
```

## Troubleshooting

### Common Build Issues

**"bash: command not found" on Windows:**

- Solution: Use WSL, Docker, or GitHub Codespaces

**"sed: command not found":**

- Install GNU sed or use a Linux environment

**Permission denied errors:**

```bash
chmod +x scripts/fix-esm-imports.sh
```

**ES module import errors after build:**

- Verify the post-build script ran successfully
- Check that `.js` extensions are present in dist files

### Verifying Build Success

After building, test the package:

```bash
# Test TypeScript imports
npx tsx -e "import { createApplication } from './dist/index.js'; console.log('✅ Import works');"

# Test JavaScript imports
node -e "import('./dist/index.js').then(() => console.log('✅ ES modules work'));"
```

## CI/CD Pipeline

The GitHub Actions workflow runs on `ubuntu-latest`, ensuring all builds use the required Linux environment:

```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest # ✅ Linux environment
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build # ✅ Works in CI
      - run: npm test
```

This ensures that all code merged into the main branch builds successfully in the required environment.
