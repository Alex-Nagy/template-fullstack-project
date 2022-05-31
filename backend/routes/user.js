const User = require("../model/user");
const httpModule = require("../utils/http");
const http = httpModule();
const router = require("express").Router();

const config = {
  google: {
    client_id: "",
    client_secret: "",
    redirect_uri: "",
    token_endpoint: "",
    grant_type: "",
  },
  facebook: {
    client_id: "", // or appId
    client_secret: "", // or appSecret
    redirect_uri: "",
    token_endpoint: "",
    grant_type: "",
  },
};

router.post("/api/login", async (req, res) => {
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
  });

  if (!response) return res.sendStatus(500);
  if (response.status != 200) return res.sendStatus(401);

  const decoded = jwt.decode(response.data.id_token)

  if(!decoded) return res.sendStatus(500)

  const key = 'providers.' + provider
  const user = await User.find({[key]: decoded.sub})  // hmm

});

// recieve google code -> get google token -> get userID
// googleId exists ? send jwt token : create user

router.get("/", async (req, res) => {
  // try
  res.status(418).json("test👋");
});

module.exports = router;
