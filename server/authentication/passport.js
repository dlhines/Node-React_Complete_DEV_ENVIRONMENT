const passport = require("passport");
const { User } = require("./../models/User");
const secret = require("./../../config/siteconfigs").phrases.secret;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: secret
};

const jwtAuth = new JwtStrategy(JwtOptions, function(payload, done) {
  User.findById(payload.id, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtAuth);
