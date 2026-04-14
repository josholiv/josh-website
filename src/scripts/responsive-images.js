// Dynamically size blog images based on aspect ratio
// Wider images get more width, taller images get less

const resizeImagesByAspectRatio = () => {
  const images = document.querySelectorAll('.blog-body-pic');
  const isMobile = window.innerWidth < 768;
  
  images.forEach(img => {
    const loadImage = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Set width based on aspect ratio and screen size
      // Desktop: Wide images get more width, tall images get less
      // Mobile: Reduced max widths for better mobile experience
      let maxWidth;
      
      if (isMobile) {
        // Mobile sizing (reduced from desktop)
        if (aspectRatio > 1.5) {
          maxWidth = 'min(100%, 22rem)'; // Very wide
        } else if (aspectRatio > 1) {
          maxWidth = 'min(100%, 18rem)'; // Wide
        } else if (aspectRatio > 0.66) {
          maxWidth = 'min(100%, 16rem)'; // Square-ish
        } else {
          maxWidth = 'min(100%, 14rem)'; // Tall
        }
      } else {
        // Desktop sizing
        if (aspectRatio > 1.5) {
          maxWidth = 'min(100%, 35rem)'; // Very wide
        } else if (aspectRatio > 1) {
          maxWidth = 'min(100%, 28rem)'; // Wide
        } else if (aspectRatio > 0.66) {
          maxWidth = 'min(100%, 22rem)'; // Square-ish
        } else {
          maxWidth = 'min(100%, 17rem)'; // Tall
        }
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
