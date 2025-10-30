import type { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

type EventSourceName = 'AWS_API_GATEWAY_V1' | 'AWS_API_GATEWAY_V2';

const DEFAULT_EVENT_SOURCE: EventSourceName =
  (process.env.LAMBDA_EVENT_SOURCE as EventSourceName) || 'AWS_API_GATEWAY_V2';

const handlerCache = new Map<string, ReturnType<typeof serverlessExpress>>();

const getExpressHandler = (eventSourceName: EventSourceName) => {
  const key = eventSourceName;

  if (!handlerCache.has(key)) {
    handlerCache.set(
      key,
      serverlessExpress({
        app,
        eventSourceName,
      }),
    );
  }

  return handlerCache.get(key)!;
};

const detectEventSource = (event: unknown): EventSourceName | undefined => {
  if (event && typeof event === 'object') {
    const payload = event as Record<string, unknown>;

    const requestContext = payload.requestContext as Record<string, unknown> | undefined;

    if (
      payload.version === '2.0' &&
      requestContext &&
      typeof requestContext === 'object' &&
      requestContext.http
    ) {
      return 'AWS_API_GATEWAY_V2';
    }

    if (
      typeof payload.httpMethod === 'string' ||
      (requestContext &&
        typeof requestContext === 'object' &&
        ('identity' in requestContext ||
          'resourceId' in requestContext ||
          'resourcePath' in requestContext ||
          'stage' in requestContext)) ||
      typeof payload.resource === 'string' ||
      typeof payload.path === 'string'
    ) {
      return 'AWS_API_GATEWAY_V1';
    }
  }

  return undefined;
};

export const handler: Handler = (event, context, callback) => {
  const fallbackSource = DEFAULT_EVENT_SOURCE;
  const eventSource = detectEventSource(event);
  if (!eventSource) {
    console.warn(
      'serverlessExpress: falling back to default event source',
      fallbackSource,
    );
  }
  const expressHandler = getExpressHandler(eventSource ?? fallbackSource);
  return expressHandler(event, context, callback);
};

export default handler;
