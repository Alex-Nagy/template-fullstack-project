const User = require("../model/user");
const httpModule = require("../utils/http");
const http = httpModule();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { json } = require("express");

const config = {
  google: {
    client_id:
      "423125049963-vnhlm59vvirdjsquu0efhqvq5u91orks.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: "http://localhost:3000/callback",
    token_endpoint: "https://oauth2.googleapis.com/token",
    user_endpoint: null,
    user_id: null,
  },
  github: {
    client_id: "25bae038e73fd4c55ce9",
    client_secret: "eabaa03ca00badbcb1211a9eb3ad12c5e613be7c",
    redirect_uri: "http://localhost:3000/callback/github",
    token_endpoint: "https://github.com/login/oauth/access_token",
    user_endpoint: "https://api.github.com/user",
    user_id: "id",
  },
  /* 
  facebook: {
    client_id: "", // or appId
    client_secret: "", // or appSecret
    redirect_uri: "",
    token_endpoint: "",
    grant_type: "",
  },
   */
};

router.post("/login", async (req, res) => {
  const payload = req.body;
  if (!payload) return res.sendStatus(400); // need a req body

  const code = payload.code;
  const provider = payload.provider;

  if (!code || !provider) return res.sendStatus(400); // not enough data - should have code & provider
  if (!Object.keys(config).includes(provider)) return res.sendStatus(400); // if config{ doestn't have provider }

  const response = await http.post(
    config[provider].token_endpoint,
    {
      code: code,
      client_id: config[provider].client_id,
      client_secret: config[provider].client_secret,
      redirect_uri: config[provider].redirect_uri,
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
    // let accesstoken = response.data.split("=")[1].split("&")[0];               // csak az = utáni és a & előtti részt szedjuk ki, sufni megoldas
    let accesstoken = response.data.access_token;
    const userResponse = await http.post(
      config[provider].user_endpoint,
      {},
      {
        headers: {
          authorization: "Bearer " + accesstoken,
        },
      }
    );
    if (!response) return res.sendStatus(500);
    if (response.status != 200) return res.sendStatus(401);
    const id = config[provider].user_id;
    openId = userResponse.data.id;
  } else {
    const decoded = jwt.decode(response.data.id_token);
    if (!decoded) return res.sendStatus(500);
    openId = decoded.sub;
  }

  // find user from db
  const key = "providers." + provider;
  const user = await User.findOneAndUpdate(
    { [key]: openId },
    { providers: { [provider]: openId } },
    { new: true, upsert: true }
  );

  const sessionToken = jwt.sign(
    { userId: user.id, provider: user.providers },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ sessionToken });

  /* 
  if (!user) {
    await User.create({
      providers: { [provider]: decoded.sub },
    });
  }

 */
  // recieve google code -> get google token -> get userID
  // googleId exists ? send jwt token : create user
  /* 
router.get("/", async (req, res) => {
  // try
  res.status(200).json("get all");
});
 */
});

module.exports = router;
