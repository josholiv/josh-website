// Dynamically size blog images based on aspect ratio
// Wider images get more width, taller images get less

const resizeImagesByAspectRatio = () => {
  const images = document.querySelectorAll('.blog-body-pic');
  
  images.forEach(img => {
    const loadImage = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Set width based on aspect ratio
      // Wide images (aspectRatio > 1.5): up to 35rem
      // Square-ish images (1 to 1.5): up to 28rem
      // Tall images (aspectRatio < 1): up to 17rem
      let maxWidth;
      
      if (aspectRatio > 1.5) {
        maxWidth = 'min(100%, 35rem)'; // Very wide
      } else if (aspectRatio > 1) {
        maxWidth = 'min(100%, 28rem)'; // Wide
      } else if (aspectRatio > 0.66) {
        maxWidth = 'min(100%, 22rem)'; // Square-ish
      } else {
        maxWidth = 'min(100%, 17rem)'; // Tall
      }
      
      img.style.maxWidth = maxWidth;
    };
    
    // If image is already loaded
    if (img.complete) {
      loadImage();
    } else {
      // Wait for image to load
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
