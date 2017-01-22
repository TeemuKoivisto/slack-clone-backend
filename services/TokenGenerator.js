"use strict";

const jwt = require("jsonwebtoken");

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  decodeToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (e) {
      decoded = undefined;
    }
    return decoded;
  }
  isTokenExpired(decodedToken) {
    return new Date() > decodedToken.expires;
  }
  generateLoginPayload(user) {
    const payload = {
      user: {
        id: user.id,
        fullname: `${user.firstname} ${user.lastname}`,
        role: user.role,
      },
      name: "login",
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
    };
    return payload;
  }
  generateToken(payload) {
    return jwt.sign(payload, this.secret);
  }
}

module.exports = new TokenGenerator(process.env.TOKEN_SECRET);
module.exports.class = TokenGenerator;
