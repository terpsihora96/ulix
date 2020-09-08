import { ResponseToolkit, ResponseObject } from 'hapi__hapi';
import { Boom } from '@hapi/boom';
import * as types from './types';
import { RequestExt } from '../../services/types';
import * as moment from 'moment-timezone';

export class CategoryController {
  constructor() {}

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
      const payload = request.payload as any;
      const categoryId = await request.db().one(
        `INSERT INTO categories (favorite, note, name, last_update) 
          VALUES ($<favorite>, $<note>, $<name>, $<now>)
          RETURNING id`,
        {
          ...payload,
          now: moment().toISOString(),
        }
      );
      return h.response(categoryId).code(201);
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
