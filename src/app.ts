import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import { parse } from 'url';
import {
  Application,
  HttpMethod,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Route,
} from './types';
import { BodyParser, RouteParser } from './utils';

export class App {
  private routes: Route[] = [];
  private middlewares: RequestHandler[] = [];

  private enhanceResponse(res: Response): void {
    res.json = function (data: unknown): void {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    res.status = function (code: number): Response {
      res.statusCode = code;
      return res;
    };

    res.send = function (data: string): void {
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    };
  }

  private async enhanceRequest(
    req: Request,
    matchedRoute?: Route
  ): Promise<void> {
    const parsedUrl = parse(req.url ?? '', true);
    req.query = parsedUrl.query as Record<string, string>;

    // Parse request body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method ?? '')) {
      try {
        const parsedBody = await BodyParser.parseBody(req);
        req.body = parsedBody.json || parsedBody.form || parsedBody.raw;
      } catch (error) {
        console.error('Error parsing request body:', error);
        req.body = undefined;
      }
    }

    if (matchedRoute) {
      const routeMatch = RouteParser.parseRoute(
        matchedRoute.path,
        parsedUrl.pathname ?? ''
      );
      req.params = routeMatch.params;
    } else {
      req.params = {};
    }
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    this.enhanceResponse(res);

    let middlewareIndex = 0;

    const nextFunction: NextFunction = async (error?: Error) => {
      if (error) {
        res.statusCode = 500;
        res.end(error.message);
        return;
      }

      if (middlewareIndex < this.middlewares.length) {
        const middleware = this.middlewares[middlewareIndex++];
        middleware(req, res, nextFunction);
        return;
      }

      const route = this.findMatchingRoute(
        req.method as HttpMethod,
        req.url ?? ''
      );

      if (route) {
        await this.enhanceRequest(req, route);
        route.handler(req, res, nextFunction);
      } else {
        await this.enhanceRequest(req);
        res.statusCode = 404;
        res.end('Not Found');
      }
    };

    await nextFunction();
  }

  private findMatchingRoute(
    method: HttpMethod,
    url: string
  ): Route | undefined {
    const parsedUrl = parse(url);
    const pathname = parsedUrl.pathname ?? '';

    return this.routes.find((route) => {
      if (route.method !== method) return false;
      const routeMatch = RouteParser.parseRoute(route.path, pathname);
      return routeMatch.isMatch;
    });
  }

  private addRoute(
    method: HttpMethod,
    path: string,
    handler: RequestHandler
  ): void {
    this.routes.push({ method, path, handler });
  }

  get(path: string, handler: RequestHandler): this {
    this.addRoute('GET', path, handler);
    return this;
  }

  post(path: string, handler: RequestHandler): this {
    this.addRoute('POST', path, handler);
    return this;
  }

  put(path: string, handler: RequestHandler): this {
    this.addRoute('PUT', path, handler);
    return this;
  }

  delete(path: string, handler: RequestHandler): this {
    this.addRoute('DELETE', path, handler);
    return this;
  }

  patch(path: string, handler: RequestHandler): this {
    this.addRoute('PATCH', path, handler);
    return this;
  }

  use(pathOrHandler: string | RequestHandler, handler?: RequestHandler): void {
    if (typeof pathOrHandler === 'string' && handler) {
      this.middlewares.push((req, res, next) => {
        const pathname = parse(req.url ?? '').pathname ?? '';
        if (pathname === pathOrHandler) {
          handler(req, res, next);
        } else {
          next();
        }
      });
    } else if (typeof pathOrHandler === 'function') {
      this.middlewares.push(pathOrHandler);
    }
  }

  listen(port: number, callback?: () => void): void {
    const server: Server = createServer((req, res) => {
      this.handleRequest(req as Request, res as Response);
    });
    server.listen(port, callback);
  }

  toApplication(): Application {
    const app = ((req: IncomingMessage, res: ServerResponse): void => {
      this.handleRequest(req as Request, res as Response);
    }) as Application;

    app.get = (path: string, handler: RequestHandler) => {
      this.get(path, handler);
      return app;
    };

    app.post = (path: string, handler: RequestHandler) => {
      this.post(path, handler);
      return app;
    };

    app.put = (path: string, handler: RequestHandler) => {
      this.put(path, handler);
      return app;
    };

    app.delete = (path: string, handler: RequestHandler) => {
      this.delete(path, handler);
      return app;
    };

    app.patch = (path: string, handler: RequestHandler) => {
      this.patch(path, handler);
      return app;
    };

    app.use = ((
      pathOrHandler: string | RequestHandler,
      handler?: RequestHandler
    ) => {
      this.use(pathOrHandler, handler);
      return app;
    }) as Application['use'];

    app.listen = this.listen.bind(this);

    return app;
  }
}
