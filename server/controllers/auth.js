const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const register = async (req, res, next) => {
  const { userName, userMail, userPassword } = req.body;
  // console.log(req.body)
  
  console.log("reg pwd: " + userPassword)
  if(userPassword.length < 8){
    return res.status(401).json({ message: 'Password must be at least 8 symbols long' });
  }
  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    console.log("hashedRegPwD: " + hashedPassword)
    const user = new User({ username: userName, email: userMail, password: hashedPassword });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error)
    if(error.code === 11000){
      return res.status(401).json({ message: 'User with this email or name already exists' });
    }else{
      next(error);
    }
    
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { userName, userPassword } = req.body;
  console.log(req.body)
  console.log(userName)
  console.log(userPassword)
  try {
    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(userPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id, userBalance: user.balance }, process.env.SECRET_KEY, {
      expiresIn: '1 hour'
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Change password of an existing user
const pwdChange = async (req, res, next) => {
  const { oldPassword, newPassword, uID} = req.body;
  try {
    const user = await User.findOne({ _id: uID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(oldPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword
    user.save()
    // const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    //   expiresIn: '1 hour'
    // });
    // res.json({ token });
    res.json({ message: 'Password change successful' });
  } catch (error) {
    next(error);
  }
};

// Change password of an existing user to a temporary password
const pwdForgot = async (req, res, next) => {
  const { userMail } = req.body;
  try {
    const user = await User.findOne({ email: userMail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    


    let newPassword = Math.random().toString(36).substring(2, 8)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword
    user.save()

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: userMail,
      subject: 'Your temporary password to [De]generator',
      text: 'You may now login using this temporary password: ' + newPassword
    };

    const mailBox = req.app.get('mailBox');
    mailBox.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'Your temporary password has been sent to your email' });
      }
    });
    // console.log(mailRes)
    // if(mailRes){
    //   res.json({ message: 'Your temporary password has been sent to your email' });
    // }else{
    //   
    // }
    
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, pwdChange, pwdForgot};