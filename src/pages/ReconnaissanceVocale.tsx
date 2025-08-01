import React, { useState, useEffect } from 'react';

// Charge le vocabulaire russe directement depuis le dossier public, sans proxy ni backend
const RUSSIAN_WORDS_API = '/russian_words.txt'; // Fichier statique dans public/

const getRandomWord = (words: string[]) => words[Math.floor(Math.random() * words.length)];

// Thèmes pour filtrer
const THEMES = [
  'Tous',
  'Vie quotidienne',
  'Voyage',
  'Santé',
  'Expressions',
  'Verbes',
  'Adjectifs',
  'Famille',
  'Nourriture',
  'Transport',
  'Études',
  'Travail',
  'Loisirs',
  'Animaux',
  'Nature',
  'Technologie',
  'Émotions',
  'Couleurs',
  'Temps',
  'Vêtements',
  'Corps',
  'Sport',
  'Musique',
  'Ville',
  'Maison',
  'Histoire',
  'Culture',
  'Fêtes',
  'Expressions idiomatiques',
  'Grammaire',
  'Questions',
  'Exclamations',
  'Politesse',
  'Connecteurs',
  'Syntaxe',
  'Diminutifs',
  'Préfixes',
  'Suffixes',
  'Verbes de mouvement',
  'Verbes impersonnels',
  'Participes',
  'Style direct/indirect',
  'Formel/Informel',
  'Négation',
  'Numéraux',
  'Adverbes',
  'Conjonctions'
];

