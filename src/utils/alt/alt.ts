export const extractFromUrl = (src?: string) => {
  if (!src) return null;

  return src
    .toLowerCase()
    .split('/')
    .pop()
    ?.split('.')[0]
    ?.replace(/[-_0-9]/g, ' ')
    .trim();
};

export const isAltSuspicious = (alt: string, src?: string) => {
  const urlHint = extractFromUrl(src);

  if (!urlHint) return false;

  const altText = alt.toLowerCase();
  const urlWords = urlHint.split(/\s+/);

  return !urlWords.some((word) => altText.includes(word));
};
