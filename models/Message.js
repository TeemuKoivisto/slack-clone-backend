"use strict";

const BaseModel = require("./BaseModel");

class Message extends BaseModel {
  constructor() {
    super("Message");
  }

  // findAll(params) {
  //   return this.Models[this.modelname].find(params)
  //     .populate("User", "nick");
  // }

}

module.exports = new Message();
