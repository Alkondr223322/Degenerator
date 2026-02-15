const express = require('express');
const { authenticate } = require('../middlewares/auth');
const {addFunds, reduceFunds} = require('../controllers/user')

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});
router.post('/addFunds', addFunds);
router.post('/reduceFunds', reduceFunds);

module.exports = router;