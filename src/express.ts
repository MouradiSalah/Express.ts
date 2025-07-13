import { Application } from './types';
import { App } from './app';

export function createApplication(): Application {
  return new App().toApplication();
}
