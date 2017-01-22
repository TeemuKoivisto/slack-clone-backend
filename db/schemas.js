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
});

const UserSchema = new Schema({
  created: { type: Date, default: Date.now },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  nick: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = {
  Message: mongoose.model("Message", MessageSchema),
  Room: mongoose.model("Room", RoomSchema),
  User: mongoose.model("User", UserSchema),
};
