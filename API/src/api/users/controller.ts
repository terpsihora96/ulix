import { ResponseToolkit, ResponseObject } from 'hapi__hapi';
import { Boom } from '@hapi/boom';
import * as types from './types';
import { RequestExt } from '../../services/types';
import * as moment from 'moment-timezone';
import * as bcrypt from 'bcrypt';
import { createJWT, generateHash, verifyJWT } from '../../services/auth';
import { TokenGenerator } from 'ts-token-generator';

export class UserController {
  constructor() {}

  async getUser(request: RequestExt, h: ResponseToolkit): Promise<types.User | Boom> {
    try {
      const query = await request
        .db()
        .oneOrNone(
          `SELECT firstname,  lastname, email FROM users WHERE id = $1`,
          request.params.userId
        );
      return query;
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async deleteUser(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      await request
        .db()
        .oneOrNone(`DELETE FROM users WHERE id = $1 RETURNING email`, [request.params.userId]);
      return h.response().code(204);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async addUser(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const payload = request.payload as any;
      const decodedPassword = Buffer.from(payload.password, 'base64').toString('utf-8');
      const hashPassword = await generateHash(decodedPassword);

      const userId = await request.db().one(
        `INSERT INTO users (firstname,  lastname, email, last_update, password, refresh_token, last_login) 
          VALUES ($<firstname>, $<lastname>, $<email>, $<last>, $<hashedPassword>, $<refresh_token>, $<last>)
          RETURNING id`,
        {
          ...payload,
          refresh_token: await createJWT({ payload: new TokenGenerator().generate() }, '7d'),
          hashedPassword: hashPassword,
          last: moment().toISOString(),
        }
      );
      return h.response(userId).code(201);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async updateUser(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const user = await request.db().oneOrNone(
        `UPDATE users 
          SET firstname = $<firstname>, lastname = $<lastname>, light_mode = $<light_mode>, last_update = $<last_update>
          WHERE id = $<userId> RETURNING id`,
        {
          ...(request.payload as {}),
          userId: request.params.userId,
          last_update: moment().toISOString(),
        }
      );
      if (user === null) {
        return request.notFound();
      }
      return h.response();
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async login(request: RequestExt, h: ResponseToolkit): Promise<types.Token | Boom> {
    try {
      const payload = request.payload as types.Auth;
      const decodedPassword = Buffer.from(payload.password, 'base64').toString('utf-8');
      const tokenPayload = await request.db().task(async t => {
        const userData = await t.oneOrNone(
          `SELECT id, email, password, firstname, lastname FROM users WHERE email = $1`,
          [payload.email]
        );
        if (userData === null) throw request.notFound();
        if (!(await bcrypt.compare(decodedPassword, userData.password))) {
          throw request.unauthorized();
        }
        await t.none(`UPDATE users SET last_login = $1 WHERE id = $2`, [
          moment().toISOString(),
          userData.id,
        ]);
        return {
          id: userData.id,
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
        };
      });
      const refreshToken = await createJWT({ payload: new TokenGenerator().generate() }, '7d');
      await request
        .db()
        .none(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [refreshToken, tokenPayload.id]);
      const token = await createJWT(tokenPayload);
      return { access_token: token, refresh_token: refreshToken };
    } catch (error) {
      console.error(error);
      return request.internal();
    }
  }

  async getNewAccessToken(request: RequestExt, h: ResponseToolkit): Promise<types.Token | Boom> {
    try {
      const payload = request.payload as types.NewToken;
      const userData = await request
        .db()
        .one(
          `SELECT refresh_token, id, email, password, firstname, lastname FROM users WHERE email = $1`,
          [payload.email]
        );
      const decodedRefreshToken = (await verifyJWT(
        payload.refresh_token
      )) as types.DecodedRefreshToken;
      if (decodedRefreshToken === null) {
        await request
          .db()
          .none(`UPDATE users SET refresh_token = null WHERE email = $1`, [payload.email]);
        return request.unauthorized();
      }
      if (payload.refresh_token === userData.refresh_token) {
        const tokenPayload = {
          id: userData.id,
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
        };
        const newAccessToken = await createJWT(tokenPayload);
        return { access_token: newAccessToken, refresh_token: payload.refresh_token };
      }
      return request.unauthorized();
    } catch (error) {
      console.error(error);
      return request.internal();
    }
  }

  async updatePassword(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      await request.db().task(async (t: any) => {
        const payload = request.payload as types.UpdatePassword;
        const userData = await t.oneOrNone(`SELECT id, password FROM users WHERE email = $1`, [
          payload.email,
        ]);
        if (!userData) return request.notFound();
        const decodedPassword = Buffer.from(payload.password, 'base64').toString('utf-8');
        if (!(await bcrypt.compare(decodedPassword, userData.password))) {
          throw request.unauthorized();
        }
        const decodedNewPassword = Buffer.from(payload.new_password, 'base64').toString('utf-8');
        const hashNewPassword = await generateHash(decodedNewPassword || '');
        await t.none(`UPDATE users SET last_update = $1, password = $2 WHERE id = $3`, [
          moment().toISOString(),
          hashNewPassword,
          userData.id,
        ]);
        return null;
      });
      return h.response();
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }
}
