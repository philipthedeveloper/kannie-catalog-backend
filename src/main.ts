import "express-async-errors";
import "module-alias/register";
import { addAliases } from "module-alias";
import { resolve } from "path";

addAliases({
  "@": resolve(__dirname, "../src"),
});

import express, { Request } from "express";
import http from "http";
import cors from "cors";
import {
  errorHandler,
  methodChecker,
  consoleRequestLogger,
  routeNotFound,
} from "./middlewares";
import { config } from "./config";
import { logger } from "./logging";
import { establishDatabaseConnection } from "./connections";
import { initRedis } from "./utils";
import { appRouter } from "./routes";

// Initialize an express app
const app = express();

// Create node server
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.137.1:5173",
      "http://localhost:5000",
      ...config.corsOrigins,
    ],
    credentials: true,
  })
);

app.use(consoleRequestLogger());
app.use(methodChecker); // Checks if the incoming request method is supported
app.use(express.urlencoded({ extended: true })); // Parse urlencoded data in request body
app.use(express.json({})); // Parse json data in request body

app.use("/kannie/api/v1/", appRouter);
app.get(/^\/(api\/v1)?(\/)?$/, (req: Request, res: any) => {
  return res.send({
    success: true,
    message: "Hello! Kannie backend active!👋",
  });
});

// All route that are not handled from the top will be handled here
app.all("*", routeNotFound); // Returns a 404 response for such routes
app.use(errorHandler as any); // Handles all error in the app

server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    logger.error(
      `Port ${config.port} is already in use. Trying a different port...`
    );
    const NEW_PORT = config.port + 1;
    server.listen(NEW_PORT, config.hostname || "", () => {
      logger.info(`
          ------------
          Server Application Started!
          API V1: http://${config.hostname}:${NEW_PORT}
          API Docs: http://${config.hostname}:${NEW_PORT}/docs
          ------------
      `);
    });
  } else {
    logger.error(`Server error: ${error}`);
  }
});

const startServer = () => {
  server.listen(config.port, config.hostname, () => {
    logger.info(`
      ------------
      Server Application Started!
      API V1: http://${config.hostname}:${config.port}
      API Docs: http://${config.hostname}:${config.port}/docs
      ------------  
  `);
  });
};

const startApp = () => {
  initRedis();
  establishDatabaseConnection(startServer);
};

startApp();
