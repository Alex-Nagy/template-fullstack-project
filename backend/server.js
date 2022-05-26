require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

// todo: MongoDB connect
mongoose.connect(process.env.DB);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DB"));

const dashboardRouter = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRouter);

const userRouter = require("./routes/user");
app.use("/api/login", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World! 👋🌎");
});

app.get("/api/public", (req, res) => {
  console.log("public");
  res.send("Hello Public! 👋🌎");
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
