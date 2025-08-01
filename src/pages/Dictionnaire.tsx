import React, { useState } from 'react';
import dictionaryData from '../data/russian_dictionary.json';

const getSuggestions = (query: string) => {
  if (!query) return [];
  const key = query.trim().toLowerCase();
  return Object.values(dictionaryData)
    .filter((e: any) =>
      e.word.toLowerCase().includes(key) ||
      (e.translation && e.translation.toLowerCase().includes(key))
    )
    .slice(0, 5);
};

const getReverseResult = (query: string) => {
  const key = query.trim().toLowerCase();
  return Object.values(dictionaryData).find((e: any) =>
    e.translation && e.translation.toLowerCase().includes(key)
  );
};

const getStats = () => {
  const hist = JSON.parse(localStorage.getItem('dict_hist') || '[]');
  return {
    searches: hist.length,
    most: hist[0] || null
  };
};

const Dictionnaire: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [reverseResult, setReverseResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('dict_favs') || '[]'));
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem('dict_hist') || '[]'));
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [quizWord, setQuizWord] = useState<any | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');

  const search = (word?: string) => {
    setLoading(true);
    setError('');
    setReverseResult(null);
    const key = (word || query).trim().toLowerCase();
    let entry = (dictionaryData as any)[key];
    if (!entry) {
      entry = Object.values(dictionaryData).find((e: any) =>
        e.word.toLowerCase().includes(key) ||
        (e.translation && e.translation.toLowerCase().includes(key))
      );
    }
    setResult(entry || null);
    if (!entry) {
      // Recherche inversée
      const rev = getReverseResult(key);
      setReverseResult(rev || null);
      if (!rev) setError('Aucun résultat trouvé. Essayez un autre mot ou une racine.');
    }
    if (entry) {
      setHistory(h => {
        const newHist = [entry.word, ...h.filter(w => w !== entry.word)].slice(0, 20);
        localStorage.setItem('dict_hist', JSON.stringify(newHist));
        return newHist;
      });
    }
    setLoading(false);
  };

  const handleFavorite = (word: string) => {
    setFavorites(f => {
      const newFavs = f.includes(word) ? f.filter(w => w !== word) : [word, ...f];
      localStorage.setItem('dict_favs', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSuggestions(getSuggestions(e.target.value));
    if (e.target.value.length > 1) search(e.target.value);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAddWord = () => {
    // Simule l’ajout communautaire (stockage local)
    if (newWord && newTranslation) {
      const dict = { ...dictionaryData, [newWord]: { word: newWord, translation: newTranslation } };
      localStorage.setItem('dict_custom', JSON.stringify(dict));
      setShowAdd(false);
      setNewWord('');
      setNewTranslation('');
      alert('Mot proposé ! Il sera ajouté après validation.');
    }
  };

  const handleExport = (type: 'favs' | 'hist') => {
    const data = type === 'favs' ? favorites : history;
    const blob = new Blob([data.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'favs' ? 'favoris.txt' : 'historique.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startQuiz = () => {
    const words = Object.values(dictionaryData);
    const random = words[Math.floor(Math.random() * words.length)];
    setQuizWord(random);
    setQuizMode(true);
    setQuizAnswer('');
    setQuizFeedback('');
  };

  const checkQuiz = () => {
    if (!quizWord) return;
    if (quizAnswer.trim().toLowerCase() === quizWord.translation.toLowerCase()) {
      setQuizFeedback('✅ Bonne réponse !');
    } else {
      setQuizFeedback(`❌ Mauvaise réponse. La bonne réponse était : ${quizWord.translation}`);
    }
  };

  const stats = getStats();

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Dictionnaire russe</h1>
      <div className="flex gap-2 mb-4">
        <input value={query} onChange={handleInput} className="border rounded px-2 py-1 w-full" placeholder="Mot russe ou français..." autoComplete="off" aria-label="Recherche" />
        <button onClick={() => search()} className="bg-blue-600 text-white px-4 py-1 rounded">Rechercher</button>
      </div>
      <div className="mb-2 flex gap-4">
        <button className="px-2 py-1 bg-green-100 rounded" onClick={startQuiz}>Mode Quiz</button>
        <button className="px-2 py-1 bg-blue-100 rounded" onClick={() => setShowAdd(v => !v)}>Proposer un mot</button>
        <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleExport('favs')}>Exporter favoris</button>
        <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => handleExport('hist')}>Exporter historique</button>
      </div>
      {quizMode && quizWord && (
        <div className="bg-yellow-50 p-4 rounded shadow mb-4">
          <div className="mb-2 font-bold">Quiz : Traduisez ce mot</div>
          <div className="mb-2 text-lg">{quizWord.word}</div>
          <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" placeholder="Votre réponse..." />
          <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={checkQuiz}>Valider</button>
          {quizFeedback && <div className="mt-2">{quizFeedback}</div>}
          <button className="mt-2 px-2 py-1 bg-gray-200 rounded" onClick={() => setQuizMode(false)}>Quitter le quiz</button>
        </div>
      )}
      {showAdd && (
        <div className="bg-blue-50 p-4 rounded shadow mb-4">
          <div className="mb-2 font-bold">Proposer un nouveau mot</div>
          <input value={newWord} onChange={e => setNewWord(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" placeholder="Mot russe..." />
          <input value={newTranslation} onChange={e => setNewTranslation(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" placeholder="Traduction française..." />
          <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={handleAddWord}>Envoyer</button>
          <button className="mt-2 px-2 py-1 bg-gray-200 rounded" onClick={() => setShowAdd(false)}>Annuler</button>
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="mb-4 bg-white border rounded shadow p-2">
          <div className="text-xs text-gray-500 mb-1">Suggestions :</div>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <button className="text-blue-700 hover:underline" onClick={() => search(s.word)}>{s.word} <span className="text-gray-500">{s.translation}</span></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {loading && <div>Recherche...</div>}
      {result && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg">{result.word} <span className="text-gray-500">{result.transcription}</span></div>
            <button onClick={() => handleFavorite(result.word)} title="Ajouter aux favoris" className={favorites.includes(result.word) ? 'text-yellow-500' : 'text-gray-400'}>★</button>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">Traduction:</span> {result.translation}
            <button className="text-xs px-2 py-1 bg-gray-200 rounded" onClick={() => handleCopy(result.translation)}>Copier</button>
          </div>
          {result.audio ? (
            <button className="mb-2 px-2 py-1 bg-blue-100 rounded" onClick={() => { const a = new Audio(result.audio); a.play(); }}>🔊 Écouter</button>
          ) : (
            <button className="mb-2 px-2 py-1 bg-blue-100 rounded" onClick={() => window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(result.word))}>🔊 TTS</button>
          )}
          {result.gender && <div className="mb-2"><span className="font-semibold">Genre:</span> {result.gender}</div>}
          {result.type && <div className="mb-2"><span className="font-semibold">Type:</span> {result.type}</div>}
          {result.flexions && (
            <div className="mb-2">
              <span className="font-semibold">Flexions:</span>
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(result.flexions, null, 2)}</pre>
            </div>
          )}
          {result.examples && result.examples.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Exemples:</span>
              <ul className="list-disc ml-6">
                {result.examples.map((ex: string, i: number) => <li key={i}>{ex}</li>)}
              </ul>
            </div>
          )}
          {result.synonyms && result.synonyms.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Synonymes:</span>
              {result.synonyms.map((syn: string, i: number) => (
                <button key={i} className="text-blue-700 hover:underline mx-1" onClick={() => search(syn)}>{syn}</button>
              ))}
            </div>
          )}
          {result.antonyms && result.antonyms.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Antonymes:</span>
              {result.antonyms.map((ant: string, i: number) => (
                <button key={i} className="text-blue-700 hover:underline mx-1" onClick={() => search(ant)}>{ant}</button>
              ))}
            </div>
          )}
          {result.conjugation && (
            <div className="mb-2">
              <span className="font-semibold">Conjugaison:</span>
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(result.conjugation, null, 2)}</pre>
            </div>
          )}
          {result.image && (
            <div className="mb-2">
              <span className="font-semibold">Illustration:</span>
              <img src={result.image} alt={result.word} className="w-32 h-32 object-cover rounded border" />
            </div>
          )}
          <div className="mb-2">
            <a href={`https://fr.wiktionary.org/wiki/${result.word}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Voir sur Wiktionary</a>
            {result.word && <a href={`https://fr.wikipedia.org/wiki/${result.word}`} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-700 underline">Wikipedia</a>}
          </div>
          <div className="flex gap-2 mt-2">
            <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => navigator.share && navigator.share({ title: result.word, text: `${result.word} — ${result.translation}` })}>Partager</button>
            {history.length > 1 && (
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => search(history[1])}>Mot précédent</button>
            )}
          </div>
        </div>
      )}
      {reverseResult && (
        <div className="bg-gray-50 p-4 rounded shadow mt-4">
          <div className="font-bold text-lg mb-2">Résultat de la traduction inversée :</div>
          <div className="mb-2">{reverseResult.word} <span className="text-gray-500">{reverseResult.transcription}</span></div>
          <div className="mb-2"><span className="font-semibold">Traduction:</span> {reverseResult.translation}</div>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Favoris</h2>
        {favorites.length === 0 && <div className="text-gray-400">Aucun favori.</div>}
        <ul>
          {favorites.map((w, i) => (
            <li key={i}>
              <button className="text-blue-700 hover:underline" onClick={() => search(w)}>{w}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Historique</h2>
        {history.length === 0 && <div className="text-gray-400">Aucun historique.</div>}
        <ul>
          {history.map((w, i) => (
            <li key={i}>
              <button className="text-blue-700 hover:underline" onClick={() => search(w)}>{w}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Statistiques</h2>
        <div>Nombre de recherches : {stats.searches}</div>
        {stats.most && <div>Mot le plus consulté : {stats.most}</div>}
      </div>
    </div>
  );
};

export default Dictionnaire;
