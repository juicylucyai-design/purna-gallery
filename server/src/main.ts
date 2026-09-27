import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { AppModule } from './app.module';
import { htmlPages, notFoundPage, securityHeaders } from './common/web-pages';
import { Db } from './database/db';
import { runMigrations } from './database/migrate';

const WEB_BUILD_DIR = path.resolve(__dirname, '..', '..', 'web', 'out');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1); // Railway terminates HTTPS in front of the app, so the visitor's IP is in X-Forwarded-For.
  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.useBodyParser('json', { limit: '32kb' });
  app.setGlobalPrefix('api');

  await runMigrations(app.get(Db));

  if (existsSync(WEB_BUILD_DIR)) {
    app.use(htmlPages(WEB_BUILD_DIR));
    app.useStaticAssets(WEB_BUILD_DIR, {
      index: false,
      redirect: false,
      // Next.js fingerprints everything under /_next, so those files can be cached for a year.
      setHeaders: (res, file) => {
        const immutable = file.includes(`${path.sep}_next${path.sep}`);
        res.setHeader('Cache-Control', immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
      },
    });
    app.use(notFoundPage(WEB_BUILD_DIR));
  } else {
    console.warn(`Web build not found at ${WEB_BUILD_DIR}. Run "npm run build" at the repo root to serve the pages.`);
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`Purna Gallery site listening on port ${port}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
