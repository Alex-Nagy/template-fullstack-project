const jwt = require("jsonwebtoken");

const auth = (middlewareParams) => (req, res, next) => {
  // console.log("Authenticating...");
  const token = req.header("authorization");
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error && middlewareParams.block) return res.sendStatus(401);
    res.locals.user = user;
    next();
  });
};

module.exports = auth;

// higher order function () => () => {}
