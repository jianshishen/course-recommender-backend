"use strict";
const expressJwt = require("express-jwt");
const config = require("config.json");

function jwt() {
  const secret = config.secret;
  return expressJwt({ secret }).unless({
    path: [
      // public routes that don't require authentication
      "/authenticate",
      "/register",
      "/doc"
    ]
  });
}
module.exports = jwt;
