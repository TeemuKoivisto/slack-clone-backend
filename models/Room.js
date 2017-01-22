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
    return this.Models[this.modelname].findOne(params)
      .populate("messages");
  }
}

module.exports = new Room();
