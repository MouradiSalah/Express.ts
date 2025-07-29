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
import { Router } from './router';

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

      const route = this.findMatchingRoute(req.method, req.url ?? '');

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

  use(
    pathOrHandler: string | RequestHandler | Router,
    handler?: RequestHandler | Router
  ): void {
    if (typeof pathOrHandler === 'string' && handler instanceof Router) {
      // Mount router at specific path: app.use('/api', router)
      this.mountRouter(pathOrHandler, handler);
    } else if (
      typeof pathOrHandler === 'string' &&
      typeof handler === 'function'
    ) {
      // Mount middleware at specific path: app.use('/api', middleware)
      this.middlewares.push((req, res, next) => {
        const pathname = parse(req.url ?? '').pathname ?? '';
        const normalizedPath = RouteParser.normalizeRoute(pathOrHandler);

        // Special case for root path - should match all routes
        if (normalizedPath === '/') {
          handler(req, res, next);
          return;
        }

        // Support prefix matching like Express.js
        if (
          pathname.startsWith(normalizedPath) &&
          (pathname === normalizedPath ||
            pathname[normalizedPath.length] === '/')
        ) {
          handler(req, res, next);
        } else {
          next();
        }
      });
    } else if (pathOrHandler instanceof Router) {
      // Mount router at root: app.use(router)
      this.mountRouter('/', pathOrHandler);
    } else if (typeof pathOrHandler === 'function') {
      // Global middleware: app.use(middleware)
      this.middlewares.push(pathOrHandler);
    } else if (typeof pathOrHandler === 'string' && !handler) {
      // Handle case where only path is provided without handler - should throw error
      throw new Error('Handler is required when path is provided');
    }
  }

  private mountRouter(basePath: string, router: Router): void {
    const normalizedBasePath = RouteParser.normalizeRoute(basePath);

    // Add router's middleware
    router.getMiddlewares().forEach((middleware) => {
      this.middlewares.push((req, res, next) => {
        const pathname = parse(req.url ?? '').pathname ?? '';

        if (
          normalizedBasePath === '/' ||
          (pathname.startsWith(normalizedBasePath) &&
            (pathname === normalizedBasePath ||
              pathname[normalizedBasePath.length] === '/'))
        ) {
          // Modify req.url to remove the base path for the router
          const originalUrl = req.url;
          if (normalizedBasePath !== '/') {
            req.url = pathname.substring(normalizedBasePath.length) || '/';
            if (req.url && !req.url.startsWith('/')) {
              req.url = '/' + req.url;
            }
          }

          middleware(req, res, (error?: Error) => {
            req.url = originalUrl; // Restore original URL
            next(error);
          });
        } else {
          next();
        }
      });
    });

    // Add router's routes
    router.getRoutes().forEach((route) => {
      const fullPath =
        normalizedBasePath === '/'
          ? route.path
          : normalizedBasePath + route.path;
      this.addRoute(route.method as HttpMethod, fullPath, route.handler);
    });
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
