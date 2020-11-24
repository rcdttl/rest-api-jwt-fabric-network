"use strict";

const jwt = require("jsonwebtoken");
const compose = require("composable-middleware");
const SECRET = "token_secret";
const EXPIRES = 60; // 1 hour
const validateJwt = require("express-jwt")({ secret: SECRET });

function signToken(id, authLevel) {
  return jwt.sign({ id: id, authLevel: authLevel }, SECRET, {
    expiresInMinutes: EXPIRES,
  });
}

/*
function isAuthenticated() {
  return (
    compose()
      // Validate jwt
      .use(function (req, res, next) {
        
        // allow access_token to be passed through query parameter as well
        //if (req.query && req.query.hasOwnProperty("access_token")) {
        //  req.headers.authorization = "Bearer " + req.query.access_token;
        //}
        
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function (req, res, next) {
        req.user = {
          id: req.user.id,
          name: "name  " + req.user.id,
          authLevel: req.user.authLevel,
        };
        next();
      })
  );
}
*/

function isAuthenticated() {
  return compose()
    .use(function (req, res, next) {
      validateJwt(req, res, next);
    })
    .use(function (err, req, res, next) {
      if (err) {
        //here you will catch the error generated by the validateJWT
        return res.status(401).json({
          state: "error",
          msg: err.message,
        });
        // or: return next(err);
      } else {
        req.user = {
          id: req.user.id,
          name: "name  " + req.user.id,
          authLevel: req.user.authLevel,
        };
        next();
      }
    });
}

exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;
