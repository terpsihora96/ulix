import { config } from '../config/config';
import { docOpts } from '../config/doc';
import * as Boom from '@hapi/boom';

// Types
import { Request, ResponseToolkit } from '@hapi/hapi';
import { Manifest } from '@hapi/glue';

export const glueManifest: Manifest = {
  server: {
    port: config.port,
    routes: {
      files: {
        relativeTo: __dirname,
      },
      cors: true,
      validate: {
        failAction: async (request: Request, h: ResponseToolkit, err) => {
          console.log(request.payload);
          console.warn(err);
          throw Boom.badRequest(`Invalid request payload input`, err);
        },
      },
      response: {
        failAction: async (req: Request, h: ResponseToolkit, err) => {
          console.error(err);
          throw err;
        },
      },
    },
    debug: {
      log: ['error', 'debug'],
    },
  },
  register: {
    plugins: [
      {
        plugin: '@hapi/vision',
      },
      {
        plugin: '@hapi/inert',
      },
      {
        plugin: 'hapi-auth-jwt2',
      },
      {
        plugin: 'hapi-swagger',
        options: docOpts,
      },
    ],
  },
};
