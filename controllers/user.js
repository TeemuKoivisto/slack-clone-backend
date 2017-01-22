"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const passwordHelper = require("../config/passwordHelper");

const User = require("../models/User");

const errors = require("../config/errors");

module.exports.findAll = (req, res, next) => {
  User
  .findAll()
  .then(users => {
    res.status(200).send(users);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  const user = req.body;

  Promise.resolve()
  .then(() => {
    if (req.user.id.toString() !== req.params.id && req.user.role !== "admin") {
      throw new errors.ForbiddenError("Missing privileges to edit User.");
    } else if (req.user.id.toString() === req.params.id && !user.password) {
      throw new errors.BadRequestError("No password supplied.");
    } else if (req.user.id.toString() === req.params.id && user.newPassword && user.newPassword.length < 8) {
      throw new errors.BadRequestError("New password is under 8 characters.");
    } else {
      return User.findOne({ id: req.params.id });
    }
  })
  .then(foundUser => {
    if (!foundUser) {
      throw new errors.NotFoundError("No User found.");
    } else if (user.password && !passwordHelper.comparePassword(user.password, foundUser.passwordHash)) {
      throw new errors.AuthenticationError("Wrong password.");
    }
    const strippedUser = Object.assign({}, user);
    if (req.user.id.toString() === req.params.id) {
      delete strippedUser.role;
      if (user.newPassword) {
        strippedUser.passwordHash = passwordHelper.hashPassword(user.newPassword);
      }
    }
    return User.update(strippedUser, { id: req.params.id });
  })
  .then(rows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  User
  .findOne({ email: req.body.email })
  .then(foundUser => {
    if (foundUser) {
      throw new errors.BadRequestError("User already exists with the same email.");
    } else {
      req.body.passwordHash = passwordHelper.hashPassword(req.body.password);
      return User.saveOne(req.body);
    }
  })
  .then(savedUser => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.deleteOne = (req, res, next) => {
  User
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.sendStatus(200);
    } else {
      throw new errors.NotFoundError("No user found.");
    }
  })
  .catch(err => next(err));
};

module.exports.loginUser = (req, res, next) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      throw new errors.NotFoundError("No user found with given email.");
    } else if (!passwordHelper.comparePassword(req.body.password, user.passwordHash)) {
      throw new errors.AuthenticationError("Incorrect password.");
    } else {
      const payload = TokenGenerator.generateLoginPayload(user);
      const token = TokenGenerator.generateToken(payload);
      user.passwordHash = undefined;
      res.status(200).send({
        user,
        token,
        expires: payload.expires,
      });
    }
  })
  .catch(err => next(err));
};
