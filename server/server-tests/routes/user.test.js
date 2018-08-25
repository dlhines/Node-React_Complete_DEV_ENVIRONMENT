require("cache-require-paths");
const expect = require("chai").expect;
const request = require("supertest");
const jwt = require("jwt-simple");
const mongoose = require("mongoose");
const config = require("./../../../config/siteconfigs");

const bcrypt = require("bcrypt-nodejs");
const ObjectID = require("mongodb").ObjectID;

const User = require("./../../models/User");
var app = require("./../../server").app;

beforeEach(done => {
  return done();
});

afterEach(done => {
  mongoose.connection.db.collection("users").remove();
  return done();
});

let user = {
  email: "test@test.net",
  password: "123123123",
  username: "usernametest"
};

describe("User Routes ('./server/routes/User.js') : Register / Login", () => {
  describe("Register -> ", () => {
    describe("Existing Email Test", () => {
      it("Should return 'There is an existing member associated with this email address.'", done => {
        User(user).save(); // Saving original object from up above
        request(app)
          .post("/api/user/register")
          .send(user) // Using the exact same object as just saved
          .expect(400)
          .expect({
            email:
              "There is an existing member associated with this email address."
          })
          .end(done);
      });
    });
    describe("Existing User Name Test", () => {
      it("Should return 'There is an existing member using this Username. Please select another one.'", done => {
        // Save original object to database
        User(user).save();

        // Modified email from original 'user' object to test for same username
        let userName = {
          ...user,
          email: "tested@test.net",
          username: "usernametest"
        };
        request(app)
          .post("/api/user/register")
          .send(userName)
          .expect(400)
          .expect({
            username:
              "There is an existing member using this Username. Please select another one."
          })
          .end(done);
      });
    });
    describe("User Name Field Verification: (1) Emtpy Field (2) Can contain no less than 3 characters (3) nor, more than 30 characters (4) Letters Only", () => {
      it("(1) Testing with ' ' as empty field error", done => {
        let user0 = {
          ...user,
          username: ""
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ username: "Username field is required." })
          .end(done);
      });
      it("(2) Testing with 'ab' for 3 minimum characters error", done => {
        let user0 = {
          ...user,
          username: "ab"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ username: "Username must be between 3 & 30 characters." })
          .end(done);
      });
      it("(3) Testing with 'ab' for 30 maximum characters error", done => {
        let user0 = {
          ...user,
          username: "abababababababababababababababab"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ username: "Username must be between 3 & 30 characters." })
          .end(done);
      });
      it("(4) Testing with 'hello@#there' for special characters error", done => {
        let user0 = {
          ...user,
          username: "hello@#there"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({
            username:
              "Usernames can only contain '.' and '_' special characters"
          })
          .end(done);
      });
    });
    describe("Email Field Verification: (1) Emtpy Field (2) Check for invalid emails without @ (3) Check for invalid emails without .", () => {
      it("(1) Testing with ' ' as empty field error", done => {
        let user0 = {
          ...user,
          email: ""
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
      it("(2) Testing with 'meyou.com' for invalid email error", done => {
        let user0 = {
          ...user,
          email: "meyou.com"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
      it("(3) Testing with 'me@youcom' for invalid email error", done => {
        let user0 = {
          ...user,
          email: "me@youcom"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
    });
    describe("Password Field Verification: (1) Emtpy field (same error as 2 & 3) (2) Can contain no less than 8 characters (3) nor, more than 16 characters", () => {
      it("(1) Testing with ' ' as empty field error", done => {
        let user0 = {
          ...user,
          password: " "
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ password: "Password field is required." })
          .end(done);
      });
      it("(2) Testing with '1234567 ' for minimum of 8 characters", done => {
        let user0 = {
          ...user,
          password: "1234567"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ password: "Password must be between 8 & 16 characters." })
          .end(done);
      });
      it("(3) Testing with ' 123456789012345467' for maximum of 16 characters", done => {
        let user0 = {
          ...user,
          password: "123456789012345467"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ password: "Password must be between 8 & 16 characters." })
          .end(done);
      });
    });
    describe("Register Route Success", () => {
      beforeEach(done => {
        User.remove({}).then(done());
      });
      it("should save user to database (register user)", done => {
        request(app)
          .post("/api/user/register")
          .send(user)
          .expect(200)
          .end(done);
      });
      it("should receive a token, use token to match email, password, and username from returned value to 'user'", done => {
        request(app)
          .post("/api/user/register")
          .send(user)
          .expect(200)
          .expect(res => {
            const token = jwt.decode(
              res.text.slice(1, -1),
              config.phrases.secret
            );
            User.findById(token.id).then(result => {
              expect(result.email).to.equal(user.email);
              result.comparePassword(user.password, (err, isMatch) => {
                expect(isMatch).to.equal(true);
              });
              expect(result.username).to.equal(user.username);
            });
          })
          .end(done);
      });
    });
  });
  describe("Login -> ", () => {
    describe("Invalid Email Test", () => {
      it("should return 'User not found.' when using empty database", done => {
        request(app)
          .post("/api/user/login")
          .send(user)
          .expect(404)
          .expect({ email: "User not found." })
          .end(done);
      });
    });
    describe("Wrong Password Test", () => {
      it("should return 'Password Incorrect' when using '123123123123' ", done => {
        User(user).save();
        let userPassword = {
          ...user,
          password: "123123123123"
        };
        request(app)
          .post("/api/user/login")
          .send(userPassword)
          .expect(422)
          .expect({ password: "Password Incorrect" })
          .end(done);
      });
    });
    describe("Password Field Verification: (1) Emtpy field (same error as 2 & 3) (2) Can contain no less than 8 characters (3) nor, more than 16 characters", () => {
      it("(1) Testing with ' ' as empty field error", done => {
        let user0 = {
          ...user,
          password: ""
        };
        request(app)
          .post("/api/user/login")
          .send(user0)
          .expect(400)
          .expect({ password: "Password field is required." })
          .end(done);
      });
      it("(2) Testing with '1234567 ' for minimum of 8 characters", done => {
        let user0 = {
          ...user,
          password: "1234567"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ password: "Password must be between 8 & 16 characters." })
          .end(done);
      });
      it("(3) Testing with ' 123456789012345467' for maximum of 16 characters", done => {
        let user0 = {
          ...user,
          password: "123456789012345467"
        };
        request(app)
          .post("/api/user/register")
          .send(user0)
          .expect(400)
          .expect({ password: "Password must be between 8 & 16 characters." })
          .end(done);
      });
      describe("Register Route Success", () => {});
    });
    describe("Email Field Verification: (1) Emtpy Field (2) Check for invalid emails without @ (3) Check for invalid emails without .", () => {
      it("(1) Testing with ' ' as empty field error", done => {
        let user0 = {
          ...user,
          email: ""
        };
        request(app)
          .post("/api/user/login")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
      it("(2) Testing with 'meyou.com' for invalid email error", done => {
        let user0 = {
          ...user,
          email: "meyou.com"
        };
        request(app)
          .post("/api/user/login")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
      it("(3) Testing with 'me@youcom' for invalid email error", done => {
        let user0 = {
          ...user,
          email: "me@youcom"
        };
        request(app)
          .post("/api/user/login")
          .send(user0)
          .expect(400)
          .expect({ email: "Email is invalid." })
          .end(done);
      });
    });
    describe("Login Route Success", () => {
      beforeEach(done => {
        User.remove({}).then(
          request(app)
            .post("/api/user/register")
            .send(user)
            .expect(200)
            .end(done)
        );
      });
      it("should login user, receive a token, use token to match email, password, and username from returned value to 'user'", done => {
        request(app)
          .post("/api/user/login")
          .send(user)
          .expect(200)
          .expect(res => {
            const token = jwt.decode(
              res.text.slice(1, -1),
              config.phrases.secret
            );
            User.findById(token.id).then(result => {
              expect(result.email).to.equal(user.email);
              result.comparePassword(user.password, (err, isMatch) => {
                expect(isMatch).to.equal(true);
              });
              expect(result.username).to.equal(user.username);
            });
          })
          .end(done);
      });
    });
  });
});
