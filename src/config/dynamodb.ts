import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'myAccessKey',
    secretAccessKey: 'mySecretKey'
  }
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
export const TODOS_TABLE = process.env.TODOS_TABLE || 'todos';