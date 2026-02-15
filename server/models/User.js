const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      maxLength: 65
    },
    balance: {
      type: Number,
      default: 0
    },
    projects: [
      {
        name: String,
        objID: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      },
    ]
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt();
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  console.log('input pwd: ' + password)
  console.log('DB pwd: ' + this.password)
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('rehashed pwd: ' + hashedPassword)
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;