import * as Joi from 'joi';

export const getUserSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  firstname: Joi.string().trim().allow(null),
  lastname: Joi.string().trim().allow(null),
  email: Joi.string().required(),
});

export const postUserSchema = Joi.object().keys({
  firstname: Joi.string().trim().allow(null),
  lastname: Joi.string().trim().allow(null),
  email: Joi.string().trim().required(),
});

export const putUserSchema = Joi.object().keys({
  firstname: Joi.string().trim().allow(null),
  lastname: Joi.string().trim().allow(null),
  light_mode: Joi.boolean(),
});

export const updatePasswordSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  new_password: Joi.string().required(),
});
