export default SavierVous;
// Fin du fichier. Tout le code suivant est supprimé.
// Suppression de tout le code suivant pour garantir un fichier propre et compilable.
export default SavierVous;
// Tout le code suivant est supprimé pour garantir un composant propre et compilable.
import React from 'react';

const anecdotes = [
  {
    text: "Le chant folklorique russe est très riche. Écoutez un extrait typique !",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Russian_folk_singers.jpg",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    explication: "Pour les TDAH, imagine un groupe qui chante autour d’un feu, chaque voix raconte une histoire !"
  },
  {
    text: "Le Transsibérien est le train le plus long du monde. Regardez-le en vidéo !",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Transsiberian_train.jpg",
    video: "https://www.youtube.com/embed/2z8bFvQb0nA",
    explication: "Pour les TDAH, visualise un voyage sans fin à travers des paysages incroyables, comme dans un film d’aventure !"
  },
  {
    text: "Le samovar est un symbole de l’hospitalité russe. Il sert à préparer le thé et rassemble famille et amis autour de la table.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Samovar_in_Russia.jpg",
    explication: "En Russie, offrir du thé avec un samovar est un geste chaleureux. Pour les TDAH, imagine le samovar comme le centre d’un dessin animé où tout le monde se retrouve pour discuter et partager des histoires !"
  },
  {
    text: "Les Russes adorent les blinis, des crêpes fines servies avec du miel, du caviar ou de la crème.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Blini_with_caviar.jpg",
    explication: "Les blinis sont présents lors des fêtes et des petits-déjeuners. Pour les TDAH, pense à une pile de crêpes magiques qui changent de goût selon l’imagination !"
  },
  {
    text: "La Place Rouge n’est pas rouge à cause de sa couleur, mais parce que le mot ‘rouge’ signifiait ‘beau’ en vieux russe.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RedSquare_Moscow.jpg",
    explication: "Pour les TDAH, imagine une place immense où chaque pierre raconte une histoire, et où le mot ‘rouge’ veut dire ‘magnifique’ !"
  },
  {
    text: "Les Russes aiment raconter des anecdotes et des blagues, souvent sur la météo ou la vie quotidienne.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Russian_winter.jpg",
    explication: "L’humour russe est parfois absurde ou ironique. Pour les TDAH, c’est comme des mini-histoires qui font sourire et réfléchir !"
  },
  {
    text: "Le ballet russe est célèbre dans le monde entier, avec des compagnies comme le Bolchoï et le Mariinsky.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Bolshoi_Theatre_Moscow.jpg",
    explication: "Pour les TDAH, imagine des danseurs qui racontent des histoires avec leurs mouvements, comme des personnages magiques sur scène !"
  },
  {
    text: "Les Russes célèbrent la Maslenitsa, une fête traditionnelle où l’on mange des blinis et brûle un épouvantail pour dire adieu à l’hiver.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Maslenitsa_2010.jpg",
    explication: "Pour les TDAH, pense à une fête colorée où tout le monde danse, mange et célèbre le retour du soleil !"
  },
  {
    text: "Le métro de Moscou est considéré comme l’un des plus beaux du monde, avec des stations décorées comme des palais.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Moscow_Metro_Komsomolskaya.jpg",
    explication: "Pour les TDAH, imagine que chaque station est un décor de film ou de jeu vidéo, à explorer comme un aventurier !"
  },
  {
    text: "Les Russes aiment les animaux, surtout les chats et les chiens. Beaucoup de familles ont un animal de compagnie.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Russian_Blue_Cat.jpg",
    explication: "Pour les TDAH, pense à un chat ou un chien comme un ami fidèle qui partage les aventures du quotidien !"
  }
];

const random = () => Math.floor(Math.random() * anecdotes.length);

