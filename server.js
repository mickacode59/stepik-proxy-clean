// Simple Node.js proxy for Russian words
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/russian-words', async (req, res) => {
  const url = 'https://raw.githubusercontent.com/rshefer/russian-words/master/russian.txt';
  try {
    const response = await fetch(url);
    const text = await response.text();
    res.set('Content-Type', 'text/plain');
    res.send(text);
  } catch (err) {
    res.status(500).send('Erreur proxy russe');
  }
});

app.listen(3001, () => {
  console.log('Proxy russe démarré sur http://localhost:3001/api/russian-words');
});
