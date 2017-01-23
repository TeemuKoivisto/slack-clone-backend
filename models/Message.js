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

  saveOne(values) {
    let saved;

    return this.Models[this.modelname].create(values)
      .then(msg => {
        saved = msg;
        return this.Models.Room.update({ _id: values.Room },
          { $push: { messages: msg._id } })
      })
      .then(() => {
        return saved;
      })
  }
}

module.exports = new Message();
