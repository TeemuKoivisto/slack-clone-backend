"use strict";

const Room = require("../models/Room");
const User = require("../models/User");

const errors = require("../config/errors");

module.exports.findOne = (action, response, next) => {
  Room
  .findOne(action.data)
  .then(room => {
    return response.broadcast([`user/${action.user._id}`], [{
      type: "ROOM_GET_ONE_SUCCESS",
      payload: room,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}

module.exports.findAll = (action, response, next) => {
  Room
  .findAll()
  .then(rooms => {
    return response.broadcast([`user/${action.user._id}`], [{
      type: "ROOM_GET_ALL_SUCCESS",
      payload: rooms,
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}

module.exports.saveOne = (action, response, next) => {
  Room
  .saveOne(action.data)
  .then(room => {
    return response.broadcast([`user/${action.user._id}`], [{
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

module.exports.joinRoom = (action, response, next) => {
  Room
  .userJoinRoom(action.user, action.data)
  .then(result => {
    // stupid optimization
    // if (result.nModified > 0) {
      return User.findOne({
        _id: action.user._id
      })
    // }
    // return "no-changes";
  })
  .then(user => {
    console.log(user)
    if (!user) {
      // only incase the user's account was deleted and he is still logged in? :D
      throw new errors.NotFoundError("No User found");
    }
    // const payload = user === "no-changes" ? Object.assign({}, action.user, action.data)
    //  : Object.assign({}, user, action.data);

    response.joinRoom(action.data._id, action.user._id);

    return response.broadcast([`room/${action.data._id}`], [{
      type: "ROOM_JOIN_ONE_SUCCESS",
      payload: {
        user,
        room: action.data,
      },
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}

module.exports.leaveRoom = (action, response, next) => {
  Room
  .userLeaveRoom(action.user, action.data)
  .then(rows => {
    console.log(action.user)
    console.log(rows)
    return response.broadcast([`user/${action.user._id}`], [{
      type: "ROOM_LEAVE_ONE_SUCCESS",
      payload: {
        user: action.user,
        room: action.data,
      },
      // notification: `User ${socket.decoded_token.user.fullname} updated an User`,
    }], action.user)
  })
  .catch(err => next(err));
}