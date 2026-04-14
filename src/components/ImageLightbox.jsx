export default function ImageLightbox() {
  return (
    <script>
      {`
        (function initImageLightbox() {
          function closeLightbox(overlay) {
            overlay.remove();
          }

          function openLightbox(src, alt) {
            const lightboxOverlay = document.createElement('div');
            lightboxOverlay.className = 'lightbox-overlay';
            
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = src;
            lightboxImg.alt = alt || 'Enlarged image';
            lightboxImg.className = 'lightbox-image';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Close lightbox');
            closeBtn.setAttribute('title', 'Close (Esc)');
            
            lightboxContent.appendChild(lightboxImg);
            lightboxContent.appendChild(closeBtn);
            lightboxOverlay.appendChild(lightboxContent);
            document.body.appendChild(lightboxOverlay);
            
            const close = () => {
              closeLightbox(lightboxOverlay);
            };
            
            closeBtn.addEventListener('click', close);
            lightboxOverlay.addEventListener('click', (e) => {
              if (e.target === lightboxOverlay) close();
            });
            
            const handleKeydown = (e) => {
              if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleKeydown);
              }
            };
            
            document.addEventListener('keydown', handleKeydown);
          }

          // Wait for DOM to be ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachListeners);
          } else {
            attachListeners();
          }

          function attachListeners() {
            // Attach to post content images and markdown images
            const images = document.querySelectorAll('main img, article img, .prose img');
            
            images.forEach(img => {
              img.style.cursor = 'pointer';
              img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(img.src, img.alt);
              });
            });
          }
        })();
      `}
    </script>
  );
}

