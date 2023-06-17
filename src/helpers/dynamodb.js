import AWS from 'aws-sdk';
import { DYNAMODB_ACCESS_KEY, DYNAMODB_REGION, DYNAMODB_SECRET_KEY } from './config.js';
export const docClient = new AWS.DynamoDB.DocumentClient({
    credentials: {
        accessKeyId: DYNAMODB_ACCESS_KEY,
        secretAccessKey: DYNAMODB_SECRET_KEY,
    },
    region: DYNAMODB_REGION,
});
