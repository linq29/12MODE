const loadedImageSet = new Set();

export function preloadImage(src) {
  if (!src || loadedImageSet.has(src)) {
    return Promise.resolve();
  }

  if (typeof Image === "undefined") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const finalize = (markLoaded) => {
      if (settled) {
        return;
      }

      settled = true;

      if (markLoaded) {
        loadedImageSet.add(src);
      }

      resolve();
    };

    image.onload = () => finalize(true);
    image.onerror = () => finalize(false);
    image.src = src;

    if (image.complete) {
      finalize(true);
    }
  });
}

export function preloadImages(sources) {
  if (!Array.isArray(sources) || !sources.length) {
    return Promise.resolve();
  }

  return Promise.all(sources.filter(Boolean).map((src) => preloadImage(src))).then(
    () => undefined
  );
}
