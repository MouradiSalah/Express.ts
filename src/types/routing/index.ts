import { HttpMethod } from '../http';
import { RequestHandler } from '../handlers';

export interface Route {
  method: HttpMethod;
  path: string;
  handler: RequestHandler;
}
