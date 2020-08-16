import * as Server from './server';
import { db } from './services/dbHelper';

import { IDatabase } from 'pg-promise';

// Define async start function
const start = async (db: IDatabase<any>) => {
  try {
    const server = await Server.init(db);
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error('Error starting server: ', err.message);
    throw err;
  }
};

// Start the server
start(db);
