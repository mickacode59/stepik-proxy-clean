import React, { useState, useEffect } from 'react';

const fiches = [
  {
    id: 'impersonnels',
    titre: 'Les verbes impersonnels russes',
    resume: 'Verbes sans sujet, construction, exemples.',
    contenu: `
      <ul>
        <li>Можно (on peut), надо (il faut), нельзя (on ne peut pas)</li>
        <li>Usage sans sujet explicite</li>
        <li>Exemples : Здесь нельзя курить (On ne peut pas fumer ici)</li>
      </ul>
      <p>Exercices, nuances de sens.</p>
    `,
    quiz: [
      { q: 'Comment dire “il faut” en russe ?', a: 'надо' },
      { q: 'Donnez un verbe impersonnel.', a: 'можно' },
    ],
  },
  {
    id: 'mouvement',
    titre: 'Les verbes de mouvement russes',
    resume: 'Aller, venir, marcher, courir, nuances, préfixes.',
    contenu: `
      <ul>
        <li>идти (aller à pied), ехать (aller en véhicule), лететь (voler)</li>
        <li>Verbes unidirectionnels et multidirectionnels</li>
        <li>Préfixes pour indiquer le but ou le départ</li>
      </ul>
      <p>Exemples, tableaux, exercices.</p>
    `,
    quiz: [
      { q: 'Comment dire “aller à pied” ?', a: 'идти' },
      { q: 'Quel verbe pour “aller en véhicule” ?', a: 'ехать' },
    ],
  },
  {
    id: 'formation_mots',
    titre: 'Formation des mots russes',
    resume: 'Dérivation, composition, racines, suffixes, préfixes.',
    contenu: `
      <ul>
        <li>Racines : пис- (écrire), чит- (lire)</li>
        <li>Suffixes : -ник, -ость, -ение</li>
        <li>Préfixes : по-, пере-, вы-, за-</li>
        <li>Composition de mots</li>
      </ul>
      <p>Exemples, exercices, création de mots.</p>
    `,
    quiz: [
      { q: 'Donnez un suffixe russe.', a: 'ник' },
      { q: 'Donnez un préfixe russe.', a: 'по' },
    ],
  },
  {
    id: 'diminutifs',
    titre: 'Les diminutifs russes',
    resume: 'Formes affectueuses, suffixes, usage.',
    contenu: `
      <ul>
        <li>Suffixes : -очка, -ик, -енька</li>
        <li>Exemples : мамочка (petite maman), сынок (petit fils)</li>
        <li>Usage dans la famille, entre amis</li>
      </ul>
      <p>Exercices, nuances affectives.</p>
    `,
    quiz: [
      { q: 'Donnez un diminutif de “maman”.', a: 'мамочка' },
      { q: 'Quel suffixe forme un diminutif ?', a: 'очка' },
    ],
  },
  {
    id: 'style_direct_indirect',
    titre: 'Style direct et indirect en russe',
    resume: 'Rapport du discours, transformation, exemples.',
    contenu: `
      <ul>
        <li>Style direct : “Он сказал: Я приду.”</li>
        <li>Style indirect : “Он сказал, что он придет.”</li>
        <li>Transformation du temps et des pronoms</li>
      </ul>
      <p>Exercices, différences avec le français.</p>
    `,
    quiz: [
      { q: 'Comment introduire le style indirect ?', a: 'что' },
      { q: 'Donnez un exemple de style direct.', a: 'Он сказал: Я приду.' },
    ],
  },
  {
    id: 'questions',
    titre: 'Les questions en russe',
    resume: 'Formulation, mots interrogatifs, intonation.',
    contenu: `
      <ul>
        <li>Qui ? Кто ?</li>
        <li>Quoi ? Что ?</li>
        <li>Où ? Где ?</li>
        <li>Comment ? Как ?</li>
        <li>Intonation montante</li>
      </ul>
      <p>Exemples, exercices, questions ouvertes et fermées.</p>
    `,
    quiz: [
      { q: 'Comment dire “où” en russe ?', a: 'где' },
      { q: 'Quel mot pour “qui” ?', a: 'кто' },
    ],
  },
  {
    id: 'exclamations',
    titre: 'Les exclamations russes',
    resume: 'Formes, intonation, expressions courantes.',
    contenu: `
      <ul>
        <li>Как красиво ! (Comme c’est beau !)</li>
        <li>Какой сюрприз ! (Quelle surprise !)</li>
        <li>Вот это да ! (Ça alors !)</li>
      </ul>
      <p>Exercices, nuances d’intonation.</p>
    `,
    quiz: [
      { q: 'Comment dire “Quelle surprise !” ?', a: 'Какой сюрприз !' },
      { q: 'Donnez une exclamation russe.', a: 'Вот это да !' },
    ],
  },
  {
    id: 'temps_composes',
    titre: 'Les temps composés en russe',
    resume: 'Futur composé, passé composé, usage, exemples.',
    contenu: `
      <ul>
        <li>Futur composé : буду читать (je vais lire)</li>
        <li>Passé composé : был написан (a été écrit)</li>
        <li>Usage des auxiliaires</li>
      </ul>
      <p>Exercices, différences avec le français.</p>
    `,
    quiz: [
      { q: 'Comment former le futur composé ?', a: 'буду + infinitif' },
      { q: 'Donnez un exemple de passé composé.', a: 'был написан' },
    ],
  },
  {
    id: 'voix_passive',
    titre: 'La voix passive en russe',
    resume: 'Construction, usage, exemples.',
    contenu: `
      <ul>
        <li>Formée avec être + participe passif</li>
        <li>Exemple : Книга была написана (Le livre a été écrit)</li>
        <li>Usage dans la presse, la littérature</li>
      </ul>
      <p>Exercices, transformation de phrases.</p>
    `,
    quiz: [
      { q: 'Comment dire “Le livre a été écrit” ?', a: 'Книга была написана' },
      { q: 'Comment former la voix passive ?', a: 'être + participe passif' },
    ],
  },
  {
    id: 'formel_informel',
    titre: 'Style formel et informel en russe',
    resume: 'Différences, usage, exemples, politesse.',
    contenu: `
      <ul>
        <li>Formel : вы, господин, пожалуйста</li>
        <li>Informel : ты, привет, пока</li>
        <li>Usage selon le contexte</li>
      </ul>
      <p>Exercices, transformation de phrases.</p>
    `,
    quiz: [
      { q: 'Quel pronom est formel ?', a: 'вы' },
      { q: 'Comment dire “salut” en russe ?', a: 'привет' },
    ],
  },
  {
    id: 'politesse',
    titre: 'Expressions de politesse russes',
    resume: 'Salutations, remerciements, excuses.',
    contenu: `
      <ul>
        <li>Здравствуйте (Bonjour)</li>
        <li>Спасибо (Merci)</li>
        <li>Извините (Excusez-moi)</li>
        <li>Пожалуйста (S’il vous plaît)</li>
      </ul>
      <p>Exercices, usage dans la vie courante.</p>
    `,
    quiz: [
      { q: 'Comment dire “merci” en russe ?', a: 'Спасибо' },
      { q: 'Comment dire “excusez-moi” ?', a: 'Извините' },
    ],
  },
  {
    id: 'connecteurs',
    titre: 'Connecteurs logiques russes',
    resume: 'Pour organiser le discours, relier les idées.',
    contenu: `
      <ul>
        <li>поэтому (donc), однако (cependant), кроме того (de plus)</li>
        <li>Usage dans la rédaction, l’argumentation</li>
      </ul>
      <p>Exercices, exemples de phrases.</p>
    `,
    quiz: [
      { q: 'Comment dire “donc” en russe ?', a: 'поэтому' },
      { q: 'Donnez un connecteur logique.', a: 'однако' },
    ],
  },
  {
    id: 'syntaxe_avancee',
    titre: 'Syntaxe avancée russe',
    resume: 'Subordination, coordination, phrases complexes.',
    contenu: `
      <ul>
        <li>Subordination : когда, если, потому что</li>
        <li>Coordination : и, но, а</li>
        <li>Phrases complexes, propositions subordonnées</li>
      </ul>
      <p>Exercices, exemples, transformation de phrases.</p>
    `,
    quiz: [
      { q: 'Donnez une conjonction de subordination.', a: 'когда' },
      { q: 'Donnez une conjonction de coordination.', a: 'и' },
    ],
  },
  {
    id: 'interjections',
    titre: 'Les interjections russes',
    resume: 'Exclamations, émotions, expressions courantes.',
    contenu: `
      <ul>
        <li>Ой ! (Oh !)</li>
        <li>Ура ! (Hourra !)</li>
        <li>Ай ! (Aïe !)</li>
        <li>Боже мой ! (Mon Dieu !)</li>
        <li>Пожалуйста ! (S’il vous plaît !)</li>
      </ul>
      <p>Utilisation dans la conversation, nuances d’émotion.</p>
    `,
    quiz: [
      { q: 'Comment dire “Oh !” en russe ?', a: 'Ой' },
      { q: 'Quelle interjection exprime la joie ?', a: 'Ура' },
    ],
  },
  {
    id: 'participes',
    titre: 'Les participes russes',
    resume: 'Participes actifs, passifs, formation et usage.',
    contenu: `
      <ul>
        <li>Participes actifs : читающий (qui lit)</li>
        <li>Participes passifs : написанный (écrit)</li>
        <li>Formation des participes</li>
        <li>Usage dans la phrase</li>
      </ul>
      <p>Exemples, exercices, différences avec le français.</p>
    `,
    quiz: [
      { q: 'Donnez un participe actif russe.', a: 'читающий' },
      { q: 'Donnez un participe passif russe.', a: 'написанный' },
    ],
  },
  {
    id: 'verbes_pronominaux',
    titre: 'Les verbes pronominaux russes',
    resume: 'Verbes réfléchis, construction, exemples.',
    contenu: `
      <ul>
        <li>Se termine par -ся : учиться (apprendre), бояться (avoir peur)</li>
        <li>Usage et sens</li>
        <li>Différence avec les verbes non pronominaux</li>
      </ul>
      <p>Exemples, exercices, nuances de sens.</p>
    `,
    quiz: [
      { q: 'Comment se termine un verbe pronominal russe ?', a: 'ся' },
      { q: 'Donnez un verbe pronominal.', a: 'учиться' },
    ],
  },
  {
    id: 'syntaxe',
    titre: 'La syntaxe russe',
    resume: 'Ordre des mots, inversion, emphase, coordination.',
    contenu: `
      <ul>
        <li>Ordre habituel : Sujet-Verbe-Objet</li>
        <li>Inversion pour l’emphase</li>
        <li>Coordination et subordination</li>
        <li>Usage des virgules</li>
      </ul>
      <p>Exemples, exercices, différences avec le français.</p>
    `,
    quiz: [
      { q: 'Quel est l’ordre des mots habituel en russe ?', a: 'Sujet-Verbe-Objet' },
      { q: 'Pourquoi utilise-t-on l’inversion ?', a: 'Emphase' },
    ],
  },
  {
    id: 'negation',
    titre: 'La négation en russe',
    resume: 'Formes de négation, double négation, exemples.',
    contenu: `
      <ul>
        <li>Не + verbe : Я не знаю (Je ne sais pas)</li>
        <li>Никто, ничего, никогда : personne, rien, jamais</li>
        <li>Double négation : Я никого не вижу (Je ne vois personne)</li>
      </ul>
      <p>Exemples, exercices, pièges à éviter.</p>
    `,
    quiz: [
      { q: 'Comment dire “je ne sais pas” ?', a: 'Я не знаю' },
      { q: 'Comment exprimer la double négation ?', a: 'Я никого не вижу' },
    ],
  },
  {
    id: 'idiomes',
    titre: 'Expressions idiomatiques russes',
    resume: 'Locutions, proverbes, expressions courantes.',
    contenu: `
      <ul>
        <li>Без труда не вытащишь и рыбку из пруда (On n’a rien sans effort)</li>
        <li>Вешать лапшу на уши (Raconter des salades)</li>
        <li>Держать камень за пазухой (Garder rancune)</li>
        <li>Как две капли воды (Comme deux gouttes d’eau)</li>
      </ul>
      <p>Exemples, explications, usage dans la vie courante.</p>
    `,
    quiz: [
      { q: 'Comment dire “On n’a rien sans effort” en russe ?', a: 'Без труда не вытащишь и рыбку из пруда' },
      { q: 'Donnez une expression pour “raconter des salades”.', a: 'Вешать лапшу на уши' },
    ],
  },
  {
    id: 'cases',
    titre: 'Les cas russes',
    resume: 'Explication des 6 cas russes, usages et déclinaisons. Tableaux, exemples, astuces mnémotechniques.',
    contenu: `
      <ul>
        <li><b>Nominatif</b> : sujet du verbe, exemple : <i>Я студент</i> (Je suis étudiant)</li>
        <li><b>Accusatif</b> : complément d’objet direct, exemple : <i>Я читаю книгу</i> (Je lis un livre)</li>
        <li><b>Génitif</b> : possession, absence, exemple : <i>Нет времени</i> (Pas de temps)</li>
        <li><b>Datif</b> : bénéficiaire, destinataire, exemple : <i>Я даю подарок другу</i> (Je donne un cadeau à un ami)</li>
        <li><b>Instrumental</b> : moyen, accompagnement, exemple : <i>Я пишу ручкой</i> (J’écris avec un stylo)</li>
        <li><b>Locatif</b> : lieu, position, exemple : <i>Я в школе</i> (Je suis à l’école)</li>
      </ul>
      <p>Astuce : pour retenir les cas, utilisez la phrase mnémotechnique « NAGDIL ».</p>
      <p>Tableaux de déclinaisons et exercices interactifs disponibles.</p>
    `,
    quiz: [
      { q: 'Quel cas exprime le sujet du verbe ?', a: 'Nominatif' },
      { q: 'Quel cas exprime la possession ?', a: 'Génitif' },
      { q: 'Donnez un exemple d’accusatif.', a: 'Я читаю книгу' },
      { q: 'Combien de cas en russe ?', a: '6' },
    ],
  },
  {
    id: 'verbes',
    titre: 'Les verbes russes',
    resume: 'Conjugaison, aspect perfectif/imperfectif, temps, verbes irréguliers, verbes de mouvement.',
    contenu: `
      <ul>
        <li><b>Aspect imperfectif</b> : action en cours, répétée. Ex : <i>писать</i> (écrire)</li>
        <li><b>Aspect perfectif</b> : action achevée. Ex : <i>написать</i> (avoir écrit)</li>
        <li><b>Présent, passé, futur</b> : conjugaisons et exemples</li>
        <li><b>Verbes irréguliers</b> : être, aller, vouloir</li>
        <li><b>Verbes de mouvement</b> : идти, ехать, лететь, etc.</li>
      </ul>
      <p>Tableaux de conjugaison, exercices, astuces pour différencier les aspects.</p>
    `,
    quiz: [
      { q: 'Quel aspect exprime une action achevée ?', a: 'Perfectif' },
      { q: 'Combien de temps verbaux principaux en russe ?', a: '3' },
      { q: 'Donnez un verbe de mouvement.', a: 'идти' },
      { q: 'Quel est l’infinitif de “écrire” ?', a: 'писать' },
    ],
  },
  {
    id: 'adjectifs',
    titre: 'Les adjectifs russes',
    resume: 'Accord, déclinaison, position dans la phrase, adjectifs possessifs, comparatif et superlatif.',
    contenu: `
      <ul>
        <li>Accord en genre, nombre, cas. Ex : <i>большой дом</i> (grande maison)</li>
        <li>Déclinaison selon le nom</li>
        <li>Position : avant ou après le nom</li>
        <li>Adjectifs possessifs : мой, твой, наш...</li>
        <li>Comparatif et superlatif : больше (plus grand), самый большой (le plus grand)</li>
      </ul>
      <p>Exemples, tableaux d’accord, exercices interactifs.</p>
    `,
    quiz: [
      { q: 'Les adjectifs s’accordent en quoi ?', a: 'Genre, nombre, cas' },
      { q: 'Donnez un adjectif possessif.', a: 'мой' },
      { q: 'Comment dire “le plus grand” ?', a: 'самый большой' },
    ],
  },
  {
    id: 'pronoms',
    titre: 'Les pronoms russes',
    resume: 'Personnels, possessifs, démonstratifs, interrogatifs, pronoms réfléchis, pronoms relatifs.',
    contenu: `
      <ul>
        <li>Pronoms personnels : я, ты, он, она...</li>
        <li>Pronoms possessifs : мой, твой, наш...</li>
        <li>Pronoms démonstratifs : этот, тот...</li>
        <li>Pronoms interrogatifs : кто, что...</li>
        <li>Pronoms réfléchis : себя</li>
        <li>Pronoms relatifs : который</li>
      </ul>
      <p>Tableaux, exemples d’utilisation, exercices.</p>
    `,
    quiz: [
      { q: 'Quel pronom signifie "je" ?', a: 'я' },
      { q: 'Quel est le pronom réfléchi russe ?', a: 'себя' },
      { q: 'Quel pronom relatif utilise-t-on pour “qui” ?', a: 'который' },
    ],
  },
  {
    id: 'prepositions',
    titre: 'Les prépositions russes',
    resume: 'Liste, usage, cas associés, prépositions composées, prépositions de lieu et de temps.',
    contenu: `
      <ul>
        <li>в, на, с, к, от, до, для, без, около, между, перед, после...</li>
        <li>Chaque préposition impose un cas précis</li>
        <li>Prépositions de lieu : в, на, около, между...</li>
        <li>Prépositions de temps : до, после, в...</li>
        <li>Prépositions composées : из-за, благодаря...</li>
      </ul>
      <p>Exemples, cas associés, exercices interactifs.</p>
    `,
    quiz: [
      { q: 'Quelle préposition impose le locatif ?', a: 'в' },
      { q: 'Donnez une préposition composée.', a: 'из-за' },
      { q: 'Quelle préposition signifie “après” ?', a: 'после' },
    ],
  },
  {
    id: 'numeraux',
    titre: 'Les numéraux russes',
    resume: 'Nombres cardinaux, ordinaux, accords, usage dans la phrase.',
    contenu: `
      <ul>
        <li>Cardinaux : один, два, три...</li>
        <li>Ordinaux : первый, второй, третий...</li>
        <li>Accord des numéraux avec le nom</li>
        <li>Usage dans la phrase</li>
      </ul>
      <p>Exemples, tableaux, exercices.</p>
    `,
    quiz: [
      { q: 'Comment dire “deux” en russe ?', a: 'два' },
      { q: 'Quel est l’ordinal de “premier” ?', a: 'первый' },
    ],
  },
  {
    id: 'adverbes',
    titre: 'Les adverbes russes',
    resume: 'Types d’adverbes, formation, place dans la phrase.',
    contenu: `
      <ul>
        <li>Adverbes de temps : сейчас, вчера, завтра...</li>
        <li>Adverbes de lieu : здесь, там, везде...</li>
        <li>Adverbes de manière : быстро, хорошо...</li>
        <li>Formation des adverbes</li>
        <li>Place dans la phrase</li>
      </ul>
      <p>Exemples, exercices, astuces.</p>
    `,
    quiz: [
      { q: 'Comment dire “vite” en russe ?', a: 'быстро' },
      { q: 'Donnez un adverbe de temps.', a: 'сейчас' },
    ],
  },
  {
    id: 'conjonctions',
    titre: 'Les conjonctions russes',
    resume: 'Coordination, subordination, exemples, usage.',
    contenu: `
      <ul>
        <li>и (et), а (mais), но (mais), потому что (parce que)...</li>
        <li>Conjonctions de coordination et de subordination</li>
        <li>Usage dans la phrase</li>
      </ul>
      <p>Exemples, exercices, astuces.</p>
    `,
    quiz: [
      { q: 'Comment dire “et” en russe ?', a: 'и' },
      { q: 'Donnez une conjonction de subordination.', a: 'потому что' },
    ],
  },
];

