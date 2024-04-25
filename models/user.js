const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 20 },
    last_name: { type: String, required: true, maxLength: 20 },
    username: { type: String, required: true, maxLength: 20 },
    password: { type: String, required: true },
    isAuthor: { type: Boolean, default: false }
});

// Virtual for book's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);