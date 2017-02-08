"use strict";

const Room = require("../models/Room");

module.exports.findOne = (action, broadcast, next) => {
  Room
  .findOne(action.data)
  .then(room => {
    return broadcast([`user/${action.user.id}`], [{
      type: "ROOM_GET_ONE_SUCCESS",
      payload: room,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}

module.exports.findAll = (action, broadcast, next) => {
  Room
  .findAll()
  .then(rooms => {
    return broadcast([`user/${action.user.id}`], [{
      type: "ROOM_GET_ALL_SUCCESS",
      payload: rooms,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}

module.exports.saveOne = (action, broadcast, next) => {
  Room
  .saveOne(action.data)
  .then(room => {
    return broadcast([`user/${action.user.id}`], [{
      type: "ROOM_SAVE_ONE_SUCCESS",
      payload: room,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
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

module.exports.joinRoom = (action, broadcast, next) => {
  Room
  .userJoinRoom(socket.decoded_token.user, action.data)
  .then(rows => {
    return broadcast([`user/${action.user.id}`], [{
      type: "ROOM_JOIN_SUCCESS",
      payload: action.data,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}