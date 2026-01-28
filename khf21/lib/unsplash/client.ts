/**
 * Unsplash API クライアント
 * 無料の高品質な画像を取得
 */

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo';

/**
 * Unsplashから世界遺産の画像を検索
 * @param query 検索クエリ（英語の名称）
 * @returns 画像URL
 */
export async function getHeritageImage(query: string): Promise<string | null> {
  try {
    // デモモードの場合はプレースホルダー画像を返す
    if (UNSPLASH_ACCESS_KEY === 'demo') {
      console.log('[Unsplash] Demo mode - using placeholder image');
      return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},heritage,landmark`;
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('[Unsplash] API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // regular サイズ（1080px幅）を使用
      return data.results[0].urls.regular;
    }

    return null;
  } catch (error) {
    console.error('[Unsplash] Error fetching image:', error);
    return null;
  }
}

/**
 * プレースホルダー画像URLを生成
 * より確実に画像を表示するため、複数のソースを使用
 */
export function getPlaceholderImage(query: string, width: number = 800, height: number = 600): string {
  // Picsum Photos（Lorem Picsumの代替、安定したプレースホルダー画像サービス）
  // ランダム画像を返すため、世界遺産らしい画像になるとは限らないが、確実に表示される
  const seed = query.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * 世界遺産名から画像を取得（キャッシュ対応）
 */
const imageCache = new Map<string, string>();

export async function getHeritageImageCached(englishName: string, japaneseName: string): Promise<string | null> {
  const cacheKey = englishName.toLowerCase();

  // キャッシュチェック
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Unsplashから取得
  const imageUrl = await getHeritageImage(englishName);

  if (imageUrl) {
    imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  // フォールバック：プレースホルダー画像
  const fallbackUrl = getPlaceholderImage(englishName);
  imageCache.set(cacheKey, fallbackUrl);
  return fallbackUrl;
}
