"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const PasswordHelper = require("../services/PasswordHelper");

const User = require("../models/User");

const errors = require("../config/errors");

// module.exports.findOne = (socket, action, next) => {
//   User
//   .findOne(action.data)
//   .then(user => {
//     socket.emit("server:push", [{
//       type: "ROOM_GET_ONE_SUCCESS",
//       payload: user,
//     }])
//   })
//   .catch(err => next(err));
// }

// module.exports.findAll = (socket, action, next) => {
//   User
//   .findAll()
//   .then(users => {
//     socket.emit("server:push", [{
//       type: "ROOM_GET_ALL_SUCCESS",
//       payload: users,
//     }])
//   })
//   .catch(err => next(err));
// }

// module.exports.saveOne = (socket, action, next) => {
//   User
//   .saveOne(action.data)
//   .then(user => {
//     socket.emit("server:push", [{
//       type: "ROOM_SAVE_ONE_SUCCESS",
//       payload: user,
//     }])
//   })
//   .catch(err => next(err));
// };

module.exports.loginUser = (req, res, next) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      throw new errors.NotFoundError("No user found with given email.");
    // } else if (!user.isActive) {
    //   throw new errors.ForbiddenError("Your account has been retired, please contact admin for reactivation.");
    } else if (!PasswordHelper.comparePassword(req.body.password, user.passwordHash)) {
      throw new errors.AuthenticationError("Incorrect password.");
    } else {
      // User.updateById({ online: true }, user._id);
      const payload = TokenGenerator.generateLoginPayload(user);
      const token = TokenGenerator.generateToken(payload);
      user.passwordHash = undefined;
      res.status(200).send({
        user,
        token,
        expires: payload.expires,
      });
    }
  })
  .catch(err => next(err));
};