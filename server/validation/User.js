const Validator = require("validator");
const emailValidator = require("email-validator");
const isEmpty = require("./empty");

module.exports.validateLoginInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  if (!emailValidator.validate(data.email)) {
    errors.email = "Email is invalid.";
  }

  // Password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  } else if (!Validator.isLength(data.password, { min: 8, max: 16 })) {
    errors.password = "Password must be between 8 & 16 characters.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports.validateRegisterInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Username
  if (!Validator.isLength(data.username, { min: 3, max: 30 })) {
    errors.username = "Username must be between 3 & 30 characters.";
  }

  if (/[/!@#$%^&*(),\\\\?":{}|<>]/g.test(data.username)) {
    errors.username =
      "Usernames can only contain '.' and '_' special characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required.";
  }

  // Email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  if (!emailValidator.validate(data.email)) {
    errors.email = "Email is invalid.";
  }

  // Password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  } else if (!Validator.isLength(data.password, { min: 8, max: 16 })) {
    errors.password = "Password must be between 8 & 16 characters.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
