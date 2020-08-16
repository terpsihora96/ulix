import * as Hapi from '@hapi/hapi';
import { userRoutes } from './routes';

export const init = (server: Hapi.Server) => {
  userRoutes(server);
};
