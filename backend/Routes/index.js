
const router  = require("express").Router();
const userController = require('../Controllers/user');

// Register a new User
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);


module.exports = router;