import { ResponseToolkit, ResponseObject } from 'hapi__hapi';
import { Boom } from '@hapi/boom';
import * as types from './types';
import { RequestExt } from '../../services/types';
import * as moment from 'moment-timezone';
import { verifyJWT } from '../../services/auth';
export class CategoryController {
  constructor() {}

  async getCategories(request: RequestExt, h: ResponseToolkit): Promise<types.Category[] | Boom> {
    try {
      return request.db().query(
        `SELECT categories.id, categories.favorite, categories.note, categories.name, 
          ARRAY_AGG(JSON_BUILD_OBJECT('id', topics.id, 'category_id', categories.id, 'name', topics.name, 'note', topics.note)) as topics
          FROM categories LEFT JOIN topics ON categories.id = topics.category_id
          WHERE categories.user_id = $1
          GROUP BY categories.id`,
        request.params.userId
      );
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async getCategory(request: RequestExt, h: ResponseToolkit): Promise<types.Category | Boom> {
    try {
      const query = await request
        .db()
        .oneOrNone(
          `SELECT id, favorite, note, name FROM categories WHERE id = $1`,
          request.params.categoryId
        );
      return query;
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async deleteCategory(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      await request
        .db()
        .oneOrNone(`DELETE FROM categories WHERE id = $1 RETURNING id`, [
          request.params.categoryId,
        ]);
      return h.response().code(204);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async deleteAllCategories(
    request: RequestExt,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      await request
        .db()
        .query(`DELETE FROM categories WHERE user_id = $1 RETURNING id`, [request.params.userId]);
      return h.response().code(204);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async addCategory(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const user = (await verifyJWT(request.headers.authorization.split(' ')[1])) as any;
      if (user) {
        const userId = user.id;
        const payload = request.payload as any;
        const categoryId = await request.db().one(
          `INSERT INTO categories (favorite, note, name, last_update, user_id) 
          VALUES ($<favorite>, $<note>, $<name>, $<now>, $<id>)
          RETURNING id`,
          {
            ...payload,
            id: userId,
            now: moment().toISOString(),
          }
        );
        return h.response(categoryId).code(201);
      }
      return request.badRequest();
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async updateCategory(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const categoryId = await request.db().oneOrNone(
        `UPDATE categories 
          SET note = $<note>, name = $<name>, favorite = $<favorite>, last_update = $<now> WHERE id = $<categoryId> RETURNING id`,
        {
          ...(request.payload as {}),
          categoryId: request.params.categoryId,
          now: moment().toISOString(),
        }
      );
      if (categoryId === null) {
        return request.notFound();
      }
      return h.response();
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }
}
