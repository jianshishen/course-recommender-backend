"use strict";
function errorHandler(err, req, res, next) {
  if (err.code === "ER_DUP_ENTRY") {
    // duplicated username
    return res.status(400).json({ message: "The username exists" });
  }

  if (err.code === "WRONG_INFO") {
    return res.status(400).json({ message: "Incorrect username or password!" });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({
      message: "Invalid Token! Please signout and restart your browser"
    });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
module.exports = errorHandler;
