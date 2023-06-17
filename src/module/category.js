import { CustomError } from '../helpers/customErrors.js';
import { docClient } from '../helpers/dynamodb.js';
import { bookValidator } from '../helpers/validator.js';
import { v1 as uuidv1 } from 'uuid';
import Joi from 'joi';
const TABLE = 'rahulBooks';

export async function get_categories(count) {
    try {
        //
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = [{
        'title': 'Language & Speaking',
        'imageUrl': '/assets/img/categories/cat-1.jpg'
    },
    {
        'title': 'Religion & Histroy',
        'imageUrl': '/assets/img/categories/cat-2.jpg'
    },
    {
        'title': 'General Knowledge',
        'imageUrl': '/assets/img/categories/cat-3.jpg'
    },
    {
        'title': 'Art & Drawing',
        'imageUrl': '/assets/img/categories/cat-4.jpg'
    },
    {
        'title': 'Athletic & Dance',
        'imageUrl': '/assets/img/categories/cat-5.jpg'
    }]
    return response.slice(0, count);
}
