const User = require("../model/user");
const httpModule = require("../utils/http");
const http = httpModule();
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const config = {
  google: {
    client_id: "423125049963-vnhlm59vvirdjsquu0efhqvq5u91orks.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: "http://localhost:3000/callback",
    token_endpoint: "https://oauth2.googleapis.com/token",
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

  const response = await http.post(config[provider].token_endpoint, {
    code: code,
    client_id: config[provider].client_id,
    client_secret: config[provider].client_secret,
    redirect_uri: config[provider].redirect_uri,
    grant_type: "authorization_code",
    scope: "openid"
  });

  if (!response) return res.sendStatus(500);
  if (response.status != 200) return res.sendStatus(401);

  const decoded = jwt.decode(response.data.id_token);

  if (!decoded) return res.sendStatus(500);

  const key = "providers." + provider;
  const user = await User.findOneAndUpdate(
    { [key]: decoded.sub },
    { providers: { [provider]: decoded.sub } },
    { new: true }
  );

  const sessionToken = jwt.sign(
    { userId: user.id, provider: user.providers },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({sessionToken});

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
