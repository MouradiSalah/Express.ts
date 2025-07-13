import request from 'supertest';
import { createServer } from 'http';
import { createApplication } from '../src/express';

describe('Integration Tests', () => {
  describe('Complete Application Flow', () => {
    it('should handle a complete REST API flow', async () => {
      const app = createApplication();

      // Add middleware
      app.use((req, res, next) => {
        res.setHeader('X-Custom-Header', 'test-value');
        next();
      });

      // Add routes
      app.get('/', (req, res) => {
        res.json({ message: 'Welcome to Express.ts' });
      });

      app.get('/users/{id}', (req, res) => {
        res.json({
          user: {
            id: req.params?.id,
            name: 'Test User',
          },
        });
      });

      app.post('/users', (req, res) => {
        res.status(201).json({
          message: 'User created',
          id: '123',
        });
      });

      const server = createServer((req, res) => {
        app(req, res);
      });

      // Test root endpoint
      await request(server)
        .get('/')
        .expect(200)
        .expect('X-Custom-Header', 'test-value')
        .expect({ message: 'Welcome to Express.ts' });

      // Test parameterized endpoint
      await request(server)
        .get('/users/456')
        .expect(200)
        .expect('X-Custom-Header', 'test-value')
        .expect({ user: { id: '456', name: 'Test User' } });

      // Test POST endpoint
      await request(server)
        .post('/users')
        .expect(201)
        .expect('X-Custom-Header', 'test-value')
        .expect({ message: 'User created', id: '123' });
    });

    it('should handle a complete REST API with body parsing', async () => {
      const app = createApplication();

      // Add global middleware
      app.use((req, res, next) => {
        res.setHeader('X-API-Version', '1.0');
        next();
      });

      // CRUD operations with body parsing
      app.post('/api/users', (req, res) => {
        res.status(201).json({
          message: 'User created successfully',
          user: {
            id: 'generated-id',
            ...(req.body || {}),
            createdAt: new Date().toISOString(),
          },
        });
      });

      app.put('/api/users/{id}', (req, res) => {
        res.json({
          message: 'User updated successfully',
          user: {
            id: req.params?.id,
            ...(req.body || {}),
            updatedAt: new Date().toISOString(),
          },
        });
      });

      app.patch('/api/users/{id}', (req, res) => {
        res.json({
          message: 'User partially updated',
          id: req.params?.id,
          changes: req.body,
          updatedAt: new Date().toISOString(),
        });
      });

      const server = createServer((req, res) => {
        app(req, res);
      });

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      // Test POST with JSON body
      await request(server)
        .post('/api/users')
        .send(userData)
        .expect(201)
        .expect('X-API-Version', '1.0')
        .expect((res) => {
          expect(res.body.message).toBe('User created successfully');
          expect(res.body.user.id).toBe('generated-id');
          expect(res.body.user.name).toBe(userData.name);
          expect(res.body.user.email).toBe(userData.email);
          expect(res.body.user.age).toBe(userData.age);
          expect(res.body.user.createdAt).toBeDefined();
        });

      // Test PUT with JSON body
      const updateData = { name: 'Jane Doe', email: 'jane@example.com' };
      await request(server)
        .put('/api/users/123')
        .send(updateData)
        .expect(200)
        .expect('X-API-Version', '1.0')
        .expect((res) => {
          expect(res.body.message).toBe('User updated successfully');
          expect(res.body.user.id).toBe('123');
          expect(res.body.user.name).toBe(updateData.name);
          expect(res.body.user.email).toBe(updateData.email);
          expect(res.body.user.updatedAt).toBeDefined();
        });

      // Test PATCH with JSON body
      const patchData = { email: 'newemail@example.com' };
      const patchResponse = await request(server)
        .patch('/api/users/456')
        .send(patchData)
        .expect(200)
        .expect('X-API-Version', '1.0');

      expect(patchResponse.body).toMatchObject({
        message: 'User partially updated',
        id: '456',
        changes: patchData,
      });
      expect(patchResponse.body.updatedAt).toEqual(expect.any(String));
    });

    it('should handle complex nested routes with multiple parameters', async () => {
      const app = createApplication();

      app.get(
        '/api/v1/users/{userId}/posts/{postId}/comments/{commentId}',
        (req, res) => {
          res.json({
            userId: req.params?.userId,
            postId: req.params?.postId,
            commentId: req.params?.commentId,
          });
        }
      );

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server)
        .get('/api/v1/users/123/posts/456/comments/789')
        .expect(200)
        .expect({
          userId: '123',
          postId: '456',
          commentId: '789',
        });
    });

    it('should handle query parameters along with route parameters', async () => {
      const app = createApplication();

      app.get('/users/{id}', (req, res) => {
        res.json({
          id: req.params?.id,
          query: req.query,
        });
      });

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server)
        .get('/users/123?include=profile&fields=name,email')
        .expect(200)
        .expect({
          id: '123',
          query: {
            include: 'profile',
            fields: 'name,email',
          },
        });
    });

    it('should handle errors gracefully', async () => {
      const app = createApplication();

      app.use((req, res, next) => {
        if (req.url === '/error') {
          next(new Error('Intentional test error'));
        } else {
          next();
        }
      });

      app.get('/success', (req, res) => {
        res.json({ success: true });
      });

      const server = createServer((req, res) => {
        app(req, res);
      });

      // Test error path
      await request(server)
        .get('/error')
        .expect(500)
        .expect('Intentional test error');

      // Test success path
      await request(server)
        .get('/success')
        .expect(200)
        .expect({ success: true });
    });
  });
});
