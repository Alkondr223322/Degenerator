const User = require('../models/User');

// Add funds to an existing user
const addFunds = async (req, res, next) => {
    const { payAmount, uID } = req.body;
    try {
      const user = await User.findOne({ _id: uID });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.balance = +user.balance + +payAmount
      user.save()
      // const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      //   expiresIn: '1 hour'
      // });
      // res.json({ token });
      res.json({ message: user.balance });
    } catch (error) {
      next(error);
    }
  };
// Take funds from an existing user
  const reduceFunds = async (req, res, next) => {
    const { reduceAmount, uID } = req.body;
    try {
      const user = await User.findOne({ _id: uID });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.balance = +user.balance - +reduceAmount
      user.save()
      // const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      //   expiresIn: '1 hour'
      // });
      // res.json({ token });
      res.json({ message: user.balance });
    } catch (error) {
      next(error);
    }
  };

module.exports = { addFunds, reduceFunds };