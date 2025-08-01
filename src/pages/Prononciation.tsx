import React, { useState, useRef, useEffect } from 'react';

const exemples = [
  { mot: 'Здравствуйте', audio: 'https://russian-dict.ru/audio/Здравствуйте.mp3', tts: 'Здравствуйте' },
  { mot: 'Спасибо', audio: 'https://russian-dict.ru/audio/Спасибо.mp3', tts: 'Спасибо' },
  { mot: 'Как дела ?', audio: 'https://russian-dict.ru/audio/Как_дела.mp3', tts: 'Как дела?' },
  { mot: 'Я люблю русский язык', audio: 'https://russian-dict.ru/audio/Я_люблю_русский_язык.mp3', tts: 'Я люблю русский язык' },
];

type Badge = {
  name: string;
  condition: (args: { favoris: string[]; score: number }) => boolean;
};
const BADGES: Badge[] = [
  { name: 'Prononciateur', condition: ({ favoris }) => favoris.length >= 2 },
  { name: 'Quiz Pro', condition: ({ score }) => score >= 3 },
];

const Prononciation: React.FC = () => {
  const [search, setSearch] = useState('');
  const [mot, setMot] = useState('');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string|null>(null);
  const [compareResult, setCompareResult] = useState<string>('');
  const [trainHistory, setTrainHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('prononciation_train_history') || '[]');
    } catch { return []; }
  });
  const [trainBadge, setTrainBadge] = useState<string>('');
  const [trainStats, setTrainStats] = useState<{total:number, unique:number}>({total:0, unique:0});
  const [exportTrainMsg, setExportTrainMsg] = useState('');
  const [importTrainMsg, setImportTrainMsg] = useState('');
  useEffect(() => {
    localStorage.setItem('prononciation_train_history', JSON.stringify(trainHistory));
    setTrainStats({ total: trainHistory.length, unique: Array.from(new Set(trainHistory)).length });
    if (trainHistory.length >= 10) setTrainBadge('Entraînement régulier');
    else if (trainHistory.length >= 5) setTrainBadge('Débutant motivé');
    else setTrainBadge('');
  }, [trainHistory]);
  // Export historique entraînement
  const exportTrainHistory = () => {
    const blob = new Blob([
      'Mot\n' + trainHistory.join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entrainement_prononciation.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExportTrainMsg('Historique entraînement exporté !');
    setTimeout(() => setExportTrainMsg(''), 2000);
  };
  // Import historique entraînement
  const importTrainHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      const mots = text.split(/\r?\n/).filter(Boolean);
      setTrainHistory(mots);
      setImportTrainMsg('Historique entraînement importé !');
      setTimeout(() => setImportTrainMsg(''), 2000);
    };
    reader.readAsText(file);
  };
  // Suppression d’un mot de l’historique
  const removeTrainHistory = (idx: number) => {
    setTrainHistory(h => h.filter((_, i) => i !== idx));
  };
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [multiAttempt, setMultiAttempt] = useState(1);
  const [importMsg, setImportMsg] = useState('');
  useEffect(() => {
    localStorage.setItem('prononciation_train_history', JSON.stringify(trainHistory));
  }, [trainHistory]);
  // Synthèse vocale native pour suggestions
  const speakSuggestion = (txt: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(txt);
      utter.lang = 'ru-RU';
      window.speechSynthesis.speak(utter);
    }
  };
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [nativeSuggestions, setNativeSuggestions] = useState<string[]>([]);
  const [exportHistoryMsg, setExportHistoryMsg] = useState('');
  // Suggestions natives (Web Speech API)
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setNativeSuggestions(['Привет', 'Доброе утро', 'До свидания', 'Спасибо', 'Пожалуйста']);
    }
  }, []);
  // Comparaison automatique de la prononciation
  const comparePrononciation = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setCompareResult('Non supporté sur ce navigateur.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      if (mot && spoken.trim().toLowerCase() === mot.trim().toLowerCase()) {
        setCompareResult('✅ Prononciation correcte !');
      } else {
        setCompareResult('❌ Prononciation différente : ' + spoken);
      }
    };
    recognition.onerror = () => setCompareResult('Erreur de reconnaissance.');
    recognition.start();
  };
  // Quiz chronométré
  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);
  const startTimedQuiz = () => {
    setQuizRandom(true);
    setQuizRandomIdx(Math.floor(Math.random() * exemples.length));
    setQuizAnswer('');
    setQuizFeedback('');
    setTimer(0);
    setTimerActive(true);
  };
  const stopTimedQuiz = () => {
    setTimerActive(false);
  };
  // Export historique quiz
  const exportHistory = () => {
    const blob = new Blob([
      'Mot\n' + history.join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_quiz_prononciation.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExportHistoryMsg('Historique exporté !');
    setTimeout(() => setExportHistoryMsg(''), 2000);
  };
  const [favoris, setFavoris] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('prononciation_favoris') || '[]');
    } catch { return []; }
  });
  const [score, setScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [shareMsg, setShareMsg] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<{[mot:string]:string[]}>({});
  const [quizRandom, setQuizRandom] = useState(false);
  const [quizRandomIdx, setQuizRandomIdx] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    localStorage.setItem('prononciation_favoris', JSON.stringify(favoris));
  }, [favoris]);

  // TTS
  const speak = (txt: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(txt);
      utter.lang = 'ru-RU';
      window.speechSynthesis.speak(utter);
    }
  };

  // Enregistrement
  const startRecording = async () => {
    setRecording(true);
    setAudioUrl(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    mediaRecorder.start();
  };
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  // Favoris
  const toggleFavori = (mot: string) => {
    setFavoris(favoris.includes(mot)
      ? favoris.filter(f => f !== mot)
      : [...favoris, mot]
    );
  };
  // Import favoris
  const importFavoris = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      const mots = text.split(/\r?\n/).filter(Boolean);
      setFavoris(mots);
      setImportMsg('Favoris importés !');
      setTimeout(() => setImportMsg(''), 2000);
    };
    reader.readAsText(file);
  };

  // Quiz
  const checkQuiz = () => {
    if (quizAnswer.trim().toLowerCase() === exemples[quizIdx].mot.trim().toLowerCase()) {
      setQuizFeedback('✅ Bonne réponse !');
      setScore(s => s + 1);
    } else {
      setQuizFeedback('❌ Mauvaise réponse.');
    }
    setHistory(h => [...h, exemples[quizIdx].mot]);
  };
  const nextQuiz = () => {
    if (quizIdx < exemples.length - 1) {
      setQuizIdx(quizIdx + 1);
      setQuizAnswer('');
      setQuizFeedback('');
    }
  };
  // Quiz aléatoire
  const startRandomQuiz = () => {
    setQuizRandom(true);
    setQuizRandomIdx(Math.floor(Math.random() * exemples.length));
    setQuizAnswer('');
    setQuizFeedback('');
  };
  const checkRandomQuiz = () => {
    if (quizAnswer.trim().toLowerCase() === exemples[quizRandomIdx].mot.trim().toLowerCase()) {
      setQuizFeedback('✅ Bonne réponse !');
      setScore(s => s + 1);
    } else {
      setQuizFeedback('❌ Mauvaise réponse.');
    }
    setHistory(h => [...h, exemples[quizRandomIdx].mot]);
  };
  const nextRandomQuiz = () => {
    setQuizRandomIdx(Math.floor(Math.random() * exemples.length));
    setQuizAnswer('');
    setQuizFeedback('');
  };

  // Export favoris
  const exportFavoris = () => {
    const blob = new Blob([
      'Mot\n' + favoris.join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favoris_prononciation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Statistiques
  const stats = {
    total: exemples.length,
    favoris: favoris.length,
    score,
    badges: BADGES.filter(b => b.condition({ favoris, score })).map(b => b.name),
    historique: history.length,
  };

  // Suggestions
  const suggestions = exemples
    .filter(e => !favoris.includes(e.mot) && e.mot.toLowerCase().includes(search.toLowerCase()))
    .map(e => e.mot);

  // Filtrage exemples
  const exemplesFiltered: typeof exemples = exemples.filter(e =>
    e.mot.toLowerCase().includes(search.toLowerCase())
  );

  // Partage
  const shareMot = (mot: string) => {
    if (navigator.share) {
      navigator.share({ title: mot, text: mot });
      setShareMsg('Mot partagé !');
      setTimeout(() => setShareMsg(''), 2000);
    } else {
      window.prompt('Copiez le mot à partager :', mot);
    }
  };

  // Commentaires
  const addComment = (mot: string) => {
    if (!commentInput.trim()) return;
    setComments(c => ({ ...c, [mot]: [...(c[mot] || []), commentInput] }));
    setCommentInput('');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Prononciation russe</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
        placeholder="Rechercher un mot ou une phrase..."
      />
      <div className={`flex gap-2 mb-4 flex-wrap ${darkMode ? 'dark' : ''} ${highContrast ? 'contrast-150' : ''}`}> 
        <button onClick={startRandomQuiz} className="bg-blue-200 px-2 py-1 rounded">Quiz aléatoire</button>
        <button onClick={startTimedQuiz} className="bg-blue-200 px-2 py-1 rounded">Quiz chronométré</button>
        <button onClick={() => setShowStats(s => !s)} className="bg-blue-100 px-2 py-1 rounded">Statistiques</button>
        <button onClick={exportFavoris} className="bg-blue-200 px-2 py-1 rounded">Exporter favoris</button>
        <label className="bg-blue-200 px-2 py-1 rounded cursor-pointer">
          Importer favoris
          <input type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={importFavoris} />
        </label>
        <button onClick={exportHistory} className="bg-blue-200 px-2 py-1 rounded">Exporter historique quiz</button>
        <button onClick={() => setDarkMode(d => !d)} className="bg-gray-300 px-2 py-1 rounded">{darkMode ? 'Mode clair' : 'Mode nuit'}</button>
        <button onClick={() => setHighContrast(h => !h)} className="bg-gray-300 px-2 py-1 rounded">{highContrast ? 'Contraste normal' : 'Contraste élevé'}</button>
      </div>
      {importMsg && <div className="mb-2 text-green-600">{importMsg}</div>}
      {exportHistoryMsg && <div className="mb-2 text-green-600">{exportHistoryMsg}</div>}
      {nativeSuggestions.length > 0 && (
        <div className="mb-4">
          <div className="font-bold">Suggestions natives :</div>
          <ul className="list-disc pl-4">
            {nativeSuggestions.map(s => (
              <li key={s} className="flex items-center gap-2">
                {s}
                <button onClick={() => speakSuggestion(s)} className="bg-blue-100 px-2 py-1 rounded">🔊</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showStats && (
        <div className="mb-4 bg-blue-50 p-4 rounded">
          <div className="font-bold mb-2">Statistiques :</div>
          <div>Total mots/phrases : {stats.total}</div>
          <div>Favoris : {stats.favoris}</div>
          <div>Score quiz : {stats.score}</div>
          <div>Badges : {stats.badges.join(', ')}</div>
          <div>Historique quiz : {stats.historique}</div>
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <div className="font-bold">Suggestions :</div>
          <ul className="list-disc pl-4">
            {suggestions.map(s => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
      {shareMsg && <div className="mb-2 text-green-600">{shareMsg}</div>}
      <div className="mb-4 grid gap-4">
        {exemplesFiltered.map((e) => (
          <div key={e.mot} className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow flex flex-col">
            <div className="font-bold text-lg mb-2">{e.mot}</div>
            <audio controls src={e.audio} className="mb-2" />
            <button onClick={() => speak(e.tts)} className="bg-blue-200 text-blue-900 px-3 py-1 rounded mb-2">🔊 Synthèse vocale</button>
            <button onClick={() => setMot(e.mot)} className="bg-blue-100 text-blue-900 px-3 py-1 rounded mb-2">S’entraîner</button>
            <button onClick={() => toggleFavori(e.mot)} className={favoris.includes(e.mot) ? 'bg-yellow-200' : 'bg-gray-100'}>★ Favori</button>
            <button onClick={() => shareMot(e.mot)} className="bg-blue-100 text-blue-900 px-3 py-1 rounded mb-2">📤 Partager</button>
            <div className="mt-2">
              <div className="font-bold text-xs mb-1">Commentaires :</div>
              <ul className="text-xs">
                {(comments[e.mot] || []).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <input value={commentInput} onChange={e => setCommentInput(e.target.value)} className="border rounded px-2 py-1 mt-1 w-full" placeholder="Ajouter un commentaire..." />
              <button onClick={() => addComment(e.mot)} className="bg-blue-200 text-blue-900 px-2 py-1 rounded mt-1">Ajouter</button>
            </div>
          </div>
        ))}
      </div>
      {favoris.length > 0 && (
        <div className="mt-8">
          <div className="font-bold mb-2">Favoris :</div>
          <ul className="list-disc pl-4">
            {favoris.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}
      {mot && (
        <div className="mb-8 bg-blue-100 p-4 rounded">
          <div className="font-bold mb-2">Entraînement sur : {mot}</div>
          <button onClick={() => speak(mot)} className="bg-blue-200 text-blue-900 px-3 py-1 rounded mb-2">🔊 Écouter</button>
          {!recording ? (
            <button onClick={startRecording} className="bg-blue-600 text-white px-3 py-1 rounded mb-2">🎤 Enregistrer ma prononciation</button>
          ) : (
            <button onClick={stopRecording} className="bg-blue-400 text-white px-3 py-1 rounded mb-2">⏹️ Arrêter</button>
          )}
          <button onClick={comparePrononciation} className="bg-blue-300 text-blue-900 px-3 py-1 rounded mb-2">🔎 Comparer ma prononciation</button>
          <button onClick={() => setTrainHistory([...trainHistory, mot])} className="bg-gray-200 px-2 py-1 rounded mb-2">Ajouter à l’historique d’entraînement</button>
          {compareResult && <div className="mt-2 font-bold">{compareResult}</div>}
          {audioUrl && (
            <div className="mt-4">
              <div className="font-bold">Votre enregistrement :</div>
              <audio controls src={audioUrl} />
              <button onClick={() => setFavoris([...favoris, mot])} className="bg-yellow-200 px-2 py-1 rounded mt-2">Ajouter l’audio aux favoris</button>
            </div>
          )}
          <button onClick={() => setMot('')} className="mt-4 bg-gray-200 px-2 py-1 rounded">Quitter</button>
        </div>
      )}
      {!quizRandom ? (
        <div className="mt-8 bg-blue-50 p-4 rounded">
          <div className="font-bold mb-2">Quiz prononciation</div>
          <div className="mb-2">Écrivez le mot entendu :</div>
          <audio controls src={exemples[quizIdx].audio} className="mb-2" />
          <input
            value={quizAnswer}
            onChange={e => setQuizAnswer(e.target.value)}
            className="border rounded px-2 py-1 mb-2 w-full"
            placeholder="Votre réponse..."
            aria-label="Réponse au quiz"
          />
          <div className="mb-2">Tentatives :
            <input type="number" min={1} max={5} value={multiAttempt} onChange={e => setMultiAttempt(Number(e.target.value))} className="ml-2 w-16 border rounded px-1" />
          </div>
          <button onClick={() => { for(let i=0;i<multiAttempt;i++) checkQuiz(); }} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Vérifier ({multiAttempt})</button>
          <button onClick={nextQuiz} className="bg-blue-200 text-blue-900 px-3 py-1 rounded">Suivant</button>
          {quizFeedback && <div className="mt-2">{quizFeedback}</div>}
        </div>
      ) : (
        <div className="mt-8 bg-blue-100 p-4 rounded">
          <div className="font-bold mb-2">Quiz chronométré</div>
          <div className="mb-2">Écrivez le mot entendu :</div>
          <audio controls src={exemples[quizRandomIdx].audio} className="mb-2" />
          <input
            value={quizAnswer}
            onChange={e => setQuizAnswer(e.target.value)}
            className="border rounded px-2 py-1 mb-2 w-full"
            placeholder="Votre réponse..."
            aria-label="Réponse au quiz chronométré"
          />
          <div className="mb-2">⏱️ Temps : {timer}s</div>
          <button onClick={checkRandomQuiz} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Vérifier</button>
          <button onClick={nextRandomQuiz} className="bg-blue-200 text-blue-900 px-3 py-1 rounded">Suivant</button>
          <button onClick={() => { setQuizRandom(false); stopTimedQuiz(); }} className="bg-gray-200 px-2 py-1 rounded ml-2">Quitter</button>
          {quizFeedback && <div className="mt-2">{quizFeedback}</div>}
        </div>
      )}
      {trainHistory.length > 0 && (
        <div className="mt-8">
          <div className="font-bold mb-2">Historique d’entraînement :</div>
          <div className="mb-2 flex gap-2 flex-wrap">
            <button onClick={exportTrainHistory} className="bg-blue-200 px-2 py-1 rounded">Exporter</button>
            <label className="bg-blue-200 px-2 py-1 rounded cursor-pointer">
              Importer
              <input type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={importTrainHistory} />
            </label>
          </div>
          {exportTrainMsg && <div className="mb-2 text-green-600">{exportTrainMsg}</div>}
          {importTrainMsg && <div className="mb-2 text-green-600">{importTrainMsg}</div>}
          <div className="mb-2">Badge : <span className="font-bold">{trainBadge}</span></div>
          <div className="mb-2">Stats : {trainStats.total} entraînements, {trainStats.unique} mots uniques</div>
          <ul className="list-disc pl-4">
            {trainHistory.map((m, i) => (
              <li key={i} className="flex items-center gap-2">
                {m}
                <button onClick={() => removeTrainHistory(i)} className="bg-red-100 px-2 py-1 rounded text-xs">Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Quiz audio et quiz suggestions */}
      <div className="mt-8">
        <div className="font-bold mb-2">Quiz audio (écoutez et écrivez) :</div>
        <audio controls src={exemples[quizIdx].audio} className="mb-2" />
        <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)} className="border rounded px-2 py-1 mb-2 w-full" placeholder="Votre réponse..." />
        <button onClick={checkQuiz} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Vérifier</button>
      </div>
      <div className="mt-8">
        <div className="font-bold mb-2">Quiz suggestions natives :</div>
        <ul className="list-disc pl-4">
          {nativeSuggestions.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              {s}
              <button onClick={() => setQuizAnswer(s)} className="bg-blue-100 px-2 py-1 rounded text-xs">Utiliser</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Aide contextuelle */}
      <div className="mt-8 bg-gray-50 p-4 rounded">
        <div className="font-bold mb-2">Aide & Astuces :</div>
        <ul className="list-disc pl-4">
          <li>Utilisez le mode nuit ou contraste élevé pour le confort visuel.</li>
          <li>Ajoutez vos mots favoris pour les réviser plus tard.</li>
          <li>Exportez/importez vos favoris et historiques pour sauvegarder vos progrès.</li>
          <li>Essayez la comparaison automatique pour améliorer votre prononciation.</li>
          <li>Utilisez les suggestions natives pour enrichir votre vocabulaire.</li>
        </ul>
      </div>
    </div>
  );
};

export default Prononciation;
