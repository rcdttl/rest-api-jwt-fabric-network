"use strict";

const express = require("express");
const passport = require("passport");
const auth = require("./auth");

const { jwt_hist } = require("../models");

// Passport setting
require("./passport").setup();

const router = express.Router();

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

router.post("/", function (req, res, next) {
  passport.authenticate("local", async function (err, user, info) {
    let error = err || info;
    if (error)
      return res.json(404, {
        status: "error",
        msg: error,
      });

    if (!user)
      return res.json(404, {
        status: "error",
        msg: "Something went wrong, please try again.",
      });

    // access token 생성
    let token = auth.signToken(user.id, user.authLevel);
    //res.json({ access_token: token });
    //await insertJwtRequiredHistory("test", "test");
    res.json(200, {
      status: "succeed",
      msg: token,
    });
  })(req, res, next);
});

module.exports = router;
