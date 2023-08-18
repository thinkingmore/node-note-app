const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String
  },
  displayName: {
    type: String,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String 
  },
  profileImage: {
    type: String 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password
UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);


