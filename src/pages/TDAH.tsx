import React from 'react';

const TDAH: React.FC = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6">Apprendre le russe avec un TDAH (Trouble du Déficit de l’Attention avec ou sans Hyperactivité)</h1>
    <p className="mb-4 text-lg text-gray-700 dark:text-gray-200">
      Le TDAH est un trouble neurodéveloppemental qui affecte la concentration, l’organisation, la gestion du temps et parfois l’impulsivité. Mais il est tout à fait possible d’apprendre une langue comme le russe avec un TDAH, à condition d’adapter sa méthode et son environnement d’apprentissage.
    </p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">Conseils pour apprendre efficacement avec un TDAH :</h2>
    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
      <li><b>Découper les tâches</b> : privilégiez des sessions courtes (10-20 min) et des objectifs simples (ex : apprendre 5 mots, finir 1 leçon).</li>
      <li><b>Utiliser la gamification</b> : badges, défis, progression visuelle et récompenses aident à rester motivé.</li>
      <li><b>Changer d’activité régulièrement</b> : alternez entre exercices, vidéos, jeux, discussions pour éviter la lassitude.</li>
      <li><b>Créer des routines</b> : planifiez des moments fixes pour apprendre chaque jour, même 5 minutes.</li>
      <li><b>Limiter les distractions</b> : isolez-vous, coupez les notifications, utilisez un casque si besoin.</li>
      <li><b>Utiliser des rappels</b> : notifications, alarmes ou emails pour ne pas oublier vos sessions.</li>
      <li><b>Demander du soutien</b> : échangez avec la communauté, trouvez un binôme ou un coach.</li>
      <li><b>Valoriser les progrès</b> : notez chaque réussite, même petite, pour renforcer la motivation.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">Fonctionnalités du site utiles pour le TDAH :</h2>
    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
      <li>Leçons courtes et interactives, accessibles à tout moment.</li>
      <li>Progression visuelle et badges pour chaque étape franchie.</li>
      <li>Notifications et rappels personnalisables.</li>
      <li>Communauté bienveillante pour échanger et se motiver.</li>
      <li>Possibilité de reprendre à tout moment là où vous vous êtes arrêté.</li>
      <li>Interface claire, épurée, adaptée à la concentration.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">Ressources complémentaires :</h2>
    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
      <li><a href="https://www.tdah-france.fr/" className="text-red-600 underline" target="_blank" rel="noopener noreferrer">TDAH France</a> : informations, conseils, témoignages.</li>
      <li><a href="https://www.fondation-fondamental.org/tdah" className="text-red-600 underline" target="_blank" rel="noopener noreferrer">Fondation FondaMental</a> : ressources scientifiques et pratiques.</li>
      <li><a href="https://www.cerveauetpsycho.fr/sd/neuropsychologie/tdah-une-difficile-prise-en-charge-10416.php" className="text-red-600 underline" target="_blank" rel="noopener noreferrer">Cerveau & Psycho</a> : articles sur le TDAH et l’apprentissage.</li>
    </ul>
    <p className="mt-8 text-gray-700 dark:text-gray-200">
      <b>En résumé :</b> Le TDAH n’est pas un frein à l’apprentissage du russe. Avec des outils adaptés, de la bienveillance et une méthode progressive, chacun peut progresser à son rythme et prendre plaisir à apprendre.
    </p>
  </div>
);

export default TDAH;
