const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const secret = require("./../../config/siteconfigs").phrases.secret;

// User Model
const User = require("./../models/User");

// Validation
const {
  validateRegisterInput,
  validateLoginInput
} = require("./../validation/User");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email =
        "There is an existing member associated with this email address.";
      return res.status(400).json(errors);
    }
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    });
    User.findOne({ username: newUser.username }).then(user => {
      if (user) {
        errors.username =
          "There is an existing member using this Username. Please select another one.";
        return res.status(400).json(errors);
      } else {
        newUser
          .save()
          .then(user => {
            const token = user.generateToken();
            res.json(token);
          })
          .catch(errors => {
            let customErrors = {}; // Custom Errors are for login from http testers
            Object.keys(errors.errors).map(err => {
              customErrors[err] = errors.errors[err].message;
            });
            !Object.keys(customErrors).length === 0
              ? res.status(400).json(errors)
              : (errors = customErrors);
            res.status(400).json(errors);
          });
      }
    });
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        errors.email = "User not found.";
        return res.status(404).json(errors);
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) {
            return res.status(422).json(err);
          } else if (!isMatch) {
            errors.password = "Password Incorrect";
            return res.status(422).json(errors);
          } else {
            const token = user.generateToken();
            res.json(token);
          }
        });
      }
    })
    .catch(errors => {
      let customErrors = {}; // Custom Errors are for login from http testers
      Object.keys(errors.errors).map(err => {
        customErrors[err] = errors.errors[err].message;
      });
      !Object.keys(customErrors).length === 0
        ? res.status(422).json(errors)
        : res.status(422).json(customErrors);
    });
});

module.exports = router;
