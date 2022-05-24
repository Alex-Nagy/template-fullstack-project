require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT;

const myBusinessLogic = (req, res, next) => {
  if (!res.locals.userId) {
    return res.sendStatus(401);
  }
  console.log("Logic running...");
  res.status(200).json("OK👌");
  next();
};

app.use(
  cors({
    origin: process.env.APP_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(logger);
app.use(auth);
app.use(myBusinessLogic);

app.get("/api/logic1", (req, res) => {
  console.log("logic 1");
  res.send("Hello World! 1 👋🌎");
});
app.get("/api/logic2", (req, res) => {
  console.log("logic 2");
  res.send("Hello World! 2 👋🌎");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
