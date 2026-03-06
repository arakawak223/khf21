// Service Worker for 夢旅 ライトフライヤー２１
// キャッシュバージョン：更新時はここを変更してください
const VERSION = 'v1';
const STATIC_CACHE = `rf21-static-${VERSION}`;
const AUDIO_CACHE = `rf21-audio-${VERSION}`;

// インストール時にキャッシュするアプリシェル
const APP_SHELL = [
  '/',
  '/game',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, AUDIO_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !allowedCaches.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // GET 以外・chrome-extension は無視
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Supabase API はキャッシュしない（リアルタイムデータ）
  if (url.hostname.includes('supabase.co')) return;

  // 音声ファイル → Cache-first（大容量・変更頻度低）
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE));
    return;
  }

  // Next.js ビルド済み静的ファイル → Cache-first（ハッシュ付きで変更検知済み）
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // アイコン・画像 → Cache-first
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ページナビゲーション → Network-first + オフラインフォールバック
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // その他 → Network-first
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ─── Strategies ─────────────────────────────────────────────────────────────

/** Cache-first: キャッシュがあればそれを返し、なければネットワーク取得してキャッシュ保存 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('オフラインです', { status: 503 });
  }
}

/** Network-first: ネットワーク優先、失敗したらキャッシュを返す */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? new Response('オフラインです', { status: 503 });
  }
}

/** ページ用 Network-first: オフライン時は /offline にフォールバック */
async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match('/offline');
    return offline ?? new Response('オフラインです', { status: 503 });
  }
}
