"use strict";

const msgCtrl = require("../controllers/message");

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
    case "MESSAGE_GET_ALL":
      console.log("git mesg");
      msgCtrl.findAll(socket, action, next);
      break;
    case "MESSAGE_SAVE_ONE":
      console.log("save msg");
      validateEvent("message", "save");
      msgCtrl.saveOne(socket, action, next);
      break;
    case "MESSAGE_SAVE_ONE":
      console.log("sva mesg");
      break;
    default:
      console.log("default lul");
      errorHandler();
  }
};
