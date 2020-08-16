import { Server } from '@hapi/hapi';
import { UserController } from './controller';
import * as models from './models';
import * as Joi from 'joi';

export const userRoutes = (server: Server) => {
  const userController = new UserController();
  server.bind(userController);

  server.route([
    {
      method: 'GET',
      path: '/users/{userId}',
      options: {
        handler: userController.getUser,
        tags: ['api', 'users'],
        description: 'Get info for a given user.',
        validate: {
          params: Joi.object().keys({
            userId: Joi.number().integer(),
          }),
        },
        auth: false,
        response: {
          sample: 80,
          schema: models.getUserSchema,
          failAction: 'log',
        },
      },
    },
    {
      method: 'DELETE',
      path: '/users/{userId}',
      options: {
        handler: userController.deleteUser,
        tags: ['api', 'users'],
        description: 'Delete given user.',
        validate: {
          params: Joi.object().keys({
            userId: Joi.number().integer(),
          }),
        },
        response: { emptyStatusCode: 204 },
      },
    },
    {
      method: 'POST',
      path: '/users',
      options: {
        handler: userController.addUser,
        tags: ['api', 'users'],
        description: 'Add new user.',
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
      path: '/users/{userId}',
      options: {
        handler: userController.updateUser,
        tags: ['api', 'users'],
        description: 'Update given user.',
        payload: {
          parse: true,
        },
        response: { emptyStatusCode: 204 },
        validate: {
          params: Joi.object().keys({
            userId: Joi.number().integer().required(),
          }),
          payload: models.putUserSchema,
        },
      },
    },
    {
      method: 'POST',
      path: '/login',
      options: {
        handler: userController.login,
        auth: false,
        tags: ['api', 'authentication'],
        description: 'Login route.',
        validate: {
          payload: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().base64().required(),
          }),
        },
        response: {
          status: {
            200: Joi.object().keys({
              access_token: Joi.string(),
              refresh_token: Joi.string(),
            }),
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/new-token',
      options: {
        handler: userController.getNewAccessToken,
        auth: false,
        tags: ['api', 'authentication'],
        description: 'Get new access token.',
        validate: {
          payload: Joi.object()
            .keys({
              email: Joi.string().email().required(),
              refresh_token: Joi.string().required(),
            })
            .unknown(false),
        },
        response: {
          status: {
            200: Joi.object().keys({
              access_token: Joi.string(),
              refresh_token: Joi.string(),
            }),
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/users/update-password',
      options: {
        handler: userController.updatePassword,
        tags: ['api', 'authentication'],
        description: "Update user's password.",
        payload: {
          parse: true,
        },
        response: { emptyStatusCode: 204 },
        validate: {
          payload: models.updatePasswordSchema,
        },
      },
    },
  ]);
};
