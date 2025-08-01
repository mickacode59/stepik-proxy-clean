import React, { useState } from 'react';

const stations = [
  {
    name: 'Russkoe Radio',
    stream: 'https://rusradio.hostingradio.ru/rusradio128.mp3',
  },
  {
    name: 'Radio Mayak',
    stream: 'https://icecast-vgtrk.cdnvideo.ru/mayakfm_mp3_192kbps',
  },
  {
    name: 'Europa Plus',
    stream: 'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
  },
  {
    name: 'Radio Russia',
    stream: 'https://icecast-vgtrk.cdnvideo.ru/rrzonam_mp3_192kbps',
  }
];



const RadioPlayer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // L'audio reste monté en arrière-plan
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:1000}}>
      {/* Widget visuel */}
      <div className={`transition-all duration-300 ${open ? 'w-80 h-40' : 'w-16 h-16'} bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center`}>
        {open ? (
          <>
            <div className="flex gap-2 mb-2">
              {stations.map((station, idx) => (
                <button
                  key={station.name}
                  className={`px-2 py-1 rounded font-semibold text-xs ${current === idx ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                  onClick={() => { setCurrent(idx); setError(false); if(audioRef.current) { audioRef.current.load(); audioRef.current.play(); } }}
                >
                  {station.name}
                </button>
              ))}
            </div>
            {/* Contrôles audio visibles */}
            <audio
              ref={audioRef}
              controls
              src={stations[current].stream}
              className="w-full"
              crossOrigin="anonymous"
              onError={() => {
                setError(true);
                if (current < stations.length - 1) setCurrent(current + 1);
                else setCurrent(0);
              }}
            >
              Votre navigateur ne supporte pas l’audio HTML5.
            </audio>
            {error && (
              <div className="text-xs text-red-600 mt-2">
                Impossible de charger la radio. Essayez une autre station ou vérifiez votre connexion.<br />
                Si l’audio ne démarre pas, vérifiez que votre navigateur autorise l’autoplay et le son sur ce site.
              </div>
            )}
            <button className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" onClick={()=>setOpen(false)}>Minimiser</button>
          </>
        ) : (
          <button className="w-16 h-16 flex items-center justify-center bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-colors" onClick={()=>setOpen(true)} title="Ouvrir la radio russe">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white"><circle cx="12" cy="12" r="10" strokeWidth="2"/><rect x="7" y="9" width="10" height="6" rx="2" strokeWidth="2"/><circle cx="12" cy="12" r="1.5" fill="white"/></svg>
          </button>
        )}
      </div>
      {/* Audio monté en arrière-plan, invisible si minimisé */}
      {/* Audio monté en arrière-plan, invisible si minimisé, sans autoplay */}
      {!open && (
        <audio
          ref={audioRef}
          src={stations[current].stream}
          style={{display:'none'}}
          crossOrigin="anonymous"
          onError={() => {
            setError(true);
            if (current < stations.length - 1) setCurrent(current + 1);
            else setCurrent(0);
          }}
        />
      )}
    </div>
  );
};

export default RadioPlayer;
