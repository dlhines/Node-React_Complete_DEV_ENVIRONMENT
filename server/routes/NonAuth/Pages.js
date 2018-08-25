const express = require("express");
const router = express.Router();

router.get("/frontpage", (req, res) => {
  res.send("Front Page...");
});

module.exports = router;
