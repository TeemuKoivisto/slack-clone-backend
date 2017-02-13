const mongoose = require("./db_connection");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  created: { type: Date, default: Date.now },
  content: { type: String, required: true },
  authorNick: { type: String, required: true },
  User: { type: Schema.Types.ObjectId, ref: "User" },
  Room: { type: Schema.Types.ObjectId, ref: "Room" },
});

const RoomSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const UserSchema = new Schema({
  created: { type: Date, default: Date.now },
  firstname: { type: String },
  lastname: { type: String },
  nick: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String },
  role: { type: String, required: true },
  online: { type: Boolean, required: true, default: true },
});

module.exports = {
  Message: mongoose.model("Message", MessageSchema),
  Room: mongoose.model("Room", RoomSchema),
  User: mongoose.model("User", UserSchema),
};
