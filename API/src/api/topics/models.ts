import * as Joi from 'joi';

export const getTopicSchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});

export const postTopicSchema = Joi.object().keys({
  category_id: Joi.number().integer().required(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});

export const putTopicSchema = Joi.object().keys({
  category_id: Joi.number().integer(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});
