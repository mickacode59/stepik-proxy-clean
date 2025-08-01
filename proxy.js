const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Bad request');
  // Si URL externe (http/https), relaie en streaming avec headers
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const https = require('https');
    const http = require('http');
    const client = url.startsWith('https://') ? https : http;
    client.get(url, (proxyRes) => {
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        // Redirection
        return res.redirect(proxyRes.headers.location);
      }
      if (proxyRes.statusCode !== 200) {
        return res.status(proxyRes.statusCode).send('Not found');
      }
      // Transfère tous les headers importants
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      proxyRes.pipe(res);
    }).on('error', () => res.status(404).send('Not found'));
    return;
  }
  // Sinon, traite comme chemin local ou Firebase Hosting
  const safeUrl = path.normalize(url).replace(/^([.]+[\/])+/, '');
  const localPath = path.join(__dirname, 'public', safeUrl);
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }
  // Relaye aussi en streaming depuis Firebase Hosting
  const hostingUrl = `https://myrusse-2826d.web.app${safeUrl}`;
  const https = require('https');
  https.get(hostingUrl, (proxyRes) => {
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      return res.redirect(proxyRes.headers.location);
    }
    if (proxyRes.statusCode !== 200) {
      return res.status(proxyRes.statusCode).send('Not found');
    }
    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    proxyRes.pipe(res);
  }).on('error', () => res.status(404).send('Not found'));
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));
