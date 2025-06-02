/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
self.skipWaiting();

// Precaching de los archivos generados en la build
precacheAndRoute(self.__WB_MANIFEST);

// Cache dinámico para recursos externos
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate()
);