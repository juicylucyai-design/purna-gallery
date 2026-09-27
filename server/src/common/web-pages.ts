import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PAGE_NAME = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/i;

/**
 * Serves the exported pages at clean URLs: / → index.html, /privacy → privacy.html.
 * (The export also has same-named folders of page data, which a plain static server would redirect into.)
 */
export function htmlPages(webBuildDir: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api/') || req.path.startsWith('/_next/') || path.extname(req.path)) return next();

    const name = req.path === '/' ? 'index' : req.path.replace(/^\/+|\/+$/g, '');
    if (!PAGE_NAME.test(name)) return next();
    const file = path.join(webBuildDir, `${name}.html`);
    if (!existsSync(file)) return next();
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.sendFile(file);
  };
}

/** Sends the exported 404 page for any unknown page URL (API routes keep their JSON 404). */
export function notFoundPage(webBuildDir: string): RequestHandler {
  const file = path.join(webBuildDir, '404.html');
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/') || !existsSync(file)) return next();
    return res.status(404).sendFile(file);
  };
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}
