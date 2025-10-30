import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

export const handler = serverlessExpress({
  app,
  eventSourceName: 'AWS_API_GATEWAY_V2',
});

export default handler;
