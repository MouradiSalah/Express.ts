import request from 'supertest';
import { App } from '../src/app';
import { createServer } from 'http';

describe('App', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  describe('HTTP Methods', () => {
    it('should handle GET requests', async () => {
      app.get('/test', (req, res) => {
        res.json({ method: 'GET' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/test')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ method: 'GET' });
    });

    it('should handle POST requests', async () => {
      app.post('/test', (req, res) => {
        res.json({ method: 'POST' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .post('/test')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ method: 'POST' });
    });

    it('should handle PUT requests', async () => {
      app.put('/test', (req, res) => {
        res.json({ method: 'PUT' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .put('/test')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ method: 'PUT' });
    });

    it('should handle DELETE requests', async () => {
      app.delete('/test', (req, res) => {
        res.json({ method: 'DELETE' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .delete('/test')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ method: 'DELETE' });
    });

    it('should handle PATCH requests', async () => {
      app.patch('/test', (req, res) => {
        res.json({ method: 'PATCH' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .patch('/test')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ method: 'PATCH' });
    });
  });

  describe('Request Body Parsing', () => {
    it('should parse JSON body in POST requests', async () => {
      app.post('/users', (req, res) => {
        res.status(201).json({
          message: 'User created',
          user: req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      const userData = { name: 'John Doe', email: 'john@example.com', age: 30 };

      await request(server)
        .post('/users')
        .send(userData)
        .expect(201)
        .expect('Content-Type', 'application/json')
        .expect({
          message: 'User created',
          user: userData,
        });
    });

    it('should parse JSON body in PUT requests', async () => {
      app.put('/users/{id}', (req, res) => {
        res.json({
          message: 'User updated',
          id: req.params?.id,
          user: req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      const updateData = { name: 'Jane Doe', email: 'jane@example.com' };

      await request(server)
        .put('/users/123')
        .send(updateData)
        .expect(200)
        .expect({
          message: 'User updated',
          id: '123',
          user: updateData,
        });
    });

    it('should parse JSON body in PATCH requests', async () => {
      app.patch('/users/{id}', (req, res) => {
        res.json({
          message: 'User partially updated',
          id: req.params?.id,
          changes: req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      const patchData = { email: 'newemail@example.com' };

      await request(server)
        .patch('/users/456')
        .send(patchData)
        .expect(200)
        .expect({
          message: 'User partially updated',
          id: '456',
          changes: patchData,
        });
    });

    it('should handle form-encoded data', async () => {
      app.post('/form', (req, res) => {
        res.json({
          message: 'Form data received',
          data: req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .post('/form')
        .type('form')
        .send('name=John&email=john@example.com')
        .expect(200)
        .expect({
          message: 'Form data received',
          data: { name: 'John', email: 'john@example.com' },
        });
    });

    it('should handle empty body gracefully', async () => {
      app.post('/empty', (req, res) => {
        res.json({
          message: 'Empty body received',
          body: req.body,
          bodyType: typeof req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server).post('/empty').expect(200);
    });

    it('should handle invalid JSON gracefully', async () => {
      app.post('/invalid-json', (req, res) => {
        res.json({
          message: 'Request processed',
          body: req.body,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .post('/invalid-json')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(200);
    });
  });

  describe('Route Parameters', () => {
    it('should extract single route parameter', async () => {
      app.get('/users/{id}', (req, res) => {
        res.json({ id: req.params?.id });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server).get('/users/123').expect(200).expect({ id: '123' });
    });

    it('should extract multiple route parameters', async () => {
      app.get('/users/{id}/{name}', (req, res) => {
        res.json({
          id: req.params?.id,
          name: req.params?.name,
        });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/users/123/john')
        .expect(200)
        .expect({ id: '123', name: 'john' });
    });
  });

  describe('Query Parameters', () => {
    it('should extract query parameters', async () => {
      app.get('/search', (req, res) => {
        res.json({ query: req.query });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/search?q=test&limit=10')
        .expect(200)
        .expect({ query: { q: 'test', limit: '10' } });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server).get('/unknown').expect(404).expect('Not Found');
    });
  });

  describe('Response Methods', () => {
    it('should support json response', async () => {
      app.get('/json', (req, res) => {
        res.json({ message: 'Hello JSON' });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/json')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ message: 'Hello JSON' });
    });

    it('should support status method chaining', async () => {
      app.get('/status', (req, res) => {
        res.status(201).json({ created: true });
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/status')
        .expect(201)
        .expect({ created: true });
    });

    it('should support send method', async () => {
      app.get('/text', (req, res) => {
        res.send('Hello Text');
      });

      const server = createServer((req, res) => {
        app.toApplication()(req, res);
      });

      await request(server)
        .get('/text')
        .expect(200)
        .expect('Content-Type', 'text/plain')
        .expect('Hello Text');
    });
  });
});
