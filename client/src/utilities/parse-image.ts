import type { ImageDataT } from "../../../data/recipes/types/recipe-types";

export function parseImage(images: ImageDataT[]): ImageDataT | null {
  if (!images || images.length === 0) return null;

  // Choose image whose width is closest to a typical card width (e.g. 480px).
  const target = 480;

  let best = images[0];
  let bestScore = Math.abs(best.width - target);

  for (const img of images) {
    const score = Math.abs(img.width - target);
    if (score < bestScore) {
      best = img;
      bestScore = score;
    }
  }

  return best;
}

// NOTE should this be updated to dynamically respond to the actual width of a card on the page?