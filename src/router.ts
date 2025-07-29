import { IRouter, RequestHandler } from './types';
import { RouteParser } from './utils';
import { parse } from 'url';

export interface RouterRoute {
  method: string;
  path: string;
  handler: RequestHandler;
}

export class Router implements IRouter {
  private routes: RouterRoute[] = [];
  private middlewares: RequestHandler[] = [];

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
        const normalizedPath = RouteParser.normalizeRoute(pathOrHandler);

        if (normalizedPath === '/') {
          handler(req, res, next);
          return;
        }

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
    } else if (typeof pathOrHandler === 'function') {
      this.middlewares.push(pathOrHandler);
    }
  }

  private addRoute(
    method: string,
    path: string,
    handler: RequestHandler
  ): void {
    this.routes.push({ method, path, handler });
  }

  getRoutes(): RouterRoute[] {
    return [...this.routes];
  }

  getMiddlewares(): RequestHandler[] {
    return [...this.middlewares];
  }
}

export function createRouter(): Router {
  return new Router();
}
