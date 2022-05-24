const auth = (req, res, next) => {
    console.log("Authenticating...");
    const userId = 1;
    res.locals.userId = userId;
    next();
  };

  module.exports = auth
  