import type { ShopImage } from '$lib/types';

export const MEDIA_BASE_URL = 'https://payload.banglapunk.com';

export function getMediaUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  return `${MEDIA_BASE_URL}/${filename}`;
}

export function resolveShopImage(image: ShopImage | undefined | null, size: 'thumbnail' | 'full' = 'full'): string {
  if (!image || !image.filename) return '';
  
  if (size === 'thumbnail' && image.thumbnail?.filename) {
    return getMediaUrl(image.thumbnail.filename);
  }
  
  return getMediaUrl(image.filename);
}
