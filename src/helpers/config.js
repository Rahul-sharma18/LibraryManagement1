import Joi from 'joi';
import { config } from 'dotenv';
config();
import VError from 'verror';

import { logger } from './logger.js';

const response = Joi.object({
    DYNAMODB_ACCESS_KEY: Joi.string().required().label('DynamoDB Access Key'),
    DYNAMODB_SECRET_KEY: Joi.string().required().label('DynamoDB Secret Key'),
    DYNAMODB_REGION: Joi.string().required().label('DynamoDB Region'),
}).validate(process.env, {
    stripUnknown: true,
    convert: true,
});

if (response.error) {
    const error = new VError(
        {
            name: 'ERR_INVALID_ENV_CONFIG',
            cause: response.error,
        },
        'an error occurred while validating configuration',
    );

    logger.error(error);
    process.exit(1);
}
console.log(process.env.PORT);
export const { DYNAMODB_REGION, DYNAMODB_ACCESS_KEY, DYNAMODB_SECRET_KEY } = response.value;
