"use strict";


const roomCtrl = require("../controllers/room");
const msgCtrl = require("../controllers/message");
const userCtrl = require("../controllers/user");

const validateEvent = (name, schema) => (event, next) => {

}

const errorHandler = () => {

}

const router = (actionType, middleware) => (next) => {
// for m in middlewares if (m.next() return next(m))  
};

module.exports = (socket) => (action) => {
  action.user = socket.decoded_token.user;

  const next = (err) => {
    console.log("yo error", err)
  }

  switch (action.type) {
    case "ROOM_GET_ONE":
      roomCtrl.findOne(socket, action, next);
      break;
    case "ROOM_GET_ALL":
      roomCtrl.findAll(socket, action, next);
      break;
    case "ROOM_SAVE_ONE":
      validateEvent("message", "save");
      roomCtrl.saveOne(socket, action, next);
      break;
    case "MESSAGE_GET_ALL":
      msgCtrl.findAll(socket, action, next);
      break;
    case "MESSAGE_SAVE_ONE":
      validateEvent("message", "save");
      msgCtrl.saveOne(socket, action, next);
      break;
    case "USER_JOIN_ROOM":
      userCtrl.joinRoom(socket, action, next);
      break;
    default:
      errorHandler();
  }
};
