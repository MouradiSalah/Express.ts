import { RequestHandler, createRouter } from '../src';

// Student Controller - separate module
const studentController = createRouter();

// Student middleware - runs for all student routes
studentController.use((req, res, next) => {
  console.log(`Student route accessed: ${req.method} ${req.url}`);
  next();
});

// Student routes
studentController.get('/', (req, res) => {
  res.json({
    students: [
      { id: 1, name: 'John Doe', grade: 'A' },
      { id: 2, name: 'Jane Smith', grade: 'B' },
    ],
  });
});

studentController.get('/{id}', (req, res) => {
  const id = req.params?.id;
  res.json({
    student: {
      id: id,
      name: `Student ${id}`,
      grade: 'A',
    },
  });
});

studentController.post('/', (req, res) => {
  const studentData = req.body;
  res.status(201).json({
    message: 'Student created successfully',
    student: {
      id: Math.random().toString(36).substr(2, 9),
      ...(typeof studentData === 'object' && studentData !== null
        ? studentData
        : {}),
    },
  });
});

// Admin middleware - only for admin routes
const adminAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};

// Admin controller
const adminController = createRouter();

adminController.use(adminAuth);

adminController.get('/dashboard', (req, res) => {
  res.json({
    message: 'Admin Dashboard',
    stats: {
      totalStudents: 150,
      totalCourses: 25,
    },
  });
});

export { studentController, adminController };
