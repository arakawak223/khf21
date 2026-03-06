'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // 新しい SW が待機中なら即適用（ページリロードなしで更新）
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // 既存の SW を置き換えて新バージョンを即時有効化
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        // コントローラーが変わったらページをリロードして最新版を反映
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('[SW] 登録に失敗しました:', error);
      }
    };

    // ページ読み込み完了後に登録（初期表示を妨げない）
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }, []);

  return null;
}
