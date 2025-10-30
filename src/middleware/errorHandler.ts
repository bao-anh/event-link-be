import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  // connect-timeout sets req.timedout = true when a timeout occurs
  if ((req as any).timedout || err?.code === 'ETIMEDOUT' || err?.message === 'Request timed out') {
    res.status(503).json({ error: 'Request timed out' });
    return;
  }

  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
