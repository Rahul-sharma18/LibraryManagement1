/* eslint-disable newline-per-chained-call */
import Joi from 'joi';
import dateFormat from 'dateformat';

const validator = (schema) => async (data) => schema.validateAsync(data);

const accountLoginSchema = Joi.object().keys({
    emailID: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const accountLoginValidator = validator(accountLoginSchema);

const emailSchema = Joi.object().keys({
    emailID: Joi.string().email().required(),
});

export const emailValidator = validator(emailSchema);

const accountSignUpSchema = Joi.object().keys({
    emailID: Joi.string().email().required(),
    password: Joi.string().required(),
    fName: Joi.string().min(1).required(),
    lName: Joi.string().min(1).required(),
    createdAt: Joi.string().isoDate().default(dateFormat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss')),
    updatedAt: Joi.string().isoDate().default(dateFormat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss')),
});
export const accountSignUpValidator = validator(accountSignUpSchema);

const bookSchema = Joi.object().keys({
    title: Joi.string().min(1).required(),
    authorName: Joi.string().min(1).required(),
    subject: Joi.string().min(1).required(),
    availableCopies: Joi.number().required(),
    publishDate: Joi.string().isoDate().default(dateFormat(new Date(), 'UTC:yyyy-mm-dd')),
    createdAt: Joi.string().isoDate().default(dateFormat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss')),
    updatedAt: Joi.string().isoDate().default(dateFormat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss')),
});
export const bookValidator = validator(bookSchema);
