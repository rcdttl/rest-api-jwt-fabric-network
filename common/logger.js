const appRoot = require("app-root-path");
const winston = require("winston");
require("winston-daily-rotate-file");
const moment = require("moment-timezone");

const kstTime = () => {
  return moment.tz("Asia/Seoul").format("YY-MM-DD HH:mm:ss.SSS");
};

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${appRoot}/logs/auto_proxy_%DATE%.log`,
      datePattern: "YYMMDD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.printf(
        (info) =>
          `${kstTime()} [${info.level.toUpperCase()}][${process.pid}] - ${
            info.message
          }`
      ),
    }),
    new winston.transports.Console({
      format: winston.format.printf(
        (info) =>
          `${kstTime()} [${info.level.toUpperCase()}][${process.pid}] - ${
            info.message
          }`
      ),
    }),
  ],
});

module.exports = logger;
