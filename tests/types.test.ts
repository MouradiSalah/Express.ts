import {
  Application,
  ErrorHandler,
  HttpMethod,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Route,
} from '../src/types';

describe('Type Definitions', () => {
  describe('HttpMethod', () => {
    it('should accept valid HTTP methods', () => {
      const validMethods: HttpMethod[] = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS',
        'HEAD',
      ];

      validMethods.forEach((method) => {
        expect(typeof method).toBe('string');
      });
    });
  });

  describe('Request Interface', () => {
    it('should extend IncomingMessage with additional properties', () => {
      const mockRequest = {
        url: '/test',
        method: 'GET',
        params: { id: '123' },
        query: { limit: '10' },
        body: { name: 'test' },
      } as unknown as Request;

      expect(mockRequest.url).toBe('/test');
      expect(mockRequest.method).toBe('GET');
      expect(mockRequest.params).toEqual({ id: '123' });
      expect(mockRequest.query).toEqual({ limit: '10' });
      expect(mockRequest.body).toEqual({ name: 'test' });
    });
  });

  describe('Response Interface', () => {
    it('should have required response methods', () => {
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      expect(typeof mockResponse.json).toBe('function');
      expect(typeof mockResponse.status).toBe('function');
      expect(typeof mockResponse.send).toBe('function');
    });
  });

  describe('RequestHandler Type', () => {
    it('should accept valid request handler functions', () => {
      const handler: RequestHandler = (_req, res, _next) => {
        res.json({ success: true });
      };

      expect(typeof handler).toBe('function');
      expect(handler.length).toBe(3); // req, res, next parameters
    });

    it('should accept async request handler functions', () => {
      const asyncHandler: RequestHandler = async (_req, res, _next) => {
        await Promise.resolve();
        res.json({ success: true });
      };

      expect(typeof asyncHandler).toBe('function');
    });
  });

  describe('ErrorHandler Type', () => {
    it('should accept error handler functions', () => {
      const errorHandler: ErrorHandler = (error, _req, res, _next) => {
        res.status(500).json({ error: error.message });
      };

      expect(typeof errorHandler).toBe('function');
      expect(errorHandler.length).toBe(4); // error, req, res, next parameters
    });
  });

  describe('Route Interface', () => {
    it('should define route structure correctly', () => {
      const route: Route = {
        method: 'GET',
        path: '/users/{id}',
        handler: (req, res, _next) => {
          res.json({ id: req.params?.id });
        },
      };

      expect(route.method).toBe('GET');
      expect(route.path).toBe('/users/{id}');
      expect(typeof route.handler).toBe('function');
    });
  });

  describe('Application Interface', () => {
    it('should define application interface correctly', () => {
      const mockApp = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        use: jest.fn(),
        listen: jest.fn(),
      } as unknown as Application;

      expect(typeof mockApp.get).toBe('function');
      expect(typeof mockApp.post).toBe('function');
      expect(typeof mockApp.put).toBe('function');
      expect(typeof mockApp.delete).toBe('function');
      expect(typeof mockApp.patch).toBe('function');
      expect(typeof mockApp.use).toBe('function');
      expect(typeof mockApp.listen).toBe('function');
    });
  });

  describe('NextFunction Type', () => {
    it('should accept next function with optional error', () => {
      const next: NextFunction = (error?: Error) => {
        if (error) {
          console.error('Error:', error.message);
        }
      };

      expect(typeof next).toBe('function');

      // Test calling without error
      expect(() => next()).not.toThrow();

      // Test calling with error
      expect(() => next(new Error('test'))).not.toThrow();
    });
  });
});
