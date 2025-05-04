"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
require("module-alias/register");
const module_alias_1 = require("module-alias");
const path_1 = require("path");
(0, module_alias_1.addAliases)({
    "@": (0, path_1.resolve)(__dirname, "../src"),
});
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const middlewares_1 = require("./middlewares");
const config_1 = require("./config");
const logging_1 = require("./logging");
const connections_1 = require("./connections");
const utils_1 = require("./utils");
const routes_1 = require("./routes");
// Initialize an express app
const app = (0, express_1.default)();
// Create node server
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://192.168.137.1:5173",
        "http://localhost:5000",
        ...config_1.config.corsOrigins,
    ],
    credentials: true,
}));
app.use((0, middlewares_1.consoleRequestLogger)());
app.use(middlewares_1.methodChecker); // Checks if the incoming request method is supported
app.use(express_1.default.urlencoded({ extended: true })); // Parse urlencoded data in request body
app.use(express_1.default.json({})); // Parse json data in request body
app.use("/kannie/api/v1/", routes_1.appRouter);
app.get(/^\/(api\/v1)?(\/)?$/, (req, res) => {
    return res.send({
        success: true,
        message: "Hello! Kannie backend active!👋",
    });
});
// All route that are not handled from the top will be handled here
app.all("*", middlewares_1.routeNotFound); // Returns a 404 response for such routes
app.use(middlewares_1.errorHandler); // Handles all error in the app
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        logging_1.logger.error(`Port ${config_1.config.port} is already in use. Trying a different port...`);
        const NEW_PORT = config_1.config.port + 1;
        server.listen(NEW_PORT, config_1.config.hostname || "", () => {
            logging_1.logger.info(`
          ------------
          Server Application Started!
          API V1: http://${config_1.config.hostname}:${NEW_PORT}
          API Docs: http://${config_1.config.hostname}:${NEW_PORT}/docs
          ------------
      `);
        });
    }
    else {
        logging_1.logger.error(`Server error: ${error}`);
    }
});
const startServer = () => {
    server.listen(config_1.config.port, config_1.config.hostname, () => {
        logging_1.logger.info(`
      ------------
      Server Application Started!
      API V1: http://${config_1.config.hostname}:${config_1.config.port}
      API Docs: http://${config_1.config.hostname}:${config_1.config.port}/docs
      ------------  
  `);
    });
};
const startApp = () => {
    (0, utils_1.initRedis)();
    (0, connections_1.establishDatabaseConnection)(startServer);
};
startApp();
