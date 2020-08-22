import { Server } from '@hapi/hapi';
import { TopicController } from './controller';
import * as models from './models';
import * as Joi from 'joi';

export const topicRoutes = (server: Server) => {
  const topicController = new TopicController();
  server.bind(topicController);

  server.route([
    {
      method: 'GET',
      path: '/topics/{topicId}',
      options: {
        handler: topicController.getTopic,
        tags: ['api', 'topics'],
        description: 'Get info for a given topic.',
        validate: {
          params: Joi.object().keys({
            topicId: Joi.number().integer(),
          }),
        },
        auth: false,
        response: {
          sample: 80,
          schema: models.getTopicSchema,
          failAction: 'log',
        },
      },
    },
    {
      method: 'DELETE',
      path: '/topics/{topicId}',
      options: {
        handler: topicController.deleteTopic,
        tags: ['api', 'topics'],
        description: 'Delete given topic.',
        validate: {
          params: Joi.object().keys({
            topicId: Joi.number().integer(),
          }),
        },
        response: { emptyStatusCode: 204 },
      },
    },
    {
      method: 'POST',
      path: '/topics',
      options: {
        handler: topicController.addTopic,
        tags: ['api', 'topics'],
        description: 'Add new topic.',
        auth: false,
        response: {
          status: {
            201: Joi.object().keys({
              id: Joi.number().integer(),
            }),
          },
        },
      },
    },
    {
      method: 'PUT',
      path: '/topics/{topicId}',
      options: {
        handler: topicController.updateTopic,
        tags: ['api', 'topics'],
        description: 'Update given topic.',
        payload: {
          parse: true,
        },
        response: { emptyStatusCode: 204 },
        validate: {
          params: Joi.object().keys({
            topicId: Joi.number().integer().required(),
          }),
          payload: models.putTopicSchema,
        },
      },
    },
  ]);
};
