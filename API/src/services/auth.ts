import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { config } from '../config/config';

export const generateHash = async (password: string) => {
  return bcrypt.hash(password, config.saltRounds);
};

export async function createJWT(tokenPayload: object, expiresIn = '3h') {
  return jwt.sign(tokenPayload, config.tokenSecret, {
    issuer: config.tokenIssuer,
    algorithm: 'HS256',
    expiresIn,
  });
}

export async function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, config.tokenSecret);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}
