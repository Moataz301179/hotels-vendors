import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swSelf: any = self;

const serwist = new Serwist({
  precacheEntries: swSelf.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entries: [{ url: "/offline" } as any],
  },
});

serwist.addEventListeners();

swSelf.addEventListener("push", (event: any) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "HotelsVendors";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
    actions: data.actions || [],
  };
  event.waitUntil(swSelf.registration.showNotification(title, options));
});

swSelf.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    swSelf.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients: any[]) => {
        for (const client of clients) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return swSelf.clients.openWindow(targetUrl);
      })
  );
});
