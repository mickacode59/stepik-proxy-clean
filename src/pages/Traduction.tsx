import React, { useState } from 'react';

const LANGS = [
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Russe' },
  { code: 'en', name: 'Anglais' },
  { code: 'de', name: 'Allemand' },
  { code: 'es', name: 'Espagnol' },
  { code: 'it', name: 'Italien' },
  { code: 'zh-CN', name: 'Chinois' },
  { code: 'ja', name: 'Japonais' },
  { code: 'ar', name: 'Arabe' },
];

function getSuggestions(text: string, lang: string): string[] {
  // Suggestions simples : synonymes, corrections, variantes
  if (!text) return [];
  if (lang === 'fr') return ['Synonyme 1', 'Synonyme 2', 'Correction possible'];
  if (lang === 'ru') return ['Вариант 1', 'Вариант 2', 'Возможная коррекция'];
  if (lang === 'en') return ['Synonym 1', 'Synonym 2', 'Possible correction'];
  return [];
}

const BADGES = [
  { name: 'Contributeur', condition: (c:any) => c.length >= 5 },
  { name: 'Modérateur', condition: (c:any) => c.filter((t:any) => t.reported).length >= 1 },
  { name: 'Expert', condition: (c:any) => new Set(c.map((t:any) => t.result)).size >= 10 },
];

