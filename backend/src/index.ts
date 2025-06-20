import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import path from 'path';
import { pathToFileURL } from 'url';
import { readdir } from 'fs/promises';

import dotenv from 'dotenv';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth.js';
import { roleMiddleware } from './middleware/role.js';
import { logger } from 'hono/logger';
import { studentDataMiddleware } from './middleware/studentData.js';
dotenv.config();

const app = new Hono();
app.use(logger())
app.use('*', cors({
  origin: '*', // this is for development only, change it to your domain in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
  exposeHeaders: ['Authorization'],
  maxAge: 600,
}));

app.use('/api/v1/admin/*', authMiddleware, roleMiddleware(['admin']));
app.use('/api/v1/students/*', authMiddleware, roleMiddleware(['student', 'parent']), studentDataMiddleware);
app.use('/api/v1/teachers/*', authMiddleware, roleMiddleware(['teacher']));
app.use('/api/v1/parents/*', authMiddleware, roleMiddleware(['parent']));
app.use('/api/v1/user/*', authMiddleware, roleMiddleware(['*']));

async function loadRoutes(routesDir: string) {
  const routeFiles = await readdir(routesDir, { withFileTypes: true });
  for (const file of routeFiles) {
    const filePath = path.join(routesDir, file.name);
    if (file.isDirectory()) {
      await loadRoutes(filePath);
    } else if (file.name.endsWith('.js')) {
      const fileURL = pathToFileURL(filePath).href;
      const routeModule = await import(fileURL);
      console.log(`Loading route: ${filePath}`);
        
      try {
        const router = await routeModule.default();
        if (router && typeof router.fetch === 'function') {
          app.route('', router);
        }
      } catch (error: Error | any) {
        console.error(`Error loading route ${filePath}: ${error.message}`);
      }
    }
  }
}

await loadRoutes(path.resolve('./dist/src/routes'));

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3000")
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
