const express = require('express');
const asyncHandler = require("express-async-handler");
const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')

exports.login_post = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred during authentication" });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "An error occurred during login" });
            }
      // Generate JWT
        const token = jwt.sign({ user }, 'secretkey', { expiresIn: '1h' }); // Replace 'secretkey' with real secret key

      // Return the token and user info
        return res.json({ token, user });
        });
    })(req, res, next); 

  });
  
  exports.signup_post = [
    body("first_name", "First name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("last_name", "Last name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("username", "Username must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("password", "Password must be at least 8 characters long.")
      .isLength({ min: 8 }),
    body("confirm_password", "Passwords must match").custom((value, { req }) => {
      return value === req.body.password;
    }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          console.log("Error hashing password:", err);
          return next(err);
        }
        try {
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: hashedPassword,
          });
          const result = await user.save();
          res.status(201).json(result); // Send JSON response on success
          
        } catch (err) {
          console.log("Error saving user:", err);
          return next(err);
        }
      });
    })
  ];