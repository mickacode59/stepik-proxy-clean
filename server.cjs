// Simple Node.js proxy for Russian words
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const fs = require('fs');
const path = require('path');
app.get('/api/russian-words', (req, res) => {
  const filePath = path.join(__dirname, 'russian_words.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erreur proxy russe');
      return;
    }
    res.set('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.listen(3001, () => {
  console.log('Proxy russe démarré sur http://localhost:3001/api/russian-words');
});
