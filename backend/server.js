require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.APP_URL,
  })
);
app.use(express.json());
app.use(logger);
// app.use(logger, auth) - így is lehetne..

app.get("/", (req, res) => {
  res.send("Hello World! 👋🌎");
});

app.get("/api/public", (req, res) => {
  console.log("public");
  res.send("Hello Public! 👋🌎");
});

app.get("/api/private", auth({block: true}), (req, res) => {
  console.log("private");
  res.send("Hello Private!👋" + res.locals.userId);
});

app.get("/api/prublic", auth({block: false}), (req, res) => {
  if (!res.locals.userId) return res.send("hello world public");
  res.send(`Hello prublic, your id is: ${res.locals.userId}`);
});

// errorHandler mindig utolsóként kell meghívni 
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
