self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      // Force le rechargement de toutes les pages contrôlées
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(err => {
        // Retourne une réponse vide ou une page d'erreur personnalisée
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
