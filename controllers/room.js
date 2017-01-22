"use strict";

const Room = require("../models/Room");

module.exports.findOne = (socket, action, next) => {
  Room
  .findOne()
  .then(room => {
    socket.emit("server:push", [{
      type: "ROOM_GET_ONE_SUCCESS",
      payload: room,
    }])
  })
  .catch(err => next(err));
}

module.exports.findAll = (socket, action, next) => {
  Room
  .findAll()
  .then(rooms => {
    socket.emit("server:push", [{
      type: "ROOM_GET_ALL_SUCCESS",
      payload: rooms,
    }])
  })
  .catch(err => next(err));
}

module.exports.saveOne = (socket, action, next) => {
  Room
  .saveOne(action.data)
  .then(room => {
    socket.emit("server:push", [{
      type: "ROOM_SAVE_ONE_SUCCESS",
      payload: room,
    }])
  })
  .catch(err => next(err));
};

// module.exports.updateOne = (req, res, next) => {
//   Room
//   .updateById(req.body, req.params.id)
//   .then(room => {
//     res.status(200).send(room);
//   })
//   .catch(err => next(err));
// };
