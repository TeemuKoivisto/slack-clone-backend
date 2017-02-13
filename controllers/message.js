"use strict";

const Message = require("../models/Message");

const errors = require("../config/errors");

// module.exports.findAll = (action, response, next) => {
//   Message
//   .findAll()
//   .then(messages => {
//     socket.emit("server:push", [{
//       type: "MESSAGE_GET_ALL_SUCCESS",
//       payload: messages,
//     }])
//   })
//   .catch(err => next(err));
// }

module.exports.saveOne = (action, response, next) => {
  Message
  .saveOne(action.data)
  .then(message => {
    return response.broadcast([`room/${action.data.Room}`], [{
      type: "MESSAGE_SAVE_ONE_SUCCESS",
      payload: message,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
};
