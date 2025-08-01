// Script Node.js pour extraire toutes les URLs d'images de Firestore (news, courses, lessons),
// des fichiers JSON locaux, et des cours/lessons importés dynamiquement,
// puis les télécharger, les uploader sur Firebase Storage, et générer un mapping.
// Nécessite : npm install firebase-admin node-fetch@2

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/+([A-Za-z]:)/, '$1'));

// Initialisation Firebase Admin
initializeApp({
  credential: cert(path.join(__dirname, 'serviceAccountKey.json')),
  storageBucket: 'myrusse-2826d.appspot.com',
});
const db = getFirestore();
const bucket = getStorage().bucket();

function isImageUrl(url) {
  return typeof url === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

function extractImageUrls(obj, urls = new Set()) {
  if (typeof obj === 'string') {
    if (isImageUrl(obj)) urls.add(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImageUrls(item, urls));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(val => extractImageUrls(val, urls));
  }
  return urls;
}

async function downloadAndUpload(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const ext = path.extname(url.split('?')[0]) || '.jpg';
    const fileName = 'imported-images/' + Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '') + ext;
    const file = bucket.file(fileName);
    await new Promise((resolve, reject) => {
      const stream = file.createWriteStream({ resumable: false, contentType: res.headers.get('content-type') });
      res.body.pipe(stream);
      res.body.on('error', reject);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    await file.makePublic();
    return { old: url, new: `https://storage.googleapis.com/${bucket.name}/${fileName}` };
  } catch (e) {
    return { old: url, new: null, error: e.message };
  }
}

async function main() {
  let allUrls = new Set();
  // 1. Scanner Firestore (news, courses, lessons)
  for (const col of ['news', 'courses', 'lessons']) {
    const snap = await db.collection(col).get();
    snap.forEach(doc => {
      const data = doc.data();
      extractImageUrls(data, allUrls);
    });
  }
  // 2. Scanner les fichiers JSON locaux (dans scripts/)
  fs.readdirSync(__dirname).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    extractImageUrls(data, allUrls);
  });
  // 3. Scanner les fichiers TypeScript/JS de src/data/ (cours/lessons locaux)
  const dataDir = path.resolve(__dirname, '../src/data');
  fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') || f.endsWith('.js')).forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    // Extraction naïve d'URL d'image dans le code source
    const matches = content.match(/https?:\/\/[^'"\s)]+\.(jpg|jpeg|png|gif|webp|svg)/gi);
    if (matches) matches.forEach(url => allUrls.add(url));
  });
  allUrls = Array.from(allUrls);
  console.log('Total images trouvées (Firestore, JSON, code source) :', allUrls.length);
  const results = [];
  for (const url of allUrls) {
    console.log('Traitement :', url);
    results.push(await downloadAndUpload(url));
  }
  fs.writeFileSync(path.join(__dirname, 'image_url_mapping.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log('Terminé. Mapping dans scripts/image_url_mapping.json');
}

main();
