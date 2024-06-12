const express = require('express');
const router = express.Router();

const post_controller = require("../controllers/postController")

router.get('/', post_controller.posts_get)

router.get('/:id', post_controller.post_get)

router.post('/', post_controller.post_post)

router.put('/:id', post_controller.post_put)

router.delete('/:id', post_controller.post_delete)

router.get('/:id/comments', post_controller.comments_get)

router.post('/:id/comments', post_controller.comments_post)

router.delete('/:id/comments/:commentId', post_controller.comment_delete)


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
