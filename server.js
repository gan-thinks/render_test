const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Route to confirm the server is live
app.get('/', (req, res) => {
  res.send('Zoho Backend is running');
});

// === Route for Redirect URI ===
app.get('/redirect', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code not found');
  }

  try {
    const tokenResponse = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = tokenResponse.data;
    console.log('✅ Access Token:', data.access_token);
    console.log('🔁 Refresh Token:', data.refresh_token);

    // In production, save tokens in DB or secure storage
    res.send(`
      <h2>✅ Zoho Auth Successful</h2>
      <p><strong>Access Token:</strong> ${data.access_token}</p>
      <p><strong>Refresh Token:</strong> ${data.refresh_token}</p>
    `);
  } catch (error) {
    console.error('❌ Token exchange failed:', error.response?.data || error.message);
    res.status(500).send('Token exchange failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
