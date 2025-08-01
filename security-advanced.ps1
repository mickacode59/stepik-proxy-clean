# Script avancé de sécurité et vérification pour projet Firebase/React
Write-Host "--- Vérification des vulnérabilités npm racine ---"
npm audit --audit-level=high
npm audit fix
npm update
Write-Host "--- Vérification des erreurs TypeScript/compilation ---"
npm run build
Write-Host "--- Scan des fichiers sensibles (.env, clés, etc.) ---"
Get-ChildItem -Path . -Include *.env,*.key,*.pem,*.crt,*.p12 -Recurse | ForEach-Object { Write-Host "Fichier sensible trouvé: $($_.FullName)" }
Write-Host "--- Vérification des headers de sécurité Firebase Hosting ---"
Get-Content .\firebase.json | Select-String -Pattern 'headers'
Write-Host "--- Vérification des vulnérabilités et erreurs dans functions ---"
Set-Location functions
npm audit --audit-level=high
npm audit fix
npm update
Set-Location ..
Write-Host "--- Scan des dépendances obsolètes ---"
npm outdated
Write-Host "--- Vérification terminée ---"
