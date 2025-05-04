import { createLogger, format, transports } from "winston";
import chalk from "chalk";

export enum LoggerLevels {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

const colorize = format.printf(({ level, message, timestamp }) => {
  const color =
    level === "error"
      ? "red"
      : level === "warn"
      ? "yellow"
      : level === "info"
      ? "green"
      : level === "debug"
      ? "cyan"
      : "white";
  return `${timestamp} ${chalk[color](level)}: ${chalk[color](message)}`;
});

export const logger = createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console({
      format: format.combine(format.timestamp(), colorize),
    }),
  ],
});
