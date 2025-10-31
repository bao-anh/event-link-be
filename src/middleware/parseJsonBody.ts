import type { NextFunction, Request, Response } from 'express';

const isJsonLikeString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
};

export const parseJsonBody = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;

  if (body === undefined || body === null || typeof body === 'object' && !Buffer.isBuffer(body)) {
    return next();
  }

  try {
    let text: string;

    if (Buffer.isBuffer(body)) {
      text = body.toString('utf-8');
    } else if (typeof body === 'string') {
      text = body;
    } else {
      return next();
    }

    if (!text.trim()) {
      req.body = {};
      return next();
    }

    if (!isJsonLikeString(text)) {
      // Non-JSON payload; leave as string for downstream handlers.
      req.body = text;
      return next();
    }

    req.body = JSON.parse(text);
    return next();
  } catch (error) {
    const parseError = error instanceof Error ? error : new Error('Invalid JSON payload');
    (parseError as Error & { status?: number }).status = 400;
    return next(parseError);
  }
};

export default parseJsonBody;
