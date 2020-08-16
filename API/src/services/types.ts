import { Request } from 'hapi__hapi';
import { Boom } from '@hapi/boom';
import { IDatabase } from 'pg-promise';

export interface RequestExt extends Request {
  db(): IDatabase<any>;
  notFound(): Boom<string>;
  unauthorized(): Boom<string>;
  forbidden(): Boom<string>;
  internal(): Boom<string>;
  badRequest(): Boom<string>;
}
