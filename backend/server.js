require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

var corsOptions = {
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200,
};

const myLogger = (req, res, next) => {
  console.log("logging...");
  next();
};

const myAuth = (req, res, next) => {
  console.log("Authenticating...");
  const userId = 1;
  res.locals.userId = userId;
  next();
};

const myBusinessLogic = (req, res, next) => {
  if (!res.locals.userId) {
    return res.sendStatus(401);
  }
  console.log("Logic running...");
  res.status(200).json("OK👌");
  next();
};

app.use(myLogger);
app.use(myAuth);
app.use(myBusinessLogic);
/* app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!👋🌎");
});
 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
