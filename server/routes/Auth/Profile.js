const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportAuthenticate = require("../../authentication/passport");

const requireAuth = passport.authenticate("jwt", { session: false });

router.post("/dashboard", requireAuth, (req, res) => {
  res.json(req.user.id);
});

module.exports = router;
