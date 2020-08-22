import { ResponseToolkit, ResponseObject, Server } from 'hapi__hapi';
import * as Glue from '@hapi/glue';
import { IDatabase } from 'pg-promise';
import * as Boom from '@hapi/boom';

const blipp = require('blipp');

// Config
import { glueManifest } from './config/glueManifest';
import { config } from './config/config';

// API
import * as Users from './api/users';
import * as Topics from './api/topics';

const validate = (credentials: object, req: ResponseObject, h: ResponseToolkit) => {
  return {
    isValid: true,
    credentials,
  };
};

export async function init(database: IDatabase<any>): Promise<Server> {
  try {
    const options = {
      relativeTo: __dirname,
    };

    const server = await Glue.compose(glueManifest, options);

    server.auth.strategy('jwt', 'jwt', {
      key: config.tokenSecret,
      validate,
      verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.default('jwt');

    server.register({ plugin: blipp, options: { showAuth: true } });

    // Decorators
    server.decorate('request', 'db', (): IDatabase<any> => database);
    server.decorate('request', 'notFound', () => Boom.notFound());
    server.decorate('request', 'unauthorized', () => Boom.unauthorized());
    server.decorate('request', 'forbidden', () => Boom.forbidden());
    server.decorate('request', 'internal', () => Boom.internal());
    server.decorate('request', 'badRequest', () => Boom.badRequest());

    console.log('All plugins registered successfully.');

    console.log('Register Routes');

    // INIT COMPONENT
    Users.init(server);
    Topics.init(server);

    console.log('Routes registered sucessfully.');
    return server;
  } catch (err) {
    console.log('Error starting server: ', err);
    throw err;
  }
}
