export default function ImageLightbox() {
  return (
    <script>
      {`
        (function initImageLightbox() {
          function closeLightbox(overlay) {
            overlay.remove();
          }

          function openLightbox(src, alt, meta) {
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';

            const content = document.createElement('div');
            content.className = meta
              ? 'lightbox-content lightbox-content-book'
              : 'lightbox-content';

            const img = document.createElement('img');
            img.src = src;
            img.alt = alt || 'Enlarged image';
            img.className = 'lightbox-image';
            content.appendChild(img);

            if (meta) {
              const info = document.createElement('div');
              info.className = 'lightbox-book-info';

              const title = document.createElement('p');
              title.className = 'lightbox-book-title';
              title.textContent = meta.title;
              info.appendChild(title);

              if (meta.authors) {
                const authors = document.createElement('p');
                authors.className = 'lightbox-book-authors';
                authors.textContent = meta.authors;
                info.appendChild(authors);
              }

              if (meta.pubYear) {
                const isBC = meta.pubYear.charAt(0) === '-';
                const pyDisplay = isBC
                  ? meta.pubYear.slice(1) + ' BC'
                  : meta.pubYear;
                const py = document.createElement('p');
                py.className = 'lightbox-book-meta';
                py.textContent = 'Published ' + pyDisplay;
                info.appendChild(py);
              }

              if (meta.rating) {
                const ratingEl = document.createElement('p');
                ratingEl.className = 'lightbox-book-rating';
                ratingEl.textContent = parseFloat(meta.rating).toFixed(1) + ' ★';
                info.appendChild(ratingEl);
              }

              const spacer = document.createElement('div');
              spacer.style.flex = '1';
              info.appendChild(spacer);

              const links = document.createElement('div');
              links.className = 'lightbox-book-links';

              if (meta.reviewUrl) {
                const a = document.createElement('a');
                a.href = meta.reviewUrl;
                a.textContent = 'See review';
                a.className = 'lightbox-book-link';
                links.appendChild(a);
              }

              if (meta.hardcoverUrl) {
                const a = document.createElement('a');
                a.href = meta.hardcoverUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = 'Hardcover';
                a.className = 'lightbox-book-link lightbox-book-link-secondary';
                links.appendChild(a);
              }

              if (links.children.length > 0) info.appendChild(links);
              content.appendChild(info);
            }

            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Close lightbox');
            closeBtn.setAttribute('title', 'Close (Esc)');
            content.appendChild(closeBtn);

            overlay.appendChild(content);
            document.body.appendChild(overlay);

            const close = () => closeLightbox(overlay);
            closeBtn.addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
              if (e.target === overlay) close();
            });

            const handleKeydown = (e) => {
              if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleKeydown);
              }
            };
            document.addEventListener('keydown', handleKeydown);
          }

          function attachListeners() {
            document.addEventListener('click', (e) => {
              const img = e.target.closest('img');
              if (!img) return;
              if (!img.closest('main, article, .prose')) return;
              if (img.dataset.noLightbox !== undefined) return;
              e.preventDefault();

              const meta = img.dataset.bookTitle
                ? {
                    title: img.dataset.bookTitle,
                    authors: img.dataset.bookAuthors || '',
                    pubYear: img.dataset.bookPubYear || '',
                    rating: img.dataset.bookRating || '',
                    reviewUrl: img.dataset.bookReviewUrl || '',
                    hardcoverUrl: img.dataset.bookHardcoverUrl || '',
                  }
                : null;

              openLightbox(img.src, img.alt, meta);
            });

            const setCursor = (root) => {
              root.querySelectorAll('main img, article img, .prose img').forEach(img => {
                img.style.cursor = 'pointer';
              });
            };
            setCursor(document);

            const observer = new MutationObserver((mutations) => {
              mutations.forEach(m => m.addedNodes.forEach(node => {
                if (node.nodeType === 1) setCursor(node);
              }));
            });
            observer.observe(document.body, { childList: true, subtree: true });
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachListeners);
          } else {
            attachListeners();
          }
        })();
      `}
    </script>
  );
}
