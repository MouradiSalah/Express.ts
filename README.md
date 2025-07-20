# Express.ts

A TypeScript-first, Express-like HTTP server framework with modern features and comprehensive testing.

[![CI/CD Pipeline](https://github.com/MouradiSalah/express.ts/actions/workflows/ci.yml/badge.svg)](https://github.com/MouradiSalah/express.ts/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Features

- 🚀 **TypeScript-first** with strict type safety
- 🛣️ **Dynamic route parameters** with `{param}` and `:param` syntax
- 📦 **Built-in body parsing** (JSON, form-encoded, raw)
- 🔧 **Middleware support** with error handling
- 🧪 **Comprehensive test suite** (57 tests, 100% coverage)
- ⚡ **Express-like API** for familiar development experience
- 🏗️ **Modular architecture** with clean separation of concerns

## Requirements

- **Node.js** 18.0.0 or higher
- **Linux/Unix environment** for building from source (uses bash scripts and sed commands)
- **TypeScript** 5.8+ (for development)

## Quick Start

## Installation

Install from npm (recommended):

```bash
npm install @mouradisalah/express.ts
```

Or install from GitHub Packages (requires authentication):

```bash
npm install @mouradisalah/express.ts --registry=https://npm.pkg.github.com
```

---

## Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/MouradiSalah/express.ts.git
cd express.ts
npm install
npm run build:check
npm run build
npm run dev
npm test
```

## Usage

```typescript
// Import for npm usage:
import { createApplication } from '@mouradisalah/express.ts';

// Import for local development (if cloned):
// import { createApplication } from './express';

const app = createApplication();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes with parameters (supports both {param} and :param)
app.get('/users/{id}', (req, res) => {
  res.json({ userId: req.params?.id });
});

app.get('/users/:id/:name', (req, res) => {
  res.json({
    id: req.params?.id,
    name: req.params?.name,
  });
});

// POST with body parsing
app.post('/users', (req, res) => {
  res.status(201).json({
    message: 'User created',
    user: req.body,
  });
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

## API Reference

### Application Methods

- `app.get(path, handler)` - Handle GET requests
- `app.post(path, handler)` - Handle POST requests
- `app.put(path, handler)` - Handle PUT requests
- `app.patch(path, handler)` - Handle PATCH requests
- `app.delete(path, handler)` - Handle DELETE requests
- `app.use(middleware)` - Add middleware
- `app.listen(port, callback)` - Start server

### Route Parameters

You can use either `{param}` or `:param` syntax for dynamic routes:

```typescript
// Both of these are valid and equivalent:
app.get('/users/{id}/posts/{postId}', (req, res) => {
  const id = req.params?.id;
  const postId = req.params?.postId;
  // Handle request
});

app.get('/users/:id/posts/:postId', (req, res) => {
  const id = req.params?.id;
  const postId = req.params?.postId;
  // Handle request
});
```

### Body Parsing

Automatic body parsing for POST/PUT/PATCH requests:

```typescript
app.post('/api/data', (req, res) => {
  // req.body contains parsed JSON, form data, or raw text
  console.log(req.body);
});
```

### Middleware

```typescript
// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Development

### Prerequisites

- Node.js 18+
- npm 8+
- **Linux/Unix environment** (required for build process)

### Build Requirements

**Important**: The build process requires a Linux/Unix environment due to:

- Bash shell scripts for ES module import fixing
- `sed` commands for post-build processing
- Unix-style file paths in build scripts

For Windows users:

- Use WSL (Windows Subsystem for Linux)
- Use Docker with a Linux container
- Use GitHub Actions or other Linux-based CI/CD for building

### Setup

```bash
# Install dependencies
npm install

# Set up Git hooks (automatic code quality checks)
npm run prepare
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run check` - Run lint, format check, and tests

### Code Quality

This project enforces strict code quality standards:

- **Pre-commit hooks** automatically lint and format code
- **Pre-push hooks** run the full test suite
- **GitHub Actions** validate all PRs with comprehensive CI/CD pipeline
- **TypeScript strict mode** with no `any` types allowed
- **Jest testing** with high coverage requirements

## Architecture

```
src/
├── app.ts              # Main App class with HTTP methods
├── express.ts          # Factory function for Express-like API
├── index.ts            # Example server implementation
├── types/              # TypeScript type definitions
│   ├── application/    # Application interface
│   ├── handlers/       # Request/response handlers
│   ├── http/           # HTTP method and message types
│   └── routing/        # Route interface definitions
└── utils/              # Core utilities
    ├── route-parser.ts # Dynamic route parsing with {param} syntax
    └── body-parser.ts  # Request body parsing (JSON/form/raw)
```

## Testing

The project includes comprehensive test coverage:

- **Unit tests** for all utilities and core classes
- **Integration tests** for complete API workflows
- **Type validation tests** for TypeScript interfaces
- **Error handling tests** for edge cases

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=app.test.ts
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes (hooks will validate code quality)
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Commit Message Format

Use conventional commits with the provided template:

```bash
git config commit.template .gitmessage
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Express.js but built with TypeScript-first principles
- Uses modern Node.js features and best practices
- Comprehensive testing approach inspired by industry standards
