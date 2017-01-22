"use strict";

const Message = require("../models/Message");

const errors = require("../config/errors");

module.exports.findAll = (socket, action, next) => {
  console.log("message find All")
  Message
  .findAll()
  .then(messages => {
    console.log("emitting", messages)
    socket.emit("server:push", [{
      type: "MESSAGE_GET_ALL_SUCCESS",
      payload: messages,
    }])
  })
  .catch(err => next(err));
}

module.exports.saveOne = (socket, action, next) => {
  Message
  .saveOne(action.data)
  .then(message => {
    console.log("emitting save success!", message)
    socket.emit("server:push", [{
      type: "MESSAGE_SAVE_ONE_SUCCESS",
      payload: message,
    }])
  })
  .catch(err => next(err));
};
