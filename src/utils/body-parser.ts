import { IncomingMessage } from 'http';

export interface ParsedBody {
  raw: string;
  json?: unknown;
  form?: Record<string, string>;
}

export class BodyParser {
  static async parseBody(req: IncomingMessage): Promise<ParsedBody> {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const contentType = req.headers['content-type'] || '';
        const result: ParsedBody = { raw: body };

        try {
          if (contentType.includes('application/json')) {
            if (body.trim()) {
              try {
                result.json = JSON.parse(body);
              } catch {
                // Invalid JSON - leave result.json as undefined
                // The raw body is still available in result.raw
              }
            }
            // For empty body, result.json remains undefined
          } else if (
            contentType.includes('application/x-www-form-urlencoded')
          ) {
            result.form = this.parseFormData(body);
          }

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', (error) => {
        reject(error);
      });
    });
  }

  private static parseFormData(body: string): Record<string, string> {
    const params = new URLSearchParams(body);
    const result: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      result[key] = decodeURIComponent(value);
    }

    return result;
  }

  static getContentLength(req: IncomingMessage): number {
    const contentLength = req.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : 0;
  }

  static getContentType(req: IncomingMessage): string {
    return req.headers['content-type'] || '';
  }
}
