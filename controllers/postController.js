const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')

exports.posts_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate("user");
    res.json(posts);
});

exports.post_get = asyncHandler(async (req, res) => {
      const post = await Post.findById(req.params.id).populate("user");
      res.json(post);
});
  

exports.post_post = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData; // Store auth data in request object
          next(); // Proceed to the next middleware
        }
      });
    },
    asyncHandler(async (req, res, next) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            user: req.body.user,
            isPublished: req.body.isPublished,
            timestamp: new Date()
        });
        const newPost = await post.save();
        res.status(201).json(newPost);
    })
] 

exports.post_put = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData; // Store auth data in request object
          next(); // Proceed to the next middleware
        }
      });
    },
    asyncHandler(async (req, res) => {
        const update = {
            title: req.body.title,
            content: req.body.content,
            user: req.body.user,
            isPublished: req.body.isPublished,
            timestamp: new Date()
        };
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    })
];

exports.post_delete = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData; // Store auth data in request object
          next(); // Proceed to the next middleware
        }
      });
    },
    asyncHandler(async (req, res, next) => {
        const post = await Post.findByIdAndDelete(req.params.id);
        
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;  
        }
        res.json({ message: "Deleted post" });
    })
] 


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

exports.comment_delete = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData; // Store auth data in request object
          next(); // Proceed to the next middleware
        }
      });
    },
    asyncHandler(async (req, res, next) => {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;  
        }
        res.json({ message: "Deleted comment" });
    })
] 

function verifyToken(req, res, next){
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        //seperate token from header
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403)
    }
}