export const loadHTMLImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

export const buildImageUrl = (raw) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    return `/mockup/${url.pathname.replace(/^\/?mockups\//, "")}`;
  }
  return `/mockup/${raw.replace(/^\/?mockups\//, "")}`;
};
