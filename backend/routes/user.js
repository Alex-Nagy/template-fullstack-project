const User = require("../model/user");
const http = require("../utils/http");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const config = require('../app.config')

router.post("/login", auth({ block: false }), async (req, res) => {
  const payload = req.body;
  if (!payload) return res.sendStatus(400); // need a req body

  const code = payload.code;
  const provider = payload.provider;

  if (!code || !provider) return res.sendStatus(400); // not enough data - should have code & provider
  if (!Object.keys(config.auth).includes(provider)) return res.sendStatus(400); // if config.auth{ doestn't have provider }

  const response = await http.post(
    config.auth[provider].token_endpoint,
    {
      code: code,
      client_id: config.auth[provider].client_id,
      client_secret: config.auth[provider].client_secret,
      redirect_uri: config.auth[provider].redirect_uri,
      grant_type: "authorization_code",
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response) return res.sendStatus(500);
  if (response.status != 200) return res.sendStatus(401);

  let openId; // github doesnt have openId
  const onlyOauth = !response.data.id_token;
  if (onlyOauth) {
    // let accesstoken = response.data.split("=")[1].split("&")[0]; // csak az = utáni és a & előtti részt szedjuk ki
    let accesstoken = response.data.access_token;
    const userResponse = await http.post(
      config.auth[provider].user_endpoint,
      {},
      {
        headers: {
          authorization: "Bearer " + accesstoken,
        },
      }
    );
    if (!userResponse) return res.sendStatus(500);
    if (userResponse.status != 200) return res.sendStatus(401);
    const id = config.auth[provider].user_id;
    openId = userResponse.data.id;
  } else {
    const decoded = jwt.decode(response.data.id_token);
    if (!decoded) return res.sendStatus(500);
    openId = decoded.sub;
  }

  // find user from db
  const key = "providers." + provider;
  const user = await User.findOne({ [key]: openId });

  if (user && res.locals.user?.providers) {
    user.providers = { ...user.providers, ...res.locals.user.providers };
    user = await user.save()
  }

  // account merge előtt
  /*   const user = await User.findOneAndUpdate(
    { [key]: openId },
    { providers: { [provider]: openId } },
    { new: true, upsert: true }
  ); */

  // optional chaining - user?.id - same as => user ? user.id : null
  const sessionToken = jwt.sign(
    {
      userId: user?.id, // user.id from MongoDB == _id
      providers: user ? user.providers : { [provider]: openId },
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ sessionToken });

  // recieve google code -> get google token -> get userID
  // googleId exists ? send jwt token : create user
});

// Create user
router.post("/create", auth({ block: true }), async (req, res) => {
  // res.locals.user elérhető itt
  if (!req.body?.username) return res.sendStatus(400);
  const user = await User.create({
    username: req.body.username,
    providers: res.locals.user.providers,
  });

  const sessionToken = jwt.sign(
    {
      userId: user.id, // user.id from MongoDB == _id
      providers: user.providers,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ sessionToken });
});

module.exports = router;