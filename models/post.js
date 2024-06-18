const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    img: {type: String},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

// Export model
module.exports = mongoose.model("Post", PostSchema);