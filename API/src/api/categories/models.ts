import * as Joi from 'joi';

export const getCategorySchema = Joi.object().keys({
  id: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});

export const postCategorySchema = Joi.object().keys({
  category_id: Joi.number().integer().required(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});

export const putCategorySchema = Joi.object().keys({
  category_id: Joi.number().integer().required(),
  note: Joi.string(),
  name: Joi.string(),
  favorite: Joi.boolean(),
});
