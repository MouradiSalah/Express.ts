import { createApplication } from '../src';

// Create a new Express.ts application
const app = createApplication();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.ts!',
    framework: 'Express.ts',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Route with parameters
app.get('/api/users/{id}', (req, res) => {
  res.json({
    user: {
      id: req.params?.id,
      name: `User ${req.params?.id}`,
    },
  });
});

app.get('/api/users/:id/{name}', (req, res) => {
  res.json({
    user: {
      id: req.params?.id,
      name: req.params?.name,
    },
  });
});

// POST route with body parsing
app.post('/api/users', (req, res) => {
  const userData = req.body;
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: Math.random().toString(36).substr(2, 9),
      ...(typeof userData === 'object' && userData !== null ? userData : {}),
      createdAt: new Date().toISOString(),
    },
  });
});

// Error handling example
app.get('/error', (req, res) => {
  res.status(500).json({
    error: 'This is a sample error endpoint',
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express.ts server running on http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /                  - Welcome message');
  console.log('  GET  /api/users/{id}    - Get user by ID');
  console.log('  POST /api/users         - Create new user');
  console.log('  GET  /error             - Error example');
});
