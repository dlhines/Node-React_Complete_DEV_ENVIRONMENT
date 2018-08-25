const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jwt-simple");
const emailValidator = require("email-validator");
const config = require("./../../config/siteconfigs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email field is required."],
    trim: true,
    lowercase: true,
    validate: {
      validator: email => {
        return emailValidator.validate(email);
      },
      message: "Email is invalid."
    }
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password field is required."],
    minlength: [8, "Password must be between 8 & 16 characters."],
    maxlength: [16, "Password must be between 8 & 16 characters."]
  },
  username: {
    type: String,
    trim: true,
    required: [true, "Username field is required."],
    minlength: [3, "Username must be between 3 & 30 characters."],
    maxlength: [30, "Username must be between 3 & 30 characters."],
    validate: {
      validator: username => {
        return !/[/!@#$%^&*(),?":{}|<>]/g.test(username);
      },
      message: "Usernames can only contain '.' and '_' special characters"
    }
  }
});

userSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(config.phrases.salt, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

userSchema.methods.generateToken = function(cb) {
  const user = this;
  const timestamp = new Date().getTime();
  const token = jwt.encode(
    { id: user._id, username: user.username, iat: timestamp },
    config.phrases.secret
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
