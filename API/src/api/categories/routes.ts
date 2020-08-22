import { Server } from '@hapi/hapi';
import { CategoryController } from './controller';
import * as models from './models';
import * as Joi from 'joi';

export const categoryRoutes = (server: Server) => {
  const categoryController = new CategoryController();
  server.bind(categoryController);

  server.route([
    {
      method: 'GET',
      path: '/categories/{categoryId}',
      options: {
        handler: categoryController.getCategory,
        tags: ['api', 'categories'],
        description: 'Get info for a given category.',
        validate: {
          params: Joi.object().keys({
            categoryId: Joi.number().integer(),
          }),
        },
        auth: false,
        response: {
          sample: 80,
          schema: models.getCategorySchema,
          failAction: 'log',
        },
      },
    },
    {
      method: 'DELETE',
      path: '/categories/{categoryId}',
      options: {
        handler: categoryController.deleteCategory,
        tags: ['api', 'categories'],
        description: 'Delete given category.',
        validate: {
          params: Joi.object().keys({
            categoryId: Joi.number().integer(),
          }),
        },
        response: { emptyStatusCode: 204 },
      },
    },
    {
      method: 'POST',
      path: '/categories',
      options: {
        handler: categoryController.addCategory,
        tags: ['api', 'categories'],
        description: 'Add new category.',
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
      path: '/categories/{categoryId}',
      options: {
        handler: categoryController.updateCategory,
        tags: ['api', 'categories'],
        description: 'Update given category.',
        payload: {
          parse: true,
        },
        response: { emptyStatusCode: 204 },
        validate: {
          params: Joi.object().keys({
            categoryId: Joi.number().integer().required(),
          }),
          payload: models.putCategorySchema,
        },
      },
    },
  ]);
};
