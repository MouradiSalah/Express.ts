import { createApplication } from '../src';

const app = createApplication();
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello TypeScript Express!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/users/{id}/{name}', (req, res) => {
  res.json({
    user: {
      id: req.params?.id,
      name: req.params?.name,
    },
  });
});

app.post('/users', (req, res) => {
  res.status(201).json({
    message: 'User created',
    user: req.body,
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