const SavierVous = () => {
  const [idx, setIdx] = React.useState(random());
  return (
    <div className="transition-all duration-300 w-80 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-4 animate-fade-in animate-bounce-in relative">
      <div className="font-bold text-red-700 dark:text-red-300 mb-2 text-lg animate-pulse">Le saviez-vous ?</div>
      <img src={anecdotes[idx].image} alt="Anecdote russe" className="w-32 h-32 object-cover rounded-xl mb-2 shadow transition-transform duration-500 hover:scale-105" />
      <div className="text-gray-700 dark:text-gray-200 text-base mb-2 text-center animate-fade-in">{anecdotes[idx].text}</div>
      {anecdotes[idx].audio && (
        <audio controls src={anecdotes[idx].audio} className="w-full mb-2 rounded">
          Votre navigateur ne supporte pas l’audio HTML5.
        </audio>
      )}
      {anecdotes[idx].video && (
        <div className="w-full mb-2 rounded overflow-hidden">
          <iframe width="100%" height="120" src={anecdotes[idx].video} title="Anecdote vidéo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )}
      <div className="text-yellow-700 dark:text-yellow-200 text-sm italic mb-2 text-center animate-fade-in">{anecdotes[idx].explication}</div>
      <div className="flex gap-2 mb-2">
        <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-xs" onClick={()=>setIdx(random())}>Une autre anecdote</button>
      </div>
    </div>
  );
};

export default SavierVous;

import React from 'react';

const anecdotes = [
  {
    text: "Le chant folklorique russe est très riche. Écoutez un extrait typique !",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Russian_folk_singers.jpg",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    explication: "Pour les TDAH, imagine un groupe qui chante autour d’un feu, chaque voix raconte une histoire !"
  },
  {
    text: "Le Transsibérien est le train le plus long du monde. Regardez-le en vidéo !",

const SavierVous: React.FC = () => {
  const [idx, setIdx] = React.useState(random());
  const [showFavs, setShowFavs] = React.useState(false);
  const [favs, setFavs] = React.useState<any[]>([]);
  const [visible, setVisible] = React.useState(true);

  // Version simplifiée, sans fallback ni proxy
  return (
    <div className="transition-all duration-300 w-80 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-4 animate-fade-in animate-bounce-in relative">
      <div className="font-bold text-red-700 dark:text-red-300 mb-2 text-lg animate-pulse">Le saviez-vous ?</div>
      <img src={anecdotes[idx].image} alt="Anecdote russe" className="w-32 h-32 object-cover rounded-xl mb-2 shadow transition-transform duration-500 hover:scale-105" />
      <div className="text-gray-700 dark:text-gray-200 text-base mb-2 text-center animate-fade-in">{anecdotes[idx].text}</div>
      {anecdotes[idx].audio && (
        <audio controls src={anecdotes[idx].audio} className="w-full mb-2 rounded">
          Votre navigateur ne supporte pas l’audio HTML5.
        </audio>
      )}
      {anecdotes[idx].video && (
        <div className="w-full mb-2 rounded overflow-hidden">
          <iframe width="100%" height="120" src={anecdotes[idx].video} title="Anecdote vidéo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )}
      <div className="text-yellow-700 dark:text-yellow-200 text-sm italic mb-2 text-center animate-fade-in">{anecdotes[idx].explication}</div>
      <div className="flex gap-2 mb-2">
        <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-xs" onClick={()=>setIdx(random())}>Une autre anecdote</button>
      </div>
    </div>
  );
};
                      const newFavs = favs.filter((_,j)=>j!==i);
                      setFavs(newFavs);
                      window.localStorage.setItem('saviervous_favs', JSON.stringify(newFavs));
                    }}>Supprimer</button>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mb-2">
              <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs" onClick={()=>{
                if(favs.length===0) return alert('Aucune anecdote à partager');
                const msg = favs.map((a: any, i: number) => `${i+1}. ${a.text}`).join('\n\n');
                navigator.share ? navigator.share({title:'Mes anecdotes russes',text:msg,url:window.location.href}) : alert('Partage non supporté sur ce navigateur');
              }}>Partager la liste</button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs" onClick={()=>setShowFavs(false)}>Retour</button>
            </div>
          </>
        ) : (
          <>
            <div className="font-bold text-red-700 dark:text-red-300 mb-2 text-lg animate-pulse">Le saviez-vous ?</div>
            <img src={anecdotes[idx].image} alt="Anecdote russe" className="w-32 h-32 object-cover rounded-xl mb-2 shadow transition-transform duration-500 hover:scale-105" onError={()=>setErrorImg(true)} />
            {errorImg && <div className="text-xs text-red-600">Image non disponible. <img src="/favicon.svg" alt="Image de secours" className="w-10 h-10 inline" /></div>}
            <div className="text-gray-700 dark:text-gray-200 text-base mb-2 text-center animate-fade-in">{anecdotes[idx].text}</div>
            {anecdotes[idx].audio && (
              <audio controls src={anecdotes[idx].audio} className="w-full mb-2 rounded" onError={()=>setErrorAudio(true)}>
                Votre navigateur ne supporte pas l’audio HTML5.
              </audio>
            )}
            {errorAudio && <div className="text-xs text-red-600">Audio non disponible. <a href={anecdotes[idx].audio} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Écouter le fichier</a></div>}
            {anecdotes[idx].video && (
              <div className="w-full mb-2 rounded overflow-hidden">
            <iframe width="100%" height="120" src={anecdotes[idx].video} title="Anecdote vidéo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen onError={()=>setErrorVideo(true)}></iframe>
                {errorVideo && (
                  <div className="text-xs text-red-600">Vidéo non disponible. <a href={anecdotes[idx].video} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Voir sur YouTube</a></div>
                )}
              </div>
            )}
            <div className="text-yellow-700 dark:text-yellow-200 text-sm italic mb-2 text-center animate-fade-in">{anecdotes[idx].explication}</div>
            <div className="flex gap-2 mb-2">
              <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg font-semibold shadow hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-xs" onClick={()=>setIdx(random())}>Une autre anecdote</button>
              <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-xs" onClick={()=>{
                const favs = JSON.parse(window.localStorage.getItem('saviervous_favs')||'[]');
                favs.push(anecdotes[idx]);
                window.localStorage.setItem('saviervous_favs', JSON.stringify(favs));
                alert('Anecdote ajoutée aux favoris !');
              }}>Ajouter aux favoris</button>
              <button className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors text-xs" onClick={()=>setShowFavs(true)}>Mes favoris</button>
            </div>
            <div className="flex gap-2 mb-2">
              <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs" onClick={()=>navigator.share ? navigator.share({title:'Le saviez-vous russe',text:anecdotes[idx].text,url:window.location.href}) : alert('Partage non supporté sur ce navigateur')}>Partager</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavierVous;