const ReconnaissanceVocale: React.FC = () => {
  // Vocabulaire enrichi : mot, theme, traduction
  type MotEnrichi = { mot: string, theme: string, traduction: string };
  const [mots, setMots] = useState<MotEnrichi[]>([]);
  // (supprimé, doublon)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motCible, setMotCible] = useState<string>('');
  const [reconnu, setReconnu] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [history, setHistory] = useState<{mot: string, reconnu: string, correct: boolean, attempts: number}[]>([]);
  const [listening, setListening] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [help, setHelp] = useState(false);
  const [dark, setDark] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [theme, setTheme] = useState<string>('Tous');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{mot: string, user: string, correct: boolean}[]>([]);

  // Exemple de catégorisation avancée (à adapter selon le format du fichier)
  useEffect(() => {
    fetch(RUSSIAN_WORDS_API)
      .then((res) => res.text())
      .then((text) => {
        // Format attendu : mot|theme|traduction
        const words = text.split('\n').map(w => w.trim()).filter(Boolean);
        const motsObj = words.map(line => {
          const [mot, theme, traduction] = line.split('|');
          return {
            mot: mot ? mot.trim() : '',
            theme: theme ? theme.trim() : 'Tous',
            traduction: traduction ? traduction.trim() : ''
          };
        });
        setMots(motsObj);
        setMotCible(getRandomWord(motsObj.map(m => m.mot)));
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur de chargement des mots russes');
        setLoading(false);
      });
  }, []);

  // Filtrage par thème réel
  const motsFiltres = theme === 'Tous'
    ? mots.map((m) => m.mot)
    : mots.filter((m) => m.theme === theme).map((m) => m.mot);
  // Pour accès rapide à la traduction
  const getTraduction = (mot: string) => {
    const found = mots.find(m => m.mot === mot);
    return found ? found.traduction : '';
  };

  // Reconnaissance vocale
  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Votre navigateur ne supporte pas la reconnaissance vocale.');
      return;
    }
    setListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setReconnu(transcript);
      const correct = transcript === motCible;
      setScore(s => correct ? s + 1 : s);
      setHistory(h => [...h, {mot: motCible, reconnu: transcript, correct, attempts: attempts + 1}]);
      setAttempts(a => a + 1);
      setProgress(p => Math.min(100, p + 5));
      if (correct) {
        if (!badges.includes('Bravo!')) setBadges(b => [...b, 'Bravo!']);
        if (attempts === 0 && !badges.includes('Rapide')) setBadges(b => [...b, 'Rapide']);
        if (score + 1 % 10 === 0 && !badges.includes('Streak')) setBadges(b => [...b, 'Streak']);
      }
      setListening(false);
    };
    recognition.onerror = () => {
      setError('Erreur de reconnaissance vocale');
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const suivant = () => {
    setMotCible(getRandomWord(motsFiltres));
    setReconnu('');
    setAttempts(0);
    setProgress(p => Math.max(0, p - 2));
  };

  const ajouterFavori = () => {
    if (!favorites.includes(motCible)) setFavorites(f => [...f, motCible]);
  };

  const exporterHistorique = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_reconnaissance.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importerHistorique = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setHistory(Array.isArray(data) ? data : []);
      } catch {
        setError('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  // Prononciation audio
  const playAudio = () => {
    const utter = new window.SpeechSynthesisUtterance(motCible);
    utter.lang = 'ru-RU';
    window.speechSynthesis.speak(utter);
  };

  // Suggestion communautaire
  const proposerMot = () => {
    const mot = prompt('Proposez un mot ou une phrase russe à ajouter :');
    if (mot && mot.length > 1) setSuggestions(s => [...s, mot]);
  };

  if (loading) return <div>Chargement du vocabulaire russe...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={dark ? 'bg-gray-900 text-white min-h-screen p-4' : 'bg-white text-gray-900 min-h-screen p-4'} aria-label="Reconnaissance vocale russe">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reconnaissance Vocale AI Russe</h2>
        <button onClick={() => setDark(d => !d)} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800" aria-label="Basculer le mode sombre">{dark ? '☀️' : '🌙'}</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <button onClick={startRecognition} disabled={listening || quizMode} className="px-4 py-2 bg-blue-600 text-white rounded" aria-label="Démarrer la reconnaissance">{listening ? 'Écoute...' : 'Démarrer la reconnaissance'}</button>
        <button onClick={suivant} disabled={quizMode} className="px-4 py-2 bg-green-600 text-white rounded" aria-label="Mot suivant">Mot suivant</button>
        <button onClick={ajouterFavori} disabled={quizMode} className="px-4 py-2 bg-yellow-400 text-black rounded" aria-label="Ajouter aux favoris">Favori</button>
        <button onClick={playAudio} disabled={quizMode} className="px-4 py-2 bg-purple-400 text-white rounded" aria-label="Écouter la prononciation">🔊 Prononciation</button>
        <button onClick={exporterHistorique} disabled={quizMode} className="px-4 py-2 bg-gray-400 text-black rounded" aria-label="Exporter historique">Exporter</button>
        <label className="px-4 py-2 bg-gray-200 rounded cursor-pointer" aria-label="Importer historique">
          Importer
          <input type="file" accept="application/json" onChange={importerHistorique} style={{display:'none'}} disabled={quizMode} />
        </label>
        <button onClick={proposerMot} disabled={quizMode} className="px-2 py-1 rounded bg-pink-200" aria-label="Proposer un mot">+ Suggestion</button>
        <button onClick={() => setHelp(h => !h)} disabled={quizMode} className="px-2 py-1 rounded bg-gray-200" aria-label="Aide">Aide</button>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="px-2 py-1 rounded bg-gray-100" aria-label="Filtrer par thème" disabled={quizMode}>
          {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => {setQuizMode(true);setQuizIndex(0);setQuizAnswers([]);}} className="px-4 py-2 bg-orange-500 text-white rounded" aria-label="Quiz par thème" disabled={quizMode}>Quiz {theme !== 'Tous' ? `(${theme})` : ''}</button>
        {quizMode && <button onClick={() => setQuizMode(false)} className="px-2 py-1 bg-gray-500 text-white rounded ml-2" aria-label="Quitter le quiz">Quitter le quiz</button>}
      </div>
      {!quizMode ? (
        <div className="mb-4">
          <h3 className="text-xl">Mot à prononcer :</h3>
          <div className="text-3xl font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded" tabIndex={0} aria-label="Mot cible">{motCible}</div>
          <div className="text-lg text-blue-700 dark:text-blue-300 mt-2">Traduction : {getTraduction(motCible) || <span className="italic text-gray-400">Non disponible</span>}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={playAudio} className="px-2 py-1 bg-purple-400 text-white rounded" aria-label="Écouter la prononciation">🔊</button>
            <span className="text-sm text-gray-500">Indice phonétique : <span className="font-mono">{motCible.split('').join('·')}</span></span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded" style={{width: `${progress}%`}}></div>
          </div>
          {reconnu && (
            <div className="mt-2">
              <span>Vous avez dit : </span>
              <span className={reconnu === motCible ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{reconnu}</span>
              <span className="ml-2">{reconnu === motCible ? '✅ Bravo !' : '❌ Essayez encore.'}</span>
              <span className="ml-2 text-xs">Tentatives : {attempts}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 p-4 bg-orange-100 dark:bg-orange-900 rounded">
          <h3 className="text-xl font-bold mb-2">Quiz : {theme !== 'Tous' ? theme : 'Tous les thèmes'}</h3>
          {(() => {
            const quizWords = theme === 'Tous' ? mots.map(m => m.mot) : mots.filter(m => m.theme === theme).map(m => m.mot);
            if (quizWords.length === 0) return <div>Aucun mot pour ce thème.</div>;
            if (quizIndex >= quizWords.length) {
              return (
                <div>
                  <h4 className="font-bold">Quiz terminé !</h4>
                  <div>Score : {quizAnswers.filter(a => a.correct).length} / {quizWords.length}</div>
                  <ul className="mt-2">
                    {quizAnswers.map((a, i) => (
                      <li key={i} className={a.correct ? 'text-green-600' : 'text-red-600'}>
                        {a.mot} → {a.user} {a.correct ? '✅' : '❌'} Traduction : {getTraduction(a.mot) || <span className="italic text-gray-400">Non disponible</span>}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => {setQuizIndex(0);setQuizAnswers([]);}} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">Recommencer le quiz</button>
                </div>
              );
            }
            const currentMot = quizWords[quizIndex];
            return (
              <form onSubmit={e => {
                e.preventDefault();
                const input = (e.target as any).elements['answer'].value.trim();
                setQuizAnswers(a => [...a, {mot: currentMot, user: input, correct: input === currentMot}]);
                setQuizIndex(i => i + 1);
              }}>
                <div className="text-3xl font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded mb-2">{currentMot}</div>
                <div className="text-lg text-blue-700 dark:text-blue-300 mb-2">Traduction : {getTraduction(currentMot) || <span className="italic text-gray-400">Non disponible</span>}</div>
                <input name="answer" type="text" className="px-2 py-1 rounded border" autoFocus autoComplete="off" aria-label="Votre réponse" />
                <button type="submit" className="ml-2 px-4 py-2 bg-orange-500 text-white rounded">Valider</button>
                <div className="mt-2 text-sm text-gray-500">Tapez le mot en russe tel qu'affiché.</div>
                <div className="mt-2">Progression : {quizIndex + 1} / {quizWords.length}</div>
              </form>
            );
          })()}
        </div>
      )}
      <div className="mb-4">
        <h4 className="font-bold">Score : {score}</h4>
        <h4 className="font-bold">Badges : {badges.join(', ') || 'Aucun'}</h4>
        <h4 className="font-bold">Favoris : {favorites.join(', ') || 'Aucun'}</h4>
        <h4 className="font-bold">Suggestions : {suggestions.join(', ') || 'Aucune'}</h4>
      </div>
      <div className="mb-4">
        <h4 className="font-bold">Historique :</h4>
        <ul className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded p-2">
          {history.slice(-20).reverse().map((h, i) => (
            <li key={i} className={h.correct ? 'text-green-600' : 'text-red-600'}>
              {h.mot} → {h.reconnu} {h.correct ? '✅' : '❌'} ({h.attempts} tentatives)
            </li>
          ))}
        </ul>
      </div>
      {help && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
          <h4 className="font-bold mb-2">Aide & Astuces</h4>
          <ul className="list-disc ml-6">
            <li>Appuyez sur "Démarrer la reconnaissance" et prononcez le mot affiché.</li>
            <li>Utilisez "Prononciation" pour entendre le mot.</li>
            <li>Essayez d'être précis pour obtenir les badges.</li>
            <li>Utilisez "Mot suivant" pour changer de mot ou filtrez par thème.</li>
            <li>Ajoutez vos mots préférés aux favoris ou proposez-en de nouveaux.</li>
            <li>Exportez ou importez votre historique pour suivre vos progrès.</li>
            <li>Activez le mode sombre pour plus de confort visuel.</li>
            <li>Accessible clavier et mobile, ARIA optimisé.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReconnaissanceVocale;
  // ...existing code...
  // Suggestion d’enrichissement :
  // - Ajoutez des quiz par thème
  // - Ajoutez des exemples d’utilisation
  // - Ajoutez la possibilité d’afficher la traduction ou l’explication du mot
