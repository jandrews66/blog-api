const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const multer = require('multer');
let path = require('path');
const { v4: uuidv4 } = require('uuid');

//middleware to verify jwt 

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

//multer middleware 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

exports.posts_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate("user").populate("comments");
    const postsWithCommentCount = posts.map(post => ({
        ...post.toObject(),
        commentCount: post.comments.length
    }));
    res.json(postsWithCommentCount);
});

exports.post_get = asyncHandler(async (req, res) => {
      const post = await Post.findById(req.params.id).populate("user");
      res.json(post);
});
  

exports.post_post = [
    verifyToken,
    (req, res, next) => {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden' });
            } else {
                req.authData = authData;
                next();
            }
        });
    },
    upload.single('img'),
    asyncHandler(async (req, res) => {
        const filename = req.file ? req.file.filename : "placeholder-image.jpeg";

        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            user: req.authData.user, // Use authData for user
            isPublished: req.body.isPublished,
            img: filename,
            timestamp: new Date()
        });
        const newPost = await post.save();
        res.status(201).json(newPost);
    })
];

exports.post_put = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        } else {
          req.authData = authData; // Store auth data in request object
          next(); // Proceed to the next middleware
        }
      });
    },
    upload.single('img'),
    asyncHandler(async (req, res) => {
        let filename;
        if (req.file) {
            filename = req.file.filename;
        } else if (req.body.existingImg) {
            filename = req.body.existingImg;
        } else {
            filename = 'placeholder-image.jpeg'; // Fallback to placeholder image if necessary
        }
        const update = {
            title: req.body.title,
            content: req.body.content,
            user: req.body.user,
            isPublished: req.body.isPublished,
            img: filename,
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
      jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
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
    await Post.findByIdAndUpdate(req.params.id, { $push: { comments: newComment._id } });

    res.status(201).json(newComment);
});

exports.comment_delete = [
    verifyToken,
    (req, res, next) => {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
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

