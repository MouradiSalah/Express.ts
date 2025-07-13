# Express.ts API Documentation

This document provides comprehensive API documentation for the Express.ts framework.

## Installation

```bash
npm install express.ts
```

## Quick Start

```typescript
import { createApplication } from 'express.ts';

const app = createApplication();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## API Reference

### Core Functions

#### `createApplication(): Application`

Creates a new Express.ts application instance.

**Returns:** An `Application` instance with all HTTP methods and middleware support.

**Example:**

```typescript
import { createApplication } from 'express.ts';

const app = createApplication();
```

### Application Methods

#### HTTP Methods

All HTTP methods support route parameters using `{param}` syntax and automatic body parsing.

##### `app.get(path: string, handler: RequestHandler): Application`

Register a GET route handler.

**Parameters:**

- `path`: Route path (supports `{param}` syntax)
- `handler`: Function to handle the request

**Example:**

```typescript
app.get('/users/{id}', (req, res) => {
  const userId = req.params?.id;
  res.json({ userId });
});
```

##### `app.post(path: string, handler: RequestHandler): Application`

Register a POST route handler with automatic body parsing.

**Example:**

```typescript
app.post('/users', (req, res) => {
  const userData = req.body; // Automatically parsed JSON/form data
  res.status(201).json({ user: userData });
});
```

##### `app.put(path: string, handler: RequestHandler): Application`

##### `app.patch(path: string, handler: RequestHandler): Application`

##### `app.delete(path: string, handler: RequestHandler): Application`

Similar to POST, these methods support automatic body parsing.

#### Middleware

##### `app.use(middleware: RequestHandler): Application`

Add middleware to the application.

**Example:**

```typescript
// Logging middleware
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

#### Server

##### `app.listen(port: number, callback?: () => void): void`

Start the HTTP server.

**Parameters:**

- `port`: Port number to listen on
- `callback`: Optional callback function called when server starts

**Example:**

```typescript
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

### Types

#### `Request`

Extended Node.js `IncomingMessage` with additional properties:

```typescript
interface Request extends IncomingMessage {
  params?: Record<string, string>; // Route parameters
  body?: unknown; // Parsed request body
}
```

#### `Response`

Extended Node.js `ServerResponse` with convenience methods:

```typescript
interface Response extends ServerResponse {
  json(data: unknown): void;
  status(code: number): Response;
}
```

#### `RequestHandler`

Function signature for request handlers:

```typescript
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
```

#### `NextFunction`

Function to pass control to the next middleware:

```typescript
type NextFunction = (error?: Error) => void;
```

### Utilities

#### `RouteParser`

Utility class for parsing dynamic routes.

##### `RouteParser.parseRoute(pattern: string, path: string): Record<string, string> | null`

Parse route parameters from a URL path.

**Example:**

```typescript
import { RouteParser } from 'express.ts';

const params = RouteParser.parseRoute('/users/{id}', '/users/123');
// Returns: { id: '123' }
```

#### `BodyParser`

Utility class for parsing request bodies.

##### `BodyParser.parseBody(req: IncomingMessage): Promise<ParsedBody>`

Parse request body with support for JSON, form-encoded, and raw data.

**Returns:** `ParsedBody` object with parsed content.

```typescript
interface ParsedBody {
  raw: string; // Raw body content
  json?: unknown; // Parsed JSON (if content-type is application/json)
  form?: Record<string, string>; // Parsed form data (if content-type is application/x-www-form-urlencoded)
}
```

## Advanced Usage

### Route Parameters

Use `{param}` syntax for dynamic route segments:

```typescript
app.get('/api/users/{userId}/posts/{postId}', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

### Body Parsing

Automatic body parsing for POST, PUT, and PATCH requests:

```typescript
app.post('/api/data', (req, res) => {
  // req.body contains:
  // - Parsed JSON if Content-Type: application/json
  // - Parsed form data if Content-Type: application/x-www-form-urlencoded
  // - Raw string for other content types

  console.log('Body:', req.body);
  res.json({ received: req.body });
});
```

### Error Handling

Implement error handling middleware:

```typescript
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
});
```

### Method Chaining

All application methods return the application instance for chaining:

```typescript
createApplication()
  .use(loggingMiddleware)
  .get('/', homeHandler)
  .post('/users', createUserHandler)
  .listen(3000, () => console.log('Server started'));
```

## Examples

See the `/examples` directory for complete usage examples:

- `basic-usage.ts` - Basic server setup
- `server.ts` - Complete example server

## TypeScript Support

Express.ts is built with TypeScript-first principles:

- **Strict typing** with no `any` types
- **Full IntelliSense** support
- **Type-safe** request handlers and middleware
- **Comprehensive** type definitions included
