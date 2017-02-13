"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }
  // updateById(values, id) {
  //   return this.Models[this.modelname].findByIdAndUpdate(id, { $set: values });
  // }

  findUserRooms(id) {
    return this.Models.Room.find({ users: id });
  }
}

module.exports = new User();
