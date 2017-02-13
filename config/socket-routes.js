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

module.exports = (socket, response) => (action) => {
  action.user = socket.decoded_token.user;

  const next = (err) => {
    console.log("yo error", err)
  }

  switch (action.type) {
    case "ROOM_GET_ONE":
      roomCtrl.findOne(action, response, next);
      break;
    case "ROOM_GET_ALL":
      roomCtrl.findAll(action, response, next);
      break;
    case "ROOM_SAVE_ONE":
      validateEvent("message", "save");
      roomCtrl.saveOne(action, response, next);
      break;
    case "ROOM_JOIN_ONE":
      roomCtrl.joinRoom(action, response, next);
      break;
    case "ROOM_LEAVE_ONE":
      roomCtrl.leaveRoom(action, response, next);
      break;
    // case "MESSAGE_GET_ALL":
    //   msgCtrl.findAll(action, response, next);
    //   break;
    case "MESSAGE_SAVE_ONE":
      validateEvent("message", "save");
      msgCtrl.saveOne(action, response, next);
      break;
    default:
      errorHandler();
  }
};
