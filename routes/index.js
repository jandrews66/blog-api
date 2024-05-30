const express = require('express');
const router = express.Router();

const index_controller = require("../controllers/indexController")

router.get('/', (req, res) => {
  return res.send('Received a GET HTTP method!!!!!!!!');
});

router.post('/', index_controller.login_post)

router.post('/signup', index_controller.signup_post)

router.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

router.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

module.exports = router;
