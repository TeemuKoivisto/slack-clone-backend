"use strict";

const Message = require("../models/Message");

module.exports.findAll = (req, res, next) => {
  Message
  .findAll()
  .then(messages => {
    res.status(200).send(messages);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  Message
  .saveOne(req.body)
  .then(message => {
    res.status(200).send(message);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  Message
  .updateById(req.body, req.params.id)
  .then(message => {
    res.status(200).send(message);
  })
  .catch(err => next(err));
};
