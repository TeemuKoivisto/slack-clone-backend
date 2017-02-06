"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  joinRoom(user, room) {
    return this.Models.Room.update(
      { _id: room._id },
      { $push: { users: user._id } }
    )
  }
}

module.exports = new User();
