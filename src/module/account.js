import bcryptjs from 'bcryptjs';
import { v1 as uuidv1 } from 'uuid';

import { CustomError } from '../helpers/customErrors.js';
import { docClient } from '../helpers/dynamodb.js';
import { accountLoginValidator, emailValidator, accountSignUpValidator } from '../helpers/validator.js';

const TABLE = 'rahulLogin';
const EMAIL_INDEX = 'emailID';

export async function getUserByEmailAndPassword(emailID, password) {
    try {
        await accountLoginValidator({ emailID, password });
    } catch (error) {
        // console.log('Login');
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = await docClient
        .query({
            TableName: TABLE,
            IndexName: EMAIL_INDEX,
            KeyConditionExpression: 'emailID= :emailID',
            ExpressionAttributeValues: {
                ':emailID': emailID,
            },
        })
        .promise();

    if (response.Items === undefined || response.Items.length === 0) {
        throw new CustomError('You have entered an invalid username or password', 401);
    }

    const user = response.Items[0];

    const success = await bcryptjs.compare(password, user.password);

    if (success) {
        return user;
    } else {
        throw new CustomError('You have entered an invalid username or password', 401);
    }
}

export async function checkIfEmailExists(emailID) {
    try {
        await emailValidator({ emailID });
    } catch (error) {
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    const response = await docClient
        .query({
            TableName: TABLE,
            IndexName: EMAIL_INDEX,
            KeyConditionExpression: 'emailID = :emailID',
            ExpressionAttributeValues: {
                ':emailID': emailID,
            },
        })
        .promise();

    return !(response.Items === undefined || response.Items.length === 0);
}

export async function createAccount(data) {
    let _data;
    try {
        _data = await accountSignUpValidator(data);
    } catch (error) {
        //console.log('Signup');
        throw new CustomError(
            error instanceof Error ? error.message : 'An error occurred, while validating input parameters',
            400,
        );
    }

    _data.password = await bcryptjs.hash(data.password, 10);
    _data.userID = uuidv1();

    await docClient
        .put({
            TableName: TABLE,
            Item: _data,
            ConditionExpression: `attribute_not_exists(userID)`,
        })
        .promise();
}