const BADGES_FAVORIS = [
  { name: 'Grammairien', condition: (fav: string[]) => fav.length >= 3 },
];
const BADGES_SCORE = [
  { name: 'Quiz Master', condition: (score: number) => score >= 5 },
];

const Grammaire: React.FC = () => {
  const [search, setSearch] = useState('');
  const [ficheId, setFicheId] = useState<string|null>(null);
  const [favoris, setFavoris] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('grammaire_favoris') || '[]');
    } catch { return []; }
  });
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [globalQuiz, setGlobalQuiz] = useState(false);
  const [globalQuizIdx, setGlobalQuizIdx] = useState(0);
  const [globalQuizAnswer, setGlobalQuizAnswer] = useState('');
  const [globalQuizFeedback, setGlobalQuizFeedback] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [comments, setComments] = useState<{[id:string]:string[]}>({});
  const [commentInput, setCommentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('grammaire_favoris', JSON.stringify(favoris));
  }, [favoris]);

  const fichesFiltered = fiches.filter(f =>
    f.titre.toLowerCase().includes(search.toLowerCase()) ||
    f.resume.toLowerCase().includes(search.toLowerCase())
  );

  const fiche = fiches.find(f => f.id === ficheId);

  const toggleFavori = (id: string) => {
    setFavoris(favoris.includes(id)
      ? favoris.filter(f => f !== id)
      : [...favoris, id]
    );
  };

  // Quiz
  const checkQuiz = () => {
    if (!fiche) return;
    const q = fiche.quiz[quizIdx];
    if (quizAnswer.trim().toLowerCase() === q.a.trim().toLowerCase()) {
      setQuizFeedback('✅ Bonne réponse !');
      setScore(s => s + 1);
    } else {
      setQuizFeedback('❌ Mauvaise réponse.');
    }
    setHistory(h => [...h, fiche.titre + ': ' + q.q]);
  };

  const nextQuiz = () => {
    if (!fiche) return;
    if (quizIdx < fiche.quiz.length - 1) {
      setQuizIdx(quizIdx + 1);
      setQuizAnswer('');
      setQuizFeedback('');
    }
  };

  // Quiz global sur toutes les fiches
  const allQuestions = fiches.flatMap(f => f.quiz.map(q => ({...q, fiche: f.titre})));
  const checkGlobalQuiz = () => {
    const q = allQuestions[globalQuizIdx];
    if (globalQuizAnswer.trim().toLowerCase() === q.a.trim().toLowerCase()) {
      setGlobalQuizFeedback('✅ Bonne réponse !');
      setScore(s => s + 1);
    } else {
      setGlobalQuizFeedback('❌ Mauvaise réponse.');
    }
    setHistory(h => [...h, q.fiche + ': ' + q.q]);
  };
  const nextGlobalQuiz = () => {
    if (globalQuizIdx < allQuestions.length - 1) {
      setGlobalQuizIdx(globalQuizIdx + 1);
      setGlobalQuizAnswer('');
      setGlobalQuizFeedback('');
    }
  };
  const randomQuiz = () => {
    setGlobalQuiz(true);
    setGlobalQuizIdx(Math.floor(Math.random() * allQuestions.length));
    setGlobalQuizAnswer('');
    setGlobalQuizFeedback('');
  };

  // Audio explication multilangue
  const speak = (txt: string, lang = 'fr-FR') => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(txt);
      utter.lang = lang;
      window.speechSynthesis.speak(utter);
    }
  };

  // Export favoris
  const exportFavoris = () => {
    const blob = new Blob([
      'Titre\n' + favoris.map(id => {
        const f = fiches.find(f => f.id === id);
        return f ? f.titre : '';
      }).join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favoris_grammaire.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import favoris
  const importFavoris = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = (reader.result as string).split('\n').slice(1);
      const ids = fiches.filter(f => lines.includes(f.titre)).map(f => f.id);
      setFavoris(ids);
    };
    reader.readAsText(file);
  };

  // Statistiques
  const stats = {
    total: fiches.length,
    favoris: favoris.length,
    quiz: fiches.reduce((acc, f) => acc + f.quiz.length, 0),
    score,
    badges: [
      ...BADGES_FAVORIS.filter(b => b.condition(favoris)).map(b => b.name),
      ...BADGES_SCORE.filter(b => b.condition(score)).map(b => b.name),
    ],
    historique: history.length,
  };

  // Suggestions
  const suggestions = fiches
    .filter(f => !favoris.includes(f.id) && f.titre.toLowerCase().includes(search.toLowerCase()))
    .map(f => f.titre);

  // Commentaires
  const addComment = (id: string) => {
    if (!commentInput.trim()) return;
    setComments(c => ({ ...c, [id]: [...(c[id] || []), commentInput] }));
    setCommentInput('');
  };

  // Partage
  const shareFiche = (f: typeof fiches[0]) => {
    if (navigator.share) {
      navigator.share({ title: f.titre, text: f.resume });
      setShareMsg('Fiche partagée !');
      setTimeout(() => setShareMsg(''), 2000);
    } else {
      window.prompt('Copiez le contenu à partager :', f.titre + '\n' + f.resume);
    }
  };

  // Edition communautaire (simulation)
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const saveEdit = () => {
    // Simulation : n’enregistre pas vraiment
    setEditMode(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Fiches de grammaire russe</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
        placeholder="Rechercher un point de grammaire..."
      />
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setGlobalQuiz(true)} className="bg-pink-300 px-2 py-1 rounded">Quiz global</button>
        <button onClick={randomQuiz} className="bg-pink-200 px-2 py-1 rounded">Quiz aléatoire</button>
        <button onClick={() => setShowStats(s => !s)} className="bg-pink-100 px-2 py-1 rounded">Statistiques</button>
        <button onClick={exportFavoris} className="bg-pink-200 px-2 py-1 rounded">Exporter favoris</button>
        <label className="bg-pink-200 px-2 py-1 rounded cursor-pointer">
          Importer favoris
          <input type="file" accept=".csv" onChange={importFavoris} className="hidden" />
        </label>
      </div>
      {showStats && (
        <div className="mb-4 bg-pink-50 p-4 rounded">
          <div className="font-bold mb-2">Statistiques :</div>
          <div>Total fiches : {stats.total}</div>
          <div>Favoris : {stats.favoris}</div>
          <div>Questions quiz : {stats.quiz}</div>
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
      {globalQuiz && (
        <div className="mb-8 bg-pink-100 p-4 rounded">
          <div className="font-bold mb-2">Quiz global</div>
          <div className="mb-2">{allQuestions[globalQuizIdx].fiche} : {allQuestions[globalQuizIdx].q}</div>
          <input
            value={globalQuizAnswer}
            onChange={e => setGlobalQuizAnswer(e.target.value)}
            className="border rounded px-2 py-1 mb-2 w-full"
            placeholder="Votre réponse..."
          />
          <button onClick={checkGlobalQuiz} className="bg-pink-600 text-white px-3 py-1 rounded mr-2">Vérifier</button>
          <button onClick={nextGlobalQuiz} className="bg-pink-200 text-pink-900 px-3 py-1 rounded">Suivant</button>
          <button onClick={() => setGlobalQuiz(false)} className="bg-gray-200 px-2 py-1 rounded ml-2">Quitter</button>
          {globalQuizFeedback && <div className="mt-2">{globalQuizFeedback}</div>}
        </div>
      )}
      {!ficheId ? (
        <div>
          <div className="mb-4 grid gap-4">
            {fichesFiltered.map(f => (
              <div key={f.id} className="bg-pink-50 dark:bg-pink-900 p-4 rounded-lg shadow flex flex-col">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{f.titre}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{f.resume}</div>
                  </div>
                  <button onClick={() => toggleFavori(f.id)} className={favoris.includes(f.id) ? 'text-yellow-500' : 'text-gray-400'}>
                    ★
                  </button>
                </div>
                <button onClick={() => setFicheId(f.id)} className="mt-2 bg-pink-600 text-white px-3 py-1 rounded self-end">Voir la fiche</button>
                <button onClick={() => speak(f.titre + '. ' + f.resume)} className="mt-2 bg-pink-200 text-pink-900 px-3 py-1 rounded self-end">🔊 Écouter</button>
                <button onClick={() => shareFiche(f)} className="mt-2 bg-pink-100 text-pink-900 px-3 py-1 rounded self-end">📤 Partager</button>
                <button onClick={() => { setEditMode(true); setEditContent(f.contenu); }} className="mt-2 bg-pink-50 text-pink-900 px-3 py-1 rounded self-end">✏️ Éditer</button>
                <div className="mt-2">
                  <div className="font-bold text-xs mb-1">Commentaires :</div>
                  <ul className="text-xs">
                    {(comments[f.id] || []).map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                  <input value={commentInput} onChange={e => setCommentInput(e.target.value)} className="border rounded px-2 py-1 mt-1 w-full" placeholder="Ajouter un commentaire..." />
                  <button onClick={() => addComment(f.id)} className="bg-pink-200 text-pink-900 px-2 py-1 rounded mt-1">Ajouter</button>
                </div>
              </div>
            ))}
          </div>
          {favoris.length > 0 && (
            <div className="mt-8">
              <div className="font-bold mb-2">Favoris :</div>
              <ul className="list-disc pl-4">
                {favoris.map(id => {
                  const f = fiches.find(f => f.id === id);
                  return f ? <li key={id}>{f.titre}</li> : null;
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        fiche && (
          <div className="bg-white dark:bg-pink-900 p-6 rounded-lg shadow">
            <button onClick={() => setFicheId(null)} className="mb-4 text-pink-600">← Retour</button>
            <div className="font-bold text-xl mb-2">{fiche.titre}</div>
            <div className="mb-4 text-gray-700 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: fiche.contenu }} />
            <button onClick={() => speak(fiche.titre + '. ' + fiche.resume)} className="mb-4 bg-pink-200 text-pink-900 px-3 py-1 rounded">🔊 Écouter</button>
            <button onClick={() => shareFiche(fiche)} className="mb-4 bg-pink-100 text-pink-900 px-3 py-1 rounded">📤 Partager</button>
            <div className="mt-4">
              <div className="font-bold mb-2">Quiz :</div>
              <div className="mb-2">{fiche.quiz[quizIdx].q}</div>
              <input
                value={quizAnswer}
                onChange={e => setQuizAnswer(e.target.value)}
                className="border rounded px-2 py-1 mb-2 w-full"
                placeholder="Votre réponse..."
              />
              <button onClick={checkQuiz} className="bg-pink-600 text-white px-3 py-1 rounded mr-2">Vérifier</button>
              <button onClick={nextQuiz} className="bg-pink-200 text-pink-900 px-3 py-1 rounded">Suivant</button>
              {quizFeedback && <div className="mt-2">{quizFeedback}</div>}
            </div>
            <div className="mt-4">
              <div className="font-bold text-xs mb-1">Commentaires :</div>
              <ul className="text-xs">
                {(comments[fiche.id] || []).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <input value={commentInput} onChange={e => setCommentInput(e.target.value)} className="border rounded px-2 py-1 mt-1 w-full" placeholder="Ajouter un commentaire..." />
              <button onClick={() => addComment(fiche.id)} className="bg-pink-200 text-pink-900 px-2 py-1 rounded mt-1">Ajouter</button>
            </div>
            {editMode && (
              <div className="mt-4 bg-pink-50 p-4 rounded">
                <div className="font-bold mb-2">Édition communautaire (simulation)</div>
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="border rounded px-2 py-1 w-full mb-2" rows={6} />
                <button onClick={saveEdit} className="bg-pink-600 text-white px-3 py-1 rounded">Enregistrer</button>
                <button onClick={() => setEditMode(false)} className="bg-gray-200 px-2 py-1 rounded ml-2">Annuler</button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Grammaire;
