import { config as dotenv } from 'dotenv';
dotenv();

export const config = {
  tokenSecret: process.env.TOKEN_SECRET || '',
  tokenIssuer: 'Ulix API Tijana Jevtic',
  port: '8080',
  saltRounds: 5,
  dbConfig: {
    max: 5,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'localhost',
    port: 5432,
  },
};
