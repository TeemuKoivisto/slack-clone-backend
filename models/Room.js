"use strict";

const BaseModel = require("./BaseModel");

class Room extends BaseModel {
  constructor() {
    super("Room");
  }

  // findAll(params) {
  //   return this.Models[this.modelname].find(params)
  //     .populate("messages");
  // }

  findOne(params) {
    if (params && params._id) {
      params._id = this.Models.mongoose.Types.ObjectId(params._id);
    }
    return this.Models[this.modelname].findOne(params)
      .populate("messages");
  }
}

module.exports = new Room();
