/**
 * Universal video parser for Trip Vibes:
 * Supports:
 * - YouTube full URLs: https://www.youtube.com/watch?v=...
 * - YouTube short URLs: https://youtu.be/...
 * - YouTube shorts: https://www.youtube.com/shorts/...
 * - YouTube embed: https://www.youtube.com/embed/...
 * - Vimeo: https://vimeo.com/...
 * - Direct MP4 / WebM / OGG video files
 * - Facebook / TikTok / Drive video links
 */

export interface ParsedMedia {
  isEmbed: boolean;
  embedUrl?: string;
  isDirectVideo: boolean;
  directUrl?: string;
  thumbnail?: string;
  provider: 'youtube' | 'vimeo' | 'direct' | 'unknown';
}

export function parseVideoUrl(rawUrl: string): ParsedMedia {
  if (!rawUrl) {
    return { isEmbed: false, isDirectVideo: false, provider: 'unknown' };
  }

  const url = rawUrl.trim();

  // 1. YouTube detection
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      isDirectVideo: false,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      provider: 'youtube'
    };
  }

  // 2. Vimeo detection
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      isDirectVideo: false,
      provider: 'vimeo'
    };
  }

  // 3. Direct video format (.mp4, .webm, .ogg, .mov, etc.) or Cloud storage
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.includes('assets.mixkit.co') || url.includes('commondatastorage');
  if (isDirectFile) {
    return {
      isEmbed: false,
      isDirectVideo: true,
      directUrl: url,
      provider: 'direct'
    };
  }

  // Fallback: Default to direct video element if it looks like a media link
  return {
    isEmbed: false,
    isDirectVideo: true,
    directUrl: url,
    provider: 'direct'
  };
}
