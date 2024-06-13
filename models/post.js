const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 30 },
    content: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    img: {type: String}
});

// Virtual for book's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);