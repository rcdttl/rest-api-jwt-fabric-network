"use strict";

const Https = require("https");
const express = require("express");
const mrLogger = require("morgan");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();

const navigator = require("./routes/navigator");
const login = require("./routes/login");
const logger = require("./common/logger");

const sequelize = require("./models/index").sequelize;
const { user_list } = require("./models");
const { req_hist } = require("./models");
const { jwt_hist } = require("./models");

sequelize
  .sync()
  .then(() => {
    logger.info("succeed to connected DB");
  })
  .catch((err) => {
    logger.info("failed to connected DB");
    logger.info(err);
  });

function insertRequestHistory(jwToken, headerMethod, headerUrl, bodyStr) {
  return new Promise((res, rej) => {
    req_hist
      .create({
        jwt: jwToken,
        method: headerMethod,
        url: headerUrl,
        body: bodyStr,
      })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

function insertJwtRequiredHistory(userId, jwToken) {
  return new Promise((res, rej) => {
    jwt_hist
      .create({
        uid: userId,
        jwt: jwToken,
      })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

app.use(mrLogger("short"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  logger.info(`requested[] ${Date.now()}`);
  let jwToken;

  if (typeof req.headers.authorization !== "string") {
    console.log(req.headers.authorization);
    jwToken = JSON.stringify(req.headers.authorization);
    console.log(jwToken);
  } else {
    jwToken = req.headers.authorization.split(" ")[1];
  }
  //let jwToken = req.headers.authorization.split(" ")[1];

  if (req.url === "/login") {
    jwToken = "NONE";
  }

  let strBody = JSON.stringify(req.body);
  console.log(jwToken);
  console.log(strBody);
  console.log(req.url);
  console.log(req.method);

  insertJwtRequiredHistory("ab", "bc");
  insertRequestHistory(jwToken, req.method, req.url, strBody);
  next();
});

app.use("/", navigator);
app.use("/login", login);

/*
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
*/
/// error handlers

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send({
    status: "error",
    msg: "Something went wrong, please try again.",
  });
});

/*
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    title: "error",
  });
});
*/

let encryptAdminPass = crypto
  .createHash("sha256")
  .update("asdf")
  .digest("base64");
let encryptUserPass = crypto
  .createHash("sha256")
  .update("4F@6A1!B^&3")
  .digest("base64");

let adminAccount = {
  uid: "rcdttl@gmail.com",
  password: encryptAdminPass,
  auth_level: 0,
};

let userAccount = {
  uid: "users",
  password: encryptUserPass,
  auth_level: 0,
};

user_list
  .bulkCreate([adminAccount, userAccount])
  .then((res) => {
    logger.info(`created default user`);
  })
  .catch((err) => {
    logger.info(`failed to create default user (${err})`);
  });

exports.getHttps = Https;
exports.getApp = app;
