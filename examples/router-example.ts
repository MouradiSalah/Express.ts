import { createApplication } from '../src';
import { adminController, studentController } from './controllers';

// Create main application
const app = createApplication();

// Global middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routers at specific paths
app.use('/api/students', studentController);
app.use('/api/admin', adminController);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.ts Router Example!',
    endpoints: {
      students: '/api/students',
      admin: '/api/admin',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 Express.ts Router Example running on http://localhost:${PORT}`
  );
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /                     - Welcome message');
  console.log('  GET  /health               - Health check');
  console.log('  GET  /api/students         - List all students');
  console.log('  GET  /api/students/{id}    - Get student by ID');
  console.log('  POST /api/students         - Create new student');
  console.log('  GET  /api/admin/dashboard  - Admin dashboard (requires auth)');
  console.log('');
  console.log('Try these commands:');
  console.log('  curl http://localhost:3000/api/students');
  console.log('  curl http://localhost:3000/api/students/123');
  console.log(
    '  curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d \'{"name":"Alice","grade":"A"}\''
  );
  console.log(
    '  curl http://localhost:3000/api/admin/dashboard -H "Authorization: Bearer admin-token"'
  );
});
