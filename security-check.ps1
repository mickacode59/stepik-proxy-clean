# Script de vérification automatique des vulnérabilités et erreurs
Write-Host "--- Vérification des vulnérabilités npm ---"
npm audit --audit-level=high
Write-Host "--- Correction automatique des vulnérabilités ---"
npm audit fix
Write-Host "--- Mise à jour des dépendances ---"
npm update
Write-Host "--- Vérification des erreurs TypeScript/compilation ---"
npm run build
Write-Host "--- Vérification des erreurs bloquantes dans les fonctions ---"
cd functions
npm audit --audit-level=high
npm audit fix
npm update
cd ..
Write-Host "--- Vérification terminée ---"
