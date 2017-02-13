"use strict";

const jwt = require("jsonwebtoken");

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  verifyToken(token, options) {
    return jwt.verify(token, this.secret, options);
  }
  isTokenExpired(decodedToken) {
    // return new Date() > decodedToken.expires;
    return Math.floor(Date.now() / 1000) > decodedToken.expires;
  }
  generateToken(payload) {
    return jwt.sign(payload, this.secret, { audience: payload.audience });
  }
  generateLoginPayload(user) {
    const payload = {
      user: {
        _id: user._id,
        fullname: user.firstname ? `${user.firstname} ${user.lastname}` : "Anonymous",
        role: user.role,
      },
      audience: "login",
      // expires: Math.floor(Date.now() / 1000) + 15,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
      // expiresIn: 172800, // seconds
    };
    return payload;
  }
}

module.exports = new TokenGenerator(process.env.TOKEN_SECRET);
module.exports.class = TokenGenerator;
