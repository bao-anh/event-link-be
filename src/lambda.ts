import { APIGatewayProxyHandler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

export const handler: APIGatewayProxyHandler = serverlessExpress({ app });