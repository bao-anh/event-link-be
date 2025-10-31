import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'myAccessKey',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mySecretKey',
  },
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
export const TODOS_TABLE = process.env.TODOS_TABLE || 'todos';
