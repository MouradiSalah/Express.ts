import { RouteParser } from '../../src/utils/route-parser';

describe('RouteParser', () => {
  describe('parseRoute', () => {
    it('should match exact routes without parameters', () => {
      const result = RouteParser.parseRoute('/users', '/users');
      expect(result.isMatch).toBe(true);
      expect(result.params).toEqual({});
    });

    it('should match root route', () => {
      const result = RouteParser.parseRoute('/', '/');
      expect(result.isMatch).toBe(true);
      expect(result.params).toEqual({});
    });

    it('should not match different routes', () => {
      const result = RouteParser.parseRoute('/users', '/posts');
      expect(result.isMatch).toBe(false);
      expect(result.params).toEqual({});
    });

    it('should match routes with single parameter', () => {
      const result = RouteParser.parseRoute('/users/{id}', '/users/123');
      expect(result.isMatch).toBe(true);
      expect(result.params).toEqual({ id: '123' });
    });

    it('should match routes with multiple parameters', () => {
      const result = RouteParser.parseRoute(
        '/users/{id}/{name}',
        '/users/123/john'
      );
      expect(result.isMatch).toBe(true);
      expect(result.params).toEqual({ id: '123', name: 'john' });
    });

    it('should not match routes with different segment count', () => {
      const result = RouteParser.parseRoute('/users/{id}', '/users/123/extra');
      expect(result.isMatch).toBe(false);
      expect(result.params).toEqual({});
    });

    it('should not match routes with different static segments', () => {
      const result = RouteParser.parseRoute('/users/{id}', '/posts/123');
      expect(result.isMatch).toBe(false);
      expect(result.params).toEqual({});
    });

    it('should handle complex nested routes', () => {
      const result = RouteParser.parseRoute(
        '/api/v1/users/{userId}/posts/{postId}',
        '/api/v1/users/456/posts/789'
      );
      expect(result.isMatch).toBe(true);
      expect(result.params).toEqual({ userId: '456', postId: '789' });
    });

    it('should handle empty path segments correctly', () => {
      const result = RouteParser.parseRoute('/users/{id}', '/users/');
      expect(result.isMatch).toBe(false);
      expect(result.params).toEqual({});
    });
  });

  describe('normalizeRoute', () => {
    it('should add leading slash if missing', () => {
      const result = RouteParser.normalizeRoute('users');
      expect(result).toBe('/users');
    });

    it('should remove trailing slash except for root', () => {
      const result = RouteParser.normalizeRoute('/users/');
      expect(result).toBe('/users');
    });

    it('should keep root route as is', () => {
      const result = RouteParser.normalizeRoute('/');
      expect(result).toBe('/');
    });

    it('should handle already normalized routes', () => {
      const result = RouteParser.normalizeRoute('/users/123');
      expect(result).toBe('/users/123');
    });
  });
});
