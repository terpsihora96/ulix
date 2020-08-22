import * as Hapi from '@hapi/hapi';
import { categoryRoutes } from './routes';

export const init = (server: Hapi.Server) => {
  categoryRoutes(server);
};
