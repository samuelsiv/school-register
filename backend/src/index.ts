import {serve} from "@hono/node-server";
import {Hono} from "hono";

import {readdir} from "fs/promises";
import path from "path";
import {pathToFileURL} from "url";

import dotenv from "dotenv";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {authMiddleware} from "./middleware/auth";
import {roleMiddleware} from "./middleware/role";
import {studentDataMiddleware} from "./middleware/studentData";

dotenv.config();

const app = new Hono();
app.use(logger());
app.use("*", cors({
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  exposeHeaders: ["Authorization"],
  maxAge: 600,
  origin: "*", // only development, change it to your domain in production
}));

app.use("/api/v1/admin/*", authMiddleware, roleMiddleware(["admin"]));
app.use("/api/v1/students/*", authMiddleware, roleMiddleware(["student", "parent"]));
app.use("/api/v1/students/:studentId/*", studentDataMiddleware);
app.use("/api/v1/teachers/*", authMiddleware, roleMiddleware(["teacher"]));
app.use("/api/v1/parents/*", authMiddleware, roleMiddleware(["parent"]));
app.use("/api/v1/user/*", authMiddleware, roleMiddleware(["*"]));

async function loadRoutes(routesDir: string) {
  const routeFiles = await readdir(routesDir, {withFileTypes: true});
  for (const file of routeFiles) {
    const filePath = path.join(routesDir, file.name);
    if (file.isDirectory()) {
      await loadRoutes(filePath);
    } else if (file.name.endsWith("")) {
      const fileURL = pathToFileURL(filePath).href;
      const routeModule = await import(fileURL);
      console.log(`Loading route: ${filePath}`);

      try {
        const router = await routeModule.default();
        if (router && typeof router.fetch === "function") {
          app.route("", router);
        }
      } catch (error: Error | any) {
        console.error(`Error loading route ${filePath}: ${error.message}`);
      }
    }
  }
}

await loadRoutes(path.resolve("./dist/routes"));

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3000", 10),
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
