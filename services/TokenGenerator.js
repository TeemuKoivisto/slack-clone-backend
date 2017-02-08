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
        id: user.id,
        fullname: `${user.firstname} ${user.lastname}`,
        role: user.role,
        StudyFieldId: user.StudyFieldId,
      },
      audience: "login",
      // expires: Math.floor(Date.now() / 1000) + 15,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
      // expiresIn: 172800, // seconds
    };
    return payload;
  }
  derp() {
    return "derp"
  }
}

module.exports = new TokenGenerator(process.env.TOKEN_SECRET);
module.exports.class = TokenGenerator;
