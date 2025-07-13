# Package Usage Example

This example shows how to use the Express.ts package after installation.

## Installation

```bash
npm install express.ts
```

## Platform Requirements

**Note**: If you plan to contribute to or build this package from source, you'll need a Linux/Unix environment. However, the compiled package works on all platforms including Windows.

For end users: ✅ Works on Windows, macOS, and Linux
For contributors: ❗ Requires Linux/Unix for building (use WSL on Windows)

## Basic Usage

```typescript
// app.ts
import { createApplication } from 'express.ts';

const app = createApplication();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express.ts!' });
});

app.get('/users/{id}', (req, res) => {
  res.json({ userId: req.params?.id });
});

app.post('/users', (req, res) => {
  res.status(201).json({ user: req.body });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

## Advanced Usage

```typescript
import {
  createApplication,
  RequestHandler,
  ErrorHandler,
  RouteParser,
  BodyParser,
} from 'express.ts';

const app = createApplication();

// Typed middleware
const logger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

const errorHandler: ErrorHandler = (error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Use middleware
app.use(logger);
app.use(errorHandler);

// Complex routes
app.get('/api/v1/users/{userId}/posts/{postId}', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Body parsing example
app.post('/api/data', (req, res) => {
  // req.body is automatically parsed from JSON/form data
  res.json({ received: req.body });
});

app.listen(8080);
```

## TypeScript Benefits

```typescript
import { Request, Response, NextFunction } from 'express.ts';

// Fully typed request handlers
function getUserHandler(req: Request, res: Response, next: NextFunction) {
  const userId = req.params?.id; // Type-safe access

  if (!userId) {
    res.status(400).json({ error: 'User ID required' });
    return;
  }

  // Your logic here
  res.json({ user: { id: userId } });
}

app.get('/users/{id}', getUserHandler);
```
