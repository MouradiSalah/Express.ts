import { IncomingMessage, ServerResponse } from 'http';

export interface Request extends IncomingMessage {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
  url: string;
  method: string;
}

export interface Response extends ServerResponse {
  json(data: unknown): void;
  status(code: number): Response;
  send(data: string): void;
}

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD';
