import { ResponseToolkit, ResponseObject } from 'hapi__hapi';
import { Boom } from '@hapi/boom';
import * as types from './types';
import { RequestExt } from '../../services/types';
import * as moment from 'moment-timezone';

export class TopicController {
  constructor() {}

  async getTopic(request: RequestExt, h: ResponseToolkit): Promise<types.Topic | Boom> {
    try {
      const query = await request
        .db()
        .oneOrNone(
          `SELECT id, category_id, note, name, favorite FROM topics WHERE id = $1`,
          request.params.topicId
        );
      return query;
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async deleteTopic(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      await request
        .db()
        .oneOrNone(`DELETE FROM topics WHERE id = $1 RETURNING id`, [request.params.topicId]);
      return h.response().code(204);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async addTopic(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const payload = request.payload as types.Topic;
      const topicId = await request.db().one(
        `INSERT INTO topics (category_id, note, name, favorite) 
          VALUES ($<category_id>, $<note>, $<name>, $<favorite>)
          RETURNING id`,
        { ...payload }
      );
      return h.response(topicId).code(201);
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }

  async updateTopic(request: RequestExt, h: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const topicId = await request.db().oneOrNone(
        `UPDATE topics 
          SET category_id = $<category_id>, note = $<note>, name = $<name>, favorite = $<favorite>, last_update = $<now> 
          WHERE id = $<topicId> RETURNING id`,
        {
          ...(request.payload as {}),
          topicId: request.params.topicId,
          now: moment().toISOString(),
        }
      );
      if (topicId === null) {
        return request.notFound();
      }
      return h.response();
    } catch (err) {
      console.error(err);
      return request.internal();
    }
  }
}
