# Contributing to Express.ts

Thank you for your interest in contributing to this TypeScript Express-like server framework!

## Development Environment Requirements

### Prerequisites

- **Node.js 18+**
- **npm 8+**
- **Linux/Unix environment** (required for build process)

### Platform Requirements

**Important**: The build process requires a Linux/Unix environment due to:

- Bash shell scripts (`scripts/fix-esm-imports.sh`)
- `sed` commands for post-build ES module import fixing
- Unix-style file paths and shell commands

#### For Windows Users

If you're on Windows, you have several options:

1. **WSL (Recommended)**: Use Windows Subsystem for Linux

   ```bash
   wsl --install
   # Then clone and work within the WSL environment
   ```

2. **Docker**: Use a Linux container for development

   ```bash
   docker run -it --rm -v $(pwd):/workspace node:18-alpine sh
   ```

3. **GitHub Codespaces**: Use GitHub's online development environment

4. **Dual Boot or VM**: Set up a Linux environment

The CI/CD pipeline runs on Linux, so your changes will be validated in the correct environment during PR reviews.

## Getting Started

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Start development server**: `npm run dev`

## Development Workflow

### Code Quality Standards

This project enforces strict code quality standards through automated tools:

- **TypeScript**: Strict type checking with no `any` types
- **ESLint**: Code linting with TypeScript-specific rules
- **Prettier**: Consistent code formatting
- **Jest**: Comprehensive unit testing

### Pre-commit Hooks

The project uses Husky to run pre-commit hooks that will:

1. **Lint and fix** your code automatically
2. **Format** your code with Prettier
3. **Run tests** before pushing (pre-push hook)

If any of these steps fail, the commit will be rejected. This ensures code quality and prevents broken code from entering the repository.

### Making Changes

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Check build environment**: `npm run build:check`
3. **Make your changes** following the coding standards
4. **Add tests** for any new functionality
5. **Test the build**: `npm run build`
6. **Run the full check**: `npm run check`
7. **Commit your changes**: Use conventional commit messages (see `.gitmessage` template)
8. **Push your branch**: `git push origin feature/your-feature-name`
9. **Create a Pull Request**

### Build Requirements

See the [Build Documentation](docs/BUILD.md) for detailed information about:

- Platform requirements (Linux/Unix)
- Build script dependencies
- Cross-platform development options

Before making changes, ensure your environment is compatible:

```bash
# Check if your environment supports building
npm run build:check

# If successful, you'll see: ✅ Build environment ready (Linux/Unix)
# If failed, see docs/BUILD.md for setup instructions
```

For detailed build environment setup, see [docs/BUILD.md](docs/BUILD.md).

### Commit Message Format

We use conventional commit messages. Use the provided template:

```bash
git config commit.template .gitmessage
```

Examples:

- `feat: add middleware support for request logging`
- `fix: resolve body parsing issue with empty payloads`
- `docs: update API documentation for route parameters`
- `test: add integration tests for HTTP methods`

### Code Style Guidelines

- **2-space indentation**
- **Single quotes** for strings
- **No `any` types** - always provide specific types
- **Include return types** for all functions
- **Use `interface`** instead of `type` when possible
- **Prefer `const`** over `let` when variables aren't reassigned

### Testing Requirements

- **Unit tests** for all new utilities and classes
- **Integration tests** for API endpoints
- **Minimum 90% code coverage** (enforced by CI)
- **All tests must pass** before merging

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run check` - Run lint, format check, and tests
- `npm run build` - Build TypeScript to JavaScript

### CI/CD Pipeline

Pull requests trigger automated checks:

1. **Linting and formatting** validation
2. **Tests** across multiple Node.js versions (18, 20, 22)
3. **TypeScript compilation** check
4. **Security audit** for dependencies
5. **Code coverage** reporting

All checks must pass before a PR can be merged.

### Project Structure

```
src/
├── app.ts              # Main App class
├── express.ts          # Factory function
├── index.ts            # Example server
├── types/              # TypeScript type definitions
│   ├── application/    # Application interface
│   ├── handlers/       # Request/response handlers
│   ├── http/           # HTTP types
│   └── routing/        # Route definitions
└── utils/              # Utility classes
    ├── route-parser.ts # Dynamic route parsing
    └── body-parser.ts  # Request body parsing

tests/                  # Test suites
├── utils/              # Utility tests
└── *.test.ts          # Feature tests
```

### Need Help?

- Check existing [issues](../../issues) and [pull requests](../../pulls)
- Review the test files for examples of how to use the framework
- Look at the example server in `src/index.ts`

## Code of Conduct

- Be respectful and constructive in discussions
- Follow the established coding standards
- Write clear, maintainable code
- Include appropriate tests for your changes
- Update documentation when necessary

Thank you for contributing! 🚀
