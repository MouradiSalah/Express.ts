import { createApplication } from '../src/express';
import { Application } from '../src/types';

describe('express factory', () => {
  describe('createApplication', () => {
    it('should create an application instance', () => {
      const app = createApplication();
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should create application with HTTP method functions', () => {
      const app = createApplication();
      expect(typeof app.get).toBe('function');
      expect(typeof app.post).toBe('function');
      expect(typeof app.put).toBe('function');
      expect(typeof app.delete).toBe('function');
      expect(typeof app.patch).toBe('function');
      expect(typeof app.use).toBe('function');
      expect(typeof app.listen).toBe('function');
    });

    it('should allow method chaining', () => {
      const app = createApplication();

      expect(() => {
        app
          .get('/test1', (req, res) => res.json({}))
          .post('/test2', (req, res) => res.json({}));
      }).not.toThrow();
    });

    it('should maintain Application interface contract', () => {
      const app: Application = createApplication();

      // Should be callable as a function
      expect(typeof app).toBe('function');

      // Should have all required methods
      expect(app.get).toBeDefined();
      expect(app.post).toBeDefined();
      expect(app.put).toBeDefined();
      expect(app.delete).toBeDefined();
      expect(app.patch).toBeDefined();
      expect(app.use).toBeDefined();
      expect(app.listen).toBeDefined();
    });
  });
});
