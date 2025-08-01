// Proxy Stepik ultra simple (Node.js/Express)
// Usage : déployer sur Vercel, Render, Railway, etc.
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/stepik/*', async (req, res) => {
  const stepikUrl = 'https://stepik.org/api/' + req.params[0] + (req.url.includes('?') ? req.url.split('?')[1] : '');
  try {
    const stepikRes = await fetch(stepikUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });
    res.status(stepikRes.status);
    stepikRes.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Proxy Stepik error', details: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Stepik proxy running on port 3000');
});
