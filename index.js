// index.js
const express = require('express');
const app = express();

app.get('/oauth/redirect', (req, res) => {
  const code = req.query.code;
  console.log('AUTH CODE:', code);
  res.send(`Authorization Code received: ${code}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});
