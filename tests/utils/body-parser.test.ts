import { BodyParser } from '../../src/utils/body-parser';
import { IncomingMessage } from 'http';
import { Readable } from 'stream';

describe('BodyParser', () => {
  const createMockRequest = (
    data: string,
    contentType: string = 'application/json'
  ): IncomingMessage => {
    const readable = new Readable();
    readable.push(data);
    readable.push(null);

    const mockReq = readable as unknown as IncomingMessage;
    mockReq.headers = { 'content-type': contentType };
    return mockReq;
  };

  describe('parseBody', () => {
    it('should parse JSON data correctly', async () => {
      const jsonData = { name: 'John', age: 30 };
      const mockReq = createMockRequest(
        JSON.stringify(jsonData),
        'application/json'
      );

      const result = await BodyParser.parseBody(mockReq);

      expect(result.json).toEqual(jsonData);
      expect(result.raw).toBe(JSON.stringify(jsonData));
    });

    it('should parse form-encoded data correctly', async () => {
      const formData = 'name=John&age=30&email=john%40example.com';
      const mockReq = createMockRequest(
        formData,
        'application/x-www-form-urlencoded'
      );

      const result = await BodyParser.parseBody(mockReq);

      expect(result.form).toEqual({
        name: 'John',
        age: '30',
        email: 'john@example.com',
      });
      expect(result.raw).toBe(formData);
    });

    it('should handle text content as raw', async () => {
      const textData = 'Hello, World!';
      const mockReq = createMockRequest(textData, 'text/plain');

      const result = await BodyParser.parseBody(mockReq);

      expect(result.raw).toBe(textData);
      expect(result.json).toBeUndefined();
      expect(result.form).toBeUndefined();
    });

    it('should handle empty body', async () => {
      const mockReq = createMockRequest('', 'application/json');

      const result = await BodyParser.parseBody(mockReq);

      expect(result.raw).toBe('');
      expect(result.json).toBeUndefined();
    });

    it('should handle invalid JSON gracefully', async () => {
      const invalidJson = '{ invalid json }';
      const mockReq = createMockRequest(invalidJson, 'application/json');

      const result = await BodyParser.parseBody(mockReq);

      expect(result.raw).toBe(invalidJson);
      expect(result.json).toBeUndefined();
    });

    it('should handle large content-type headers', async () => {
      const jsonData = { test: 'data' };
      const mockReq = createMockRequest(
        JSON.stringify(jsonData),
        'application/json; charset=utf-8'
      );

      const result = await BodyParser.parseBody(mockReq);

      expect(result.json).toEqual(jsonData);
    });

    it('should handle missing content-type header', async () => {
      const textData = 'Some text data';
      const readable = new Readable();
      readable.push(textData);
      readable.push(null);

      const mockReq = readable as unknown as IncomingMessage;
      mockReq.headers = {};

      const result = await BodyParser.parseBody(mockReq);

      expect(result.raw).toBe(textData);
      expect(result.json).toBeUndefined();
      expect(result.form).toBeUndefined();
    });

    it('should handle malformed form data', async () => {
      const malformedData = 'name=John&invalid&email=test';
      const mockReq = createMockRequest(
        malformedData,
        'application/x-www-form-urlencoded'
      );

      const result = await BodyParser.parseBody(mockReq);

      expect(result.form).toEqual({
        name: 'John',
        email: 'test',
      });
      expect(result.raw).toBe(malformedData);
    });
  });
});
