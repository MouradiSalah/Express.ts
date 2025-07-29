import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from '../handlers';

export interface IRouter {
  get(path: string, handler: RequestHandler): IRouter;
  post(path: string, handler: RequestHandler): IRouter;
  put(path: string, handler: RequestHandler): IRouter;
  delete(path: string, handler: RequestHandler): IRouter;
  patch(path: string, handler: RequestHandler): IRouter;
  use(handler: RequestHandler): void;
  use(path: string, handler: RequestHandler): void;
}

export interface Application {
  (req: IncomingMessage, res: ServerResponse): void;
  get(path: string, handler: RequestHandler): Application;
  post(path: string, handler: RequestHandler): Application;
  put(path: string, handler: RequestHandler): Application;
  delete(path: string, handler: RequestHandler): Application;
  patch(path: string, handler: RequestHandler): Application;
  use(handler: RequestHandler): Application;
  use(path: string, handler: RequestHandler): Application;
  use(router: IRouter): Application;
  use(path: string, router: IRouter): Application;
  listen(port: number, callback?: () => void): void;
}
