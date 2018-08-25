require("../server/config/db");
require("cache-require-paths");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
require("./config/connect");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const user = require("./routes/User");
const profile = require("./routes/Auth/Profile");
const nonAuthPages = require("./routes/NonAuth/Pages");
app.use("/api/user", user);
app.use("/api/user/profile", profile);
app.use("/", nonAuthPages);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server on: ", port);
});

module.exports.app = app;
