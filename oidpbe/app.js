const express = require("express");
const app = express();
const cors = require("cors");

const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

app.use(
  cors({
    origin: process.env.APP_URL,
  })
);
app.use(express.json());
app.use(logger);
// app.use(logger, auth) - így is lehetne..

// todo: MongoDB connect -> Done in server.js

const dashboardRouter = require("./routes/dashboard");
app.use("/api/dashboards", dashboardRouter);

const userRouter = require("./routes/user");
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!👋🌎");
});

app.get("/api/public", (req, res) => {
  console.log("public");
  res.send("Hello Public!👋");
});

app.get("/api/private", auth({ block: true }), (req, res) => {
  console.log("private");
  res.send("Hello Private!👋" + res.locals.userId);
});

app.get("/api/prublic", auth({ block: false }), (req, res) => {
  if (!res.locals.userId) return res.send("hello world public");
  res.send(`Hello prublic, your id is: ${res.locals.userId}`);
});

// errorHandler mindig utolsóként kell meghívni
app.use(errorHandler);

module.exports = app