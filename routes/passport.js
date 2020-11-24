"use strict";

const crypto = require("crypto");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { user_list } = require("../models");

const checkPass = (uid, password) => {
  return new Promise((res, rej) => {
    user_list
      .findAll({
        where: {
          uid: uid,
          password: password,
        },
      })
      .then((result) => {
        if (result.length <= 0) rej("not found");
        else res(result[0].auth_level);
      })
      .catch((err) => {
        rej("unauth");
      });
  });
};

exports.setup = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "uid",
        passwordField: "password",
      },
      async function (uid, password, done) {
        let encryptPass = crypto
          .createHash("sha256")
          .update(password)
          .digest("base64");
        await checkPass(uid, encryptPass)
          .then((res) => {
            var user = { id: uid, authLevel: res };
            return done(null, user);
          })
          .catch((err) => {
            return done(null, false, { message: `Fail to login.` });
          });
      }
    )
  );
};
