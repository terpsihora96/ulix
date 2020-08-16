import * as pgPromise from 'pg-promise';
import { config } from '../config/config';

const dbConfig = config.dbConfig;
// Initializing the library:
const pgp: pgPromise.IMain = pgPromise();
const db: pgPromise.IDatabase<any> = pgp(
  `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
);

export { db, pgp };
