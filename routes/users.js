const express = require('express');
const router = express.Router();
const User = require('../models/user')

// get all
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (err) {
    return res.status(404).json({ message: "Cannt find user "})
  }
});

router.post('/', async (req, res) => {
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

router.put('/:id', (req, res) => {
  return res.send('PUT HTTP method on user resource');
});

router.delete('/:id', (req, res) => {
  return res.send('DELETE HTTP method on user resource');
});


module.exports = router;
