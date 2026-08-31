/**
 * Normalises the trailer URLs stored in the database (a mix of
 * `youtube.com/embed/ID`, `youtu.be/ID?si=...` and `watch?v=ID`) into a
 * single embeddable URL. Same behaviour as the existing `movies.js` helper.
 */
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const patterns = [
  /youtube\.com\/embed\/([\w-]{6,})/,
  /youtu\.be\/([\w-]{6,})/,
  /[?&]v=([\w-]{6,})/,
  /youtube\.com\/shorts\/([\w-]{6,})/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function toEmbedUrl(
url?: string | null,
options: {autoplay?: boolean;enableApi?: boolean;} = {})
: string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  });
  if (options.autoplay) params.set('autoplay', '1');
  if (options.enableApi) params.set('enablejsapi', '1');
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}