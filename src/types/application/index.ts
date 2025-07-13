import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from '../handlers';

export interface Application {
  (req: IncomingMessage, res: ServerResponse): void;
  get(path: string, handler: RequestHandler): Application;
  post(path: string, handler: RequestHandler): Application;
  put(path: string, handler: RequestHandler): Application;
  delete(path: string, handler: RequestHandler): Application;
  patch(path: string, handler: RequestHandler): Application;
  use(handler: RequestHandler): Application;
  use(path: string, handler: RequestHandler): Application;
  listen(port: number, callback?: () => void): void;
}
