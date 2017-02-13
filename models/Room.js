"use strict";

const BaseModel = require("./BaseModel");

class Room extends BaseModel {
  constructor() {
    super("Room");
  }

  findAll(params) {
    return this.Models[this.modelname].find(params)
      .populate("messages")
      .populate("users");
  }

  findOne(params) {
    return this.Models[this.modelname].findOne(params)
      .populate("messages")
      .populate("users");
  }

  findUserRoom(user, room) {
    return this.Models[this.modelname].findOne(
      { _id: room._id, users: user._id }
    )
  }

  userJoinRoom(user, room) {
    return this.Models.Room.update(
      { _id: room._id },
      { $addToSet: { users: user._id } }
    )
  }

  userLeaveRoom(user, room) {
    return this.Models.Room.update(
      { _id: room._id },
      { $pull: { users: user._id } }
    )
  }

  removeUserFromRooms(userId) {
    return this.Models.Room.update(
      { },
      { $pull: { users: userId } },
      { multi: true }
    )
  }
}

module.exports = new Room();
