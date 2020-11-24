/**
 * @projectDescription Markany - 블록체인 네트워크 인터페이스 API with JWT 발급(히스토리)
 *
 * @author mhlee@markany.com
 * @version 1.0
 * @date 2020.10
 * @modify 2020.10.16 09:06 first version
 */

"use strict";

const https = require("./app.js").getHttps;
const app = require("./app.js").getApp;
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");
const logger = require("./common/logger");

if (cluster.isMaster) {
  //create the workers as number of cpus.
  os.cpus().forEach(function (cpu) {
    cluster.fork();
  });

  //if signal of exit comes in
  cluster.on("exit", function (worker, code, signal) {
    logger.info("exited worker : " + worker.id);
    if (code == 200) {
      cluster.fork();
    }
  });
} else {
  logger.info("created worker : " + cluster.worker.id);

  const options = {
    key: fs.readFileSync("./cert/client.key"),
    cert: fs.readFileSync("./cert/client.crt"),
  };

  const svrPort = process.env.PORT ? process.env.PORT : 9952;

  const server = https.createServer(options, app).listen(svrPort, function () {
    logger.info(
      `****************** Authorization server listening on port ${
        server.address().port
      } ************************\n`
    );
  });

  server.timeout = 240000;
}
