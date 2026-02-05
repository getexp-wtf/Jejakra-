import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  if (typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status: number }).status === 'number') {
    const e = err as { status: number; message?: string };
    res.status(e.status).json({ error: e.message ?? 'Error' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
