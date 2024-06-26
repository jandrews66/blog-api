const express = require('express');
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const Post = require('../models/post');

// get all
exports.users_get = asyncHandler(async (req, res, next) => {
      const users = await User.find()
      res.json(users)
  });
  
  exports.user_get = asyncHandler(async (req, res, next) => {
      const user = await User.findById(req.params.id)

      if (!user) {
        res.status(404).json({ message: "Cannot find user" });
        return;
      }
      const posts = await Post.find({ user: req.params.id })

      res.json({user, posts});
    });
  
  exports.user_post = asyncHandler(async (req, res, next) => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password
    })
      const newUser = await user.save()
      res.status(201).json(newUser)
  });
  