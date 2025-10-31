import { DynamoDBClient, type DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const clientConfig: DynamoDBClientConfig = {
  region: process.env.AWS_REGION || 'ap-southeast-1',
};

// Only add credentials and endpoint for local development
if (process.env.NODE_ENV !== 'prod') {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'myAccessKey',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mySecretKey',
  };
}

const client = new DynamoDBClient(clientConfig);

export const dynamoDb = DynamoDBDocumentClient.from(client);
export const TODOS_TABLE = process.env.TODOS_TABLE || 'todos';
