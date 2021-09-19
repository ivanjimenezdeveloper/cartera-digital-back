const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  saldo: { type: Number, required: true },
});

const User = model("User", UserSchema, "user");

module.exports = User;
