const express = require('express');
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// get all
exports.users_get = asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find()
      res.json(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  });
  
  exports.user_get = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
      res.json(user)
    } catch (err) {
      return res.status(404).json({ message: "Cannt find user "})
    }
  });
  
  exports.user_post = asyncHandler(async (req, res, next) => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password
    })
    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err){
      res.status(400).json({ message: err.message })
    }
  });
  
/*   router.put('/:id', (req, res) => {
    return res.send('PUT HTTP method on user resource');
  });
  
  router.delete('/:id', (req, res) => {
    return res.send('DELETE HTTP method on user resource');
  });
   */