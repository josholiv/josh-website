// Dynamically size blog images based on aspect ratio.
// 3:2 (ar >= 1.5) or wider → full content width.
// Narrower than 3:2 → width scales as √(ar / 1.5) so visual area stays roughly constant.

const resizeImagesByAspectRatio = () => {
  const images = document.querySelectorAll('.blog-body-pic');

  images.forEach(img => {
    const loadImage = () => {
      const ar = img.naturalWidth / img.naturalHeight;

      let maxWidth;
      if (ar >= 1.5) {
        maxWidth = '100%';
      } else {
        const pct = Math.min(100, Math.round(Math.sqrt(ar / 1.5) * 100));
        maxWidth = `${pct}%`;
      }

      img.style.maxWidth = maxWidth;
      // Set maxWidth on the outermost container only.
      // Setting it on both the container and the image compounds the percentages
      // (e.g. 82% of 82% of parent), causing the image to be narrower than its wrapper.
      const wrap = img.closest('.img-glow-wrap');
      const figure = img.closest('figure.img-figure');
      const outermost = figure || wrap;

      if (outermost) {
        outermost.style.maxWidth = maxWidth;
        if (wrap && wrap !== outermost) wrap.style.maxWidth = '100%';
        img.style.maxWidth = '100%';
      } else {
        // Standalone image — wrap hasn't been created yet (cached image path).
        img.style.maxWidth = maxWidth;
      }
    };

    if (img.complete) {
      loadImage();
    } else {
      img.addEventListener('load', loadImage);
    }
  });
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', resizeImagesByAspectRatio);
} else {
  resizeImagesByAspectRatio();
}
