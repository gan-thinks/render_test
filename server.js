const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// OAuth constants
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/", (req, res) => {
  res.send("Hello! OAuth working.");
});

app.get("/auth/zoho", (req, res) => {
  const scope = "ZohoCRM.modules.ALL";
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("No code found.");

  try {
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const accessToken = response.data.access_token;
    res.send(`Access Token: ${accessToken}`);
  } catch (err) {
    res.status(500).send("Error getting access token: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
