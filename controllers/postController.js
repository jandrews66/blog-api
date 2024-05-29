const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");

exports.posts_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate("user");
    res.json(posts);
});

exports.post_get = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("user");
    res.json(post);
});

exports.post_post = asyncHandler(async (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
        timestamp: new Date()
    });
    const newPost = await post.save();
    res.status(201).json(newPost);
});

exports.post_put = asyncHandler(async (req, res, next) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
        timestamp: new Date(),
        _id: req.params.id,
    });
    await Post.findByIdAndUpdate(req.params.id, newPost, {});
    res.status(201).json(newPost);
});

exports.post_delete = asyncHandler(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted post" });
});

exports.comments_get = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.id });
    res.json(comments);
});

exports.comments_post = asyncHandler(async (req, res, next) => {
    const comment = new Comment({
        name: req.body.name,
        message: req.body.message,
        post: req.params.id,
        timestamp: new Date()
    });
    const newComment = await comment.save();
    res.status(201).json(newComment);
});
