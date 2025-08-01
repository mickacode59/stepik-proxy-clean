// Script Node.js CommonJS pour importer un dictionnaire russe massif depuis une source ouverte (ex: Wiktionary dump)
// Placez le fichier source (CSV, TSV, JSON, etc.) dans le dossier data et ajustez le chemin ci-dessous
// Exemple d'utilisation: node import_russian_dictionary.cjs

const fs = require('fs');
const path = require('path');

// Exemple: fichier CSV avec colonnes: word,translation,transcription,examples,audio,gender,type,synonyms,antonyms,conjugation
const SOURCE_FILE = path.join(__dirname, 'src', 'data', 'russian_words.csv');
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'russian_dictionary.json');

function parseCSVLine(line) {
  const [word, translation, transcription, examples, audio, gender, type, synonyms, antonyms, conjugation] = line.split(',');
  let parsedConjugation = null;
  if (conjugation && conjugation.trim() && conjugation.trim() !== '') {
    try {
      parsedConjugation = JSON.parse(conjugation);
    } catch {
      parsedConjugation = null;
    }
  }
  return {
    word: word.trim(),
    translation: translation.trim(),
    transcription: transcription.trim(),
    examples: examples ? examples.split('|').map(e => e.trim()) : [],
    audio: audio.trim(),
    gender: gender.trim(),
    type: type.trim(),
    synonyms: synonyms ? synonyms.split('|').map(s => s.trim()) : [],
    antonyms: antonyms ? antonyms.split('|').map(a => a.trim()) : [],
    conjugation: parsedConjugation
  };
}

function importDictionary() {
  const lines = fs.readFileSync(SOURCE_FILE, 'utf-8').split('\n').filter(Boolean);
  // Ignore header
  lines.shift();
  const dict = {};
  for (const line of lines) {
    const entry = parseCSVLine(line);
    dict[entry.word] = entry;
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dict, null, 2), 'utf-8');
  console.log(`Import terminé: ${Object.keys(dict).length} mots ajoutés dans ${OUTPUT_FILE}`);
}

importDictionary();