const Traduction: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('auto');
  const [to, setTo] = useState('ru');
  const [history, setHistory] = useState<Array<{text:string;result:string;from:string;to:string}>>([]);
  const [favorites, setFavorites] = useState<Array<{text:string;result:string;from:string;to:string}>>([]);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [community, setCommunity] = useState<Array<{text:string;result:string;from:string;to:string;author:string;reported?:boolean;comment?:string}>>([]);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [sortBy, setSortBy] = useState<'date'|'author'|'text'>('date');
  const [reportMsg, setReportMsg] = useState('');
  const [quizAdvanced, setQuizAdvanced] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCommunityIdx, setQuizCommunityIdx] = useState(0);
  const [quizCommunityAnswer, setQuizCommunityAnswer] = useState('');
  const [quizCommunityFeedback, setQuizCommunityFeedback] = useState('');

  const translate = async () => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0] && data[0][0]) {
        setResult(data[0][0][0]);
        setHistory([{ text, result: data[0][0][0], from, to }, ...history.slice(0,19)]);
      } else {
        setError('Aucune traduction trouvée.');
      }
    } catch {
      setError('Erreur lors de la traduction.');
    }
    setLoading(false);
  };

  const addFavorite = () => {
    if (result) {
      setFavorites([{ text, result, from, to }, ...favorites.filter(f => f.result !== result)]);
    }
  };

  const speak = (txt: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(txt);
      utter.lang = lang;
      window.speechSynthesis.speak(utter);
    }
  };

  const share = () => {
    if (navigator.share && result) {
      navigator.share({ title: 'Traduction', text: `${text} → ${result}` });
    } else {
      window.prompt('Copiez la traduction :', result);
    }
  };

  const exportHistory = () => {
    const blob = new Blob([
      'Texte,Traduction,De,Vers\n' +
      history.map(h => `${h.text.replace(/\n/g,' ')}","${h.result.replace(/\n/g,' ')}","${h.from}","${h.to}"`).join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_traduction.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizAnswer('');
    setQuizFeedback('');
  };

  const checkQuiz = () => {
    if (quizAnswer.trim().toLowerCase() === result.trim().toLowerCase()) {
      setQuizFeedback('✅ Bonne réponse !');
    } else {
      setQuizFeedback('❌ Mauvaise réponse.');
    }
  };

  // Ajout communautaire avec commentaire
  const addCommunity = () => {
    if (text && result && author) {
      setCommunity([{ text, result, from, to, author, comment }, ...community]);
      setAuthor('');
      setComment('');
    }
  };

  // Filtrage et classement communautaire
  const filteredCommunity = community
    .filter(c => !filterAuthor || c.author.toLowerCase().includes(filterAuthor.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      if (sortBy === 'text') return a.text.localeCompare(b.text);
      return 0;
    });

  // Attribution de badges
  const getBadges = (author:string) => {
    const contribs = community.filter(c => c.author === author);
    return BADGES.filter(b => b.condition(contribs)).map(b => b.name);
  };

  // Modération simple (report)
  const reportCommunity = (i: number) => {
    setCommunity(community.map((c, idx) => idx === i ? { ...c, reported: true } : c));
    setReportMsg('Traduction signalée à la modération.');
    setTimeout(() => setReportMsg(''), 2000);
  };

  // Statistiques
  const stats = {
    total: history.length,
    unique: new Set(history.map(h => h.result)).size,
    favorites: favorites.length,
    lastLang: to,
  };

  // Export communautaire
  const exportCommunity = () => {
    const blob = new Blob([
      'Texte,Traduction,De,Vers,Auteur\n' +
      community.map(c => `${c.text.replace(/\n/g,' ')}","${c.result.replace(/\n/g,' ')}","${c.from}","${c.to}","${c.author}"`).join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'traductions_communautaires.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Statistiques communautaires
  const communityStats = {
    total: community.length,
    unique: new Set(community.map(c => c.result)).size,
    auteurs: new Set(community.map(c => c.author)).size,
    signalées: community.filter(c => c.reported).length,
  };

  // Quiz avancé : propose une traduction communautaire aléatoire
  const startQuizAdvanced = () => {
    setQuizAdvanced(true);
    setQuizScore(0);
  };
  const nextQuizCommunity = () => {
    if (community.length > 0) {
      setQuizCommunityIdx(Math.floor(Math.random() * community.length));
      setQuizCommunityAnswer('');
      setQuizCommunityFeedback('');
    }
  };
  const checkQuizCommunity = () => {
    if (community[quizCommunityIdx] && quizCommunityAnswer.trim().toLowerCase() === community[quizCommunityIdx].result.trim().toLowerCase()) {
      setQuizScore(s => s + 1);
      setQuizCommunityFeedback('✅ Bonne réponse !');
    } else {
      setQuizCommunityFeedback('❌ Mauvaise réponse.');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Traduction Google</h1>
      <div className="mb-4 flex gap-2">
        <select value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1">
          <option value="auto">Détection automatique</option>
          {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <span className="px-2">→</span>
        <select value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1">
          {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" rows={3} placeholder="Texte à traduire..." />
      <button onClick={translate} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Traduire</button>
      {loading && <div className="mt-4">Traduction en cours...</div>}
      {result && (
        <div className="mt-4 bg-green-50 p-4 rounded shadow">
          <div className="font-bold mb-2">Résultat :</div>
          <div className="text-lg">{result}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => speak(result, to)} className="bg-gray-200 px-2 py-1 rounded">🔊 Écouter</button>
            <button onClick={addFavorite} className="bg-yellow-200 px-2 py-1 rounded">⭐ Favori</button>
            <button onClick={share} className="bg-blue-200 px-2 py-1 rounded">📤 Partager</button>
          </div>
        </div>
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="font-bold mb-2">Historique :</div>
          <ul className="bg-gray-50 rounded p-2">
            {history.map((h, i) => (
              <li key={i} className="flex justify-between items-center py-1 border-b last:border-b-0">
                <span>{h.text} <span className="mx-1">→</span> <span className="font-semibold">{h.result}</span></span>
                <button onClick={() => setText(h.text)} className="text-blue-600 text-xs">↩️</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {favorites.length > 0 && (
        <div className="mt-8">
          <div className="font-bold mb-2">Favoris :</div>
          <ul className="bg-yellow-50 rounded p-2">
            {favorites.map((f, i) => (
              <li key={i} className="flex justify-between items-center py-1 border-b last:border-b-0">
                <span>{f.text} <span className="mx-1">→</span> <span className="font-semibold">{f.result}</span></span>
                <button onClick={() => setText(f.text)} className="text-blue-600 text-xs">↩️</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Navigation historique */}
      {history.length > 1 && (
        <div className="flex gap-2 mb-2">
          <button onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0)} className="bg-gray-100 px-2 py-1 rounded">⬅️ Précédent</button>
          <button onClick={() => setCurrentIndex(currentIndex < history.length - 1 ? currentIndex + 1 : history.length - 1)} className="bg-gray-100 px-2 py-1 rounded">Suivant ➡️</button>
        </div>
      )}
      {/* Affichage historique/favoris selon currentIndex */}
      {history.length > 0 && (
        <div className="mb-4 bg-gray-50 p-2 rounded">
          <div className="font-bold">Historique sélectionné :</div>
          <div>{history[currentIndex].text} → <span className="font-semibold">{history[currentIndex].result}</span></div>
        </div>
      )}
      {/* Filtrage et classement communautaire */}
      <div className="mt-8">
        <div className="font-bold mb-2">Filtrer/Classement communautaire :</div>
        <input value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)} className="border rounded px-2 py-1 mb-2 w-full" placeholder="Filtrer par auteur..." />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="border rounded px-2 py-1 mb-2">
          <option value="date">Date</option>
          <option value="author">Auteur</option>
          <option value="text">Texte</option>
        </select>
        <ul>
          {filteredCommunity.map((c, i) => (
            <li key={i} className="text-sm flex flex-col gap-1 mb-2 bg-pink-50 p-2 rounded">
              <div>{c.text} → <span className="font-semibold">{c.result}</span> <span className="text-xs text-gray-500">par {c.author}</span></div>
              {c.comment && <div className="text-xs text-gray-700">Commentaire : {c.comment}</div>}
              <div className="flex gap-2">
                {getBadges(c.author).map(b => <span key={b} className="bg-yellow-200 px-2 py-1 rounded text-xs">🏅 {b}</span>)}
                {!c.reported && <button onClick={() => reportCommunity(i)} className="bg-red-200 px-2 py-1 rounded text-xs">Signaler</button>}
                {c.reported && <span className="text-red-500 text-xs">Signalé</span>}
              </div>
            </li>
          ))}
        </ul>
        {reportMsg && <div className="text-red-500 mb-2">{reportMsg}</div>}
      </div>
      {/* Ajout communautaire avec commentaire */}
      <div className="mt-8 bg-pink-50 p-4 rounded">
        <div className="font-bold mb-2">Ajout communautaire :</div>
        <input value={author} onChange={e => setAuthor(e.target.value)} className="border rounded px-2 py-1 mb-2 w-full" placeholder="Votre nom ou pseudo..." />
        <textarea value={comment} onChange={e => setComment(e.target.value)} className="border rounded px-2 py-1 mb-2 w-full" placeholder="Commentaire (optionnel)..." />
        <button onClick={addCommunity} className="bg-pink-300 px-2 py-1 rounded">Ajouter cette traduction</button>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={exportHistory} className="bg-gray-300 px-2 py-1 rounded">📁 Exporter historique</button>
        <button onClick={startQuiz} className="bg-purple-300 px-2 py-1 rounded">📝 Quiz</button>
      </div>
      {/* Suggestions */}
      {text && (
        <div className="mb-4">
          <div className="font-bold">Suggestions :</div>
          <ul className="text-sm text-gray-700">
            {getSuggestions(text, from === 'auto' ? 'fr' : from).map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
      )}
      {/* Quiz */}
      {quizMode && result && (
        <div className="mb-4 bg-purple-50 p-4 rounded">
          <div className="font-bold mb-2">Quiz : Retapez la traduction</div>
          <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" placeholder="Votre réponse..." />
          <button onClick={checkQuiz} className="bg-purple-400 text-white px-4 py-1 rounded">Vérifier</button>
          {quizFeedback && <div className="mt-2">{quizFeedback}</div>}
          <button onClick={() => setQuizMode(false)} className="mt-2 text-xs text-gray-500">Quitter le quiz</button>
        </div>
      )}
      {/* Statistiques */}
      <div className="mt-8 bg-blue-50 p-4 rounded">
        <div className="font-bold mb-2">Statistiques :</div>
        <div>Total traductions : {stats.total}</div>
        <div>Traductions uniques : {stats.unique}</div>
        <div>Favoris : {stats.favorites}</div>
        <div>Langue cible actuelle : {LANGS.find(l => l.code === stats.lastLang)?.name}</div>
      </div>
      {/* Statistiques communautaires */}
      <div className="mt-8 bg-pink-100 p-4 rounded">
        <div className="font-bold mb-2">Statistiques communautaires :</div>
        <div>Total : {communityStats.total}</div>
        <div>Traductions uniques : {communityStats.unique}</div>
        <div>Auteurs différents : {communityStats.auteurs}</div>
        <div>Signalées : {communityStats.signalées}</div>
        <button onClick={exportCommunity} className="bg-pink-300 px-2 py-1 rounded mt-2">📁 Exporter communautaire</button>
      </div>
      {/* Quiz avancé communautaire */}
      <div className="mt-8 bg-purple-100 p-4 rounded">
        <div className="font-bold mb-2">Quiz avancé communautaire</div>
        <button onClick={startQuizAdvanced} className="bg-purple-300 px-2 py-1 rounded mb-2">Démarrer le quiz</button>
        {quizAdvanced && community.length > 0 && (
          <div>
            <div className="mb-2">Traduisez : <span className="font-semibold">{community[quizCommunityIdx]?.text}</span></div>
            <input value={quizCommunityAnswer} onChange={e => setQuizCommunityAnswer(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" placeholder="Votre réponse..." />
            <button onClick={checkQuizCommunity} className="bg-purple-400 text-white px-4 py-1 rounded">Vérifier</button>
            {quizCommunityFeedback && <div className="mt-2">{quizCommunityFeedback}</div>}
            <button onClick={nextQuizCommunity} className="mt-2 text-xs text-gray-500">Question suivante</button>
            <div className="mt-2">Score : {quizScore}</div>
            <button onClick={() => setQuizAdvanced(false)} className="mt-2 text-xs text-gray-500">Quitter le quiz</button>
          </div>
        )}
      </div>
      {/* Modération communautaire */}
      <div className="mt-8">
        <div className="font-bold mb-2">Modération communautaire :</div>
        {community.length > 0 && (
          <ul>
            {community.map((c, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                {c.text} → <span className="font-semibold">{c.result}</span> <span className="text-xs text-gray-500">par {c.author}</span>
                {!c.reported && <button onClick={() => reportCommunity(i)} className="bg-red-200 px-2 py-1 rounded text-xs">Signaler</button>}
                {c.reported && <span className="text-red-500 text-xs">Signalé</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Traduction;
