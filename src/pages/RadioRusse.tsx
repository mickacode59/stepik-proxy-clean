import React, { useState } from 'react';

const stations = [
  {
    name: 'Russkoe Radio',
    stream: 'https://rusradio.hostingradio.ru/rusradio128.mp3',
    description: 'La radio pop la plus populaire de Russie.'
  },
  {
    name: 'Radio Mayak',
    stream: 'https://icecast-vgtrk.cdnvideo.ru/mayakfm_mp3_192kbps',
    description: 'Station d’actualité, culture et musique russe.'
  },
  {
    name: 'Europa Plus',
    stream: 'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
    description: 'Hits internationaux et russes.'
  },
  {
    name: 'Radio Russia',
    stream: 'https://icecast-vgtrk.cdnvideo.ru/rrzonam_mp3_192kbps',
    description: 'Radio nationale russe, infos et musique.'
  }
];

const RadioRusse: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Gestion lecture/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  // Changement de station
  const handleStationChange = (idx: number) => {
    setCurrent(idx);
    setLoading(true);
    setError(false);
    setPlaying(true);
    setTimeout(() => setLoading(false), 1200); // loader visuel
  };

  // Gestion erreurs audio
  const handleAudioError = () => {
    setError(true);
    setLoading(false);
    setPlaying(false);
  };

  // Loader visuel
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mb-4"></div>
      <div className="text-red-500 font-semibold">Chargement de la radio...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 p-8 relative">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-8 text-center flex items-center justify-center gap-3">
          <span className="inline-block animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ef4444" opacity="0.2"/><path d="M8 12V8a4 4 0 018 0v4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          Radio russe en direct
        </h1>
        <div className="mb-6 flex gap-3 flex-wrap justify-center">
          {stations.map((station, idx) => (
            <button
              key={station.name}
              className={`px-4 py-2 rounded-full font-semibold shadow transition-colors border-2 ${current === idx ? 'bg-red-600 text-white border-red-600 scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/30 border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleStationChange(idx)}
            >
              {station.name}
            </button>
          ))}
        </div>
        <div className="mb-4 text-lg font-semibold text-red-700 dark:text-red-300 text-center">
          {stations[current].description}
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handlePlayPause}
              className={`rounded-full p-3 bg-red-500 hover:bg-red-600 text-white shadow-lg transition focus-visible:ring-2 focus-visible:ring-red-500 outline-none`}
              aria-label={playing ? 'Pause' : 'Lecture'}
            >
              {playing ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="4" height="12" rx="2" fill="white"/><rect x="14" y="6" width="4" height="12" rx="2" fill="white"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="6,4 20,12 6,20" fill="white"/></svg>
              )}
            </button>
            <span className="font-semibold text-red-600 dark:text-red-300 text-lg">
              {stations[current].name}
            </span>
          </div>
          {loading ? <Loader /> : (
            <audio
              ref={audioRef}
              controls
              autoPlay={playing}
              src={stations[current].stream}
              className="w-full mb-2"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onError={handleAudioError}
            >
              Votre navigateur ne supporte pas l’audio HTML5.
            </audio>
          )}
          {error && (
            <div className="text-center text-xs text-red-600 mt-2">
              Erreur de lecture. Essayez une autre station ou vérifiez votre connexion.
            </div>
          )}
        </div>
        <div className="text-center text-xs text-red-600 mt-2">
          Si la radio ne démarre pas, essayez une autre station ou vérifiez que votre navigateur autorise le son et l’autoplay.
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Astuce TDAH : Écoute la radio en fond pour t’immerger dans la langue, fais une pause quand tu veux !</div>
      </div>
    </div>
  );
};

export default RadioRusse;
