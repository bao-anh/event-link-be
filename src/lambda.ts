import type { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

type EventSourceName = 'AWS_API_GATEWAY_V1' | 'AWS_API_GATEWAY_V2';

const handlerCache = new Map<string, ReturnType<typeof serverlessExpress>>();

const getExpressHandler = (eventSourceName?: EventSourceName) => {
  const key = eventSourceName ?? 'auto';

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

    if (payload.version === '2.0' && typeof payload.requestContext === 'object') {
      const requestContext = payload.requestContext as Record<string, unknown>;
      if (requestContext?.http) {
        return 'AWS_API_GATEWAY_V2';
      }
    }

    if (
      typeof payload.httpMethod === 'string' ||
      (payload.requestContext &&
        typeof payload.requestContext === 'object' &&
        'identity' in (payload.requestContext as Record<string, unknown>))
    ) {
      return 'AWS_API_GATEWAY_V1';
    }
  }

  return undefined;
};

export const handler: Handler = (event, context, callback) => {
  const eventSource = detectEventSource(event);
  const expressHandler = getExpressHandler(eventSource);
  return expressHandler(event, context, callback);
};

export default handler;
