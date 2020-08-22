import * as Hapi from '@hapi/hapi';
import { topicRoutes } from './routes';

export const init = (server: Hapi.Server) => {
  topicRoutes(server);
};
