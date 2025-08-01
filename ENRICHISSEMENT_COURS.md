# Enrichissement automatique des cours russes

## Fonctionnement actuel
- Les cours russes gratuits sont importés automatiquement depuis Open Education (https://openedu.ru), la plus grande plateforme russe de MOOC gratuits.
- Le module d'importation (`src/data/importCourses.ts`) utilise l'API publique pour charger des milliers de cours réels et complets.
- La page `Courses` affiche dynamiquement tous les cours importés, avec filtres et recherche.

## Personnalisation et extension
- Vous pouvez facilement ajouter d'autres sources officielles (Coursera, EdX, Udemy, universités russes) en adaptant le module d'importation.
- Pour importer depuis un fichier, déposez un fichier JSON dans `/public/courses.json` et utilisez la fonction dédiée.
- Pour enrichir les cours avec des images, tags, niveaux, etc., modifiez le mapping dans `importCoursesFromOpenEdu`.

## Gestion des erreurs
- Si l'API OpenEdu est temporairement inaccessible, le catalogue reste fonctionnel (affichage d'un message ou fallback possible).
- Vous pouvez ajouter une sauvegarde locale ou un cache pour garantir l'accès aux cours même hors ligne.

## Suggestions d'enrichissement
- Ajouter des badges, quiz, exercices interactifs à chaque cours.
- Intégrer des vidéos, podcasts, documents PDF.
- Proposer des parcours personnalisés selon le niveau et les objectifs de l'utilisateur.
- Ajouter la synchronisation avec d'autres plateformes russes ou internationales.

## Pour aller plus loin
- Contactez les universités russes pour obtenir des exports de cours ou des accès API spécifiques.
- Intégrez des modules d'évaluation, de certification ou de suivi de progression avancé.
- Proposez une interface d'administration pour ajouter/modifier/supprimer des cours manuellement.

---
Ce projet est prêt pour l'enrichissement maximal et l'intégration de toutes les sources officielles de cours russes. Pour toute demande spécifique, suivez les instructions ou contactez le développeur.
