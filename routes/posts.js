const express = require('express');
const router = express.Router();
const Post = require('../models/post')


router.get('/', async (req, res) => {
    try {
      const posts = await Post.find()
      res.json(posts)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      res.json(post)
    } catch (err) {
      return res.status(404).json({ message: "Cannot find post "})
    }
  });

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    user: req.body.user,
    timestamp: new Date()
  })
  try {
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (err){
    res.status(400).json({ message: err.message })
  }
});

router.put('/:id', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
        timestamp: new Date(),
        _id: req.params.id,
      })
      try {
        await Post.findByIdAndUpdate(req.params.id, newPost, {});
        res.status(201).json(newPost)
      } catch (err){
        res.status(400).json({ message: err.message })
      }});

router.delete('/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.json({ message: "Deleted post"})
      } catch (err) {
        return res.status(404).json({ message: "Cannot find post "})
      }});

/* router.get('/:postId', (req, res) => {
    return res.send(`Get HTTP method on posts/${req.params.postId} resource`);
});

router.post('/:postId', (req, res) => {
    return res.send(`Post HTTP method on posts/${req.params.postId} resource`);
});

router.put('/:postId', (req, res) => {
    return res.send(`PUT HTTP method on posts/${req.params.postId} resource`);
});

router.delete('/:postId', (req, res) => {
    return res.send(`Delete HTTP method on posts/${req.params.postId} resource`);
}); */
module.exports = router;
