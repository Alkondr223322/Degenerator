const express = require('express');
const { register, login, pwdChange, pwdForgot} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/pwdChange', pwdChange);
router.post('/pwdForgot', pwdForgot);

module.exports = router;