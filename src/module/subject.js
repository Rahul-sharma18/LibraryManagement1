import { CustomError } from '../helpers/customErrors.js';
import { docClient } from '../helpers/dynamodb.js';
import { bookValidator } from '../helpers/validator.js';
import { v1 as uuidv1 } from 'uuid';
import Joi from 'joi';
const TABLE = 'rahulBooks';

export async function get_subjects(count) {
    try {
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = ['Maths', 'Finance', 'Nature', 'Physics', 'Chemistry', 'Law'];
    return response.slice(0, count);
}
