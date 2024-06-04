const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController")

// get all
router.get('/', user_controller.users_get)

router.get('/:id', user_controller.user_get)

router.post('/', user_controller.user_post)

router.post('/:id/create', user_controller.create_post)

module.exports = router;
