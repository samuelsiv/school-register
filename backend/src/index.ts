import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import dotenv from 'dotenv';
dotenv.config();

const app = new Hono(); 

app.get('/', (c) => {
  return c.text('Hello Hono!');
})

app.route("", await (await import("./routes/admin/create-account.js")).default());
app.route("", await (await import("./routes/auth/login.js")).default());
app.route("", await (await import("./routes/misc/config.js")).default());

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3000")
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
