// Script Node.js pour extraire toutes les URLs d'images de Firestore (news, courses, etc.),
// les télécharger, les uploader sur Firebase Storage, et générer un mapping.
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

// Extensions d'images reconnues
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

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
  // Scanner la collection news
  const newsSnap = await db.collection('news').get();
  newsSnap.forEach(doc => {
    const data = doc.data();
    extractImageUrls(data, allUrls);
  });
  // Scanner la collection courses
  const coursesSnap = await db.collection('courses').get();
  coursesSnap.forEach(doc => {
    const data = doc.data();
    extractImageUrls(data, allUrls);
  });
  allUrls = Array.from(allUrls);
  console.log('Total images Firestore trouvées :', allUrls.length);
  const results = [];
  for (const url of allUrls) {
    console.log('Traitement :', url);
    results.push(await downloadAndUpload(url));
  }
  fs.writeFileSync(path.join(__dirname, 'image_url_mapping.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log('Terminé. Mapping dans scripts/image_url_mapping.json');
}

main();
