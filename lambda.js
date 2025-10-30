/* eslint-disable @typescript-eslint/no-var-requires */
const serverlessExpress = require('@vendia/serverless-express');
const app = require('./src/app.ts');

exports.handler = serverlessExpress({ app });
