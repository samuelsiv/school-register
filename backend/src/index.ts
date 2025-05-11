import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import dotenv from 'dotenv';
import { cors } from 'hono/cors';
dotenv.config();

const app = new Hono(); 

app.use('*', cors({
  origin: '*', // this is for development only, change it to your domain in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
  exposeHeaders: ['Authorization'],
  maxAge: 600,
}));

app.route("", await (await import("./routes/admin/create-account.js")).default());
app.route("", await (await import("./routes/auth/login.js")).default());
app.route("", await (await import("./routes/misc/config.js")).default());
app.route("", await (await import("./routes/user/info.js")).default());

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3000")
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
