const env = process.env.NODE_ENV || "development";

if (env === "development") {
  process.env.MONGODB_URI = "mongodb://localhost:27018/node-react-dev";
} else if (env === "test") {
  process.env.MONGODB_URI = "mongodb://localhost:27018/node-react-dev_TESTING";
}
