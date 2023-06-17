import { CustomError } from '../helpers/customErrors.js';
import { docClient } from '../helpers/dynamodb.js';
import { bookValidator } from '../helpers/validator.js';
import { v1 as uuidv1 } from 'uuid';
import Joi from 'joi';
const TABLE = 'rahulBooks';
export async function get_books(count, lastGame) {
    try {
        await Joi.object()
            .keys({
                count: Joi.number().integer().positive().default(10).max(100),
                lastGame: Joi.object(),
            })
            .validateAsync({ count, lastGame });
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = await docClient
        .scan({
            TableName: TABLE,
            Limit: count,
            ExclusiveStartKey: lastGame,
            AttributesToGet: [
                'title',
                'authorName',
                'publishDate',
                'subject',
                'availableCopies',
                'imageUrl',
                'tags',
                'bookID',
            ],
        })
        .promise();

    return {
        books: response.Items,
        paging: response.LastEvaluatedKey,
    };
}

export async function insert_book(data) {
    let _data;
    try {
        _data = await bookValidator(data);
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }
    _data.bookID = uuidv1();

    await docClient
        .put({
            TableName: TABLE,
            Item: _data,
            ConditionExpression: `attribute_not_exists(bookID)`,
        })
        .promise();
    return _data;
}

export async function getBookById(bookID) {
    try {
        await Joi.object()
            .keys({
                bookID: Joi.string().required(),
            })
            .validateAsync({ bookID });
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = await docClient
        .query({
            TableName: TABLE,
            KeyConditionExpression: 'bookID= :bookID',
            ExpressionAttributeValues: {
                ':bookID': bookID,
            },
        })
        .promise();
    return response.Items[0];
}
