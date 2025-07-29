import request from 'supertest';
import { createServer } from 'http';
import { createApplication, createRouter } from '../src';

describe('Router', () => {
  describe('Router Creation', () => {
    it('should create a router instance', () => {
      const router = createRouter();
      expect(router).toBeDefined();
      expect(typeof router.get).toBe('function');
      expect(typeof router.post).toBe('function');
      expect(typeof router.put).toBe('function');
      expect(typeof router.delete).toBe('function');
      expect(typeof router.patch).toBe('function');
      expect(typeof router.use).toBe('function');
    });
  });

  describe('Router HTTP Methods', () => {
    it('should support GET routes', () => {
      const router = createRouter();
      const handler = jest.fn();

      router.get('/test', handler);
      const routes = router.getRoutes();

      expect(routes).toHaveLength(1);
      expect(routes[0].method).toBe('GET');
      expect(routes[0].path).toBe('/test');
      expect(routes[0].handler).toBe(handler);
    });

    it('should support all HTTP methods', () => {
      const router = createRouter();
      const handler = jest.fn();

      router.get('/get', handler);
      router.post('/post', handler);
      router.put('/put', handler);
      router.delete('/delete', handler);
      router.patch('/patch', handler);

      const routes = router.getRoutes();
      expect(routes).toHaveLength(5);
      expect(routes.map((r) => r.method)).toEqual([
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
      ]);
    });

    it('should support method chaining', () => {
      const router = createRouter();
      const handler = jest.fn();

      expect(() => {
        router.get('/get', handler).post('/post', handler).put('/put', handler);
      }).not.toThrow();

      expect(router.getRoutes()).toHaveLength(3);
    });
  });

  describe('Router Middleware', () => {
    it('should support middleware', () => {
      const router = createRouter();
      const middleware = jest.fn();

      router.use(middleware);
      const middlewares = router.getMiddlewares();

      expect(middlewares).toHaveLength(1);
      expect(middlewares[0]).toBe(middleware);
    });

    it('should support path-based middleware', () => {
      const router = createRouter();
      const middleware = jest.fn();

      router.use('/api', middleware);
      const middlewares = router.getMiddlewares();

      expect(middlewares).toHaveLength(1);
    });
  });

  describe('Router Integration with App', () => {
    it('should mount router at specific path', async () => {
      const app = createApplication();
      const router = createRouter();

      router.get('/users', (req, res) => {
        res.json({ users: [] });
      });

      router.get('/posts', (req, res) => {
        res.json({ posts: [] });
      });

      app.use('/api', router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      // Test mounted routes
      await request(server).get('/api/users').expect(200).expect({ users: [] });

      await request(server).get('/api/posts').expect(200).expect({ posts: [] });

      // Test non-mounted routes should 404
      await request(server).get('/users').expect(404);
    });

    it('should mount router at root path', async () => {
      const app = createApplication();
      const router = createRouter();

      router.get('/users', (req, res) => {
        res.json({ users: [] });
      });

      app.use(router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server).get('/users').expect(200).expect({ users: [] });
    });

    it('should handle router with middleware', async () => {
      const app = createApplication();
      const router = createRouter();

      router.use((req, res, next) => {
        res.setHeader('X-Router-Middleware', 'executed');
        next();
      });

      router.get('/test', (req, res) => {
        res.json({ success: true });
      });

      app.use('/api', router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server)
        .get('/api/test')
        .expect(200)
        .expect('X-Router-Middleware', 'executed')
        .expect({ success: true });
    });

    it('should handle multiple routers', async () => {
      const app = createApplication();
      const userRouter = createRouter();
      const postRouter = createRouter();

      userRouter.get('/', (req, res) => {
        res.json({ users: [] });
      });

      postRouter.get('/', (req, res) => {
        res.json({ posts: [] });
      });

      app.use('/api/users', userRouter);
      app.use('/api/posts', postRouter);

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server).get('/api/users').expect(200).expect({ users: [] });

      await request(server).get('/api/posts').expect(200).expect({ posts: [] });
    });

    it('should handle router with parameters', async () => {
      const app = createApplication();
      const router = createRouter();

      router.get('/{id}', (req, res) => {
        res.json({ id: req.params?.id });
      });

      app.use('/users', router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server).get('/users/123').expect(200).expect({ id: '123' });
    });

    it('should handle router with POST requests and body parsing', async () => {
      const app = createApplication();
      const router = createRouter();

      router.post('/', (req, res) => {
        res.status(201).json({ created: req.body });
      });

      app.use('/api/users', router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      const userData = { name: 'John', email: 'john@example.com' };

      await request(server)
        .post('/api/users')
        .send(userData)
        .expect(201)
        .expect({ created: userData });
    });

    it('should handle nested middleware execution order', async () => {
      const app = createApplication();
      const router = createRouter();
      const order: string[] = [];

      app.use((req, res, next) => {
        order.push('app-global');
        next();
      });

      app.use('/api', (req, res, next) => {
        order.push('app-api');
        next();
      });

      router.use((req, res, next) => {
        order.push('router-global');
        next();
      });

      router.get('/test', (req, res) => {
        order.push('router-handler');
        res.json({ order });
      });

      app.use('/api', router);

      const server = createServer((req, res) => {
        app(req, res);
      });

      await request(server)
        .get('/api/test')
        .expect(200)
        .expect({
          order: ['app-global', 'app-api', 'router-global', 'router-handler'],
        });
    });
  });

  describe('Error Handling', () => {
    it('should throw error when path is provided without handler', () => {
      const app = createApplication();

      expect(() => {
        // @ts-expect-error - Testing error case
        app.use('/api');
      }).toThrow('Handler is required when path is provided');
    });
  });
});
