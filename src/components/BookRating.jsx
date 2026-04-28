import { useState, useEffect } from 'preact/hooks';
import { ExternalLink } from 'lucide-preact';

const Star = ({ filled, half }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : half ? 'url(#half-fill-blog)' : 'none'}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={`star ${filled ? 'filled' : half ? 'half' : 'empty'}`}
  >
    <defs>
      <linearGradient id="half-fill-blog">
        <stop offset="50%" stop-color="currentColor" />
        <stop offset="50%" stop-color="transparent" />
      </linearGradient>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BookRating = ({ bookTitle }) => {
  const [rating, setRating] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [hardcoverUrl, setHardcoverUrl] = useState(null);
  const [authors, setAuthors] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/hardcover?title=${encodeURIComponent(bookTitle)}`)
      .then(async r => {
        const payload = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(payload?.error || `API error (${r.status})`);
        return payload;
      })
      .then(result => {
        const match = result.userBooks?.find(
          b => b.book?.title?.toLowerCase() === bookTitle.toLowerCase()
        );
        if (match) {
          if (match.rating != null) setRating(match.rating);
          if (match.book?.image?.url) setCoverUrl(match.book.image.url);
          if (match.book?.slug) setHardcoverUrl(`https://hardcover.app/books/${match.book.slug}`);
          const authorList = (match.book?.contributions || [])
            .map(c => c.author?.name)
            .filter(Boolean)
            .join(', ');
          if (authorList) setAuthors(authorList);
        }
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [bookTitle]);

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading rating...</p>;
  if (error || (rating === null && !coverUrl)) return null;

  const coverImg = coverUrl && (
    <img
      src={coverUrl}
      alt={bookTitle}
      class="book-cover-img"
    />
  );

  return (
    <div class="book-rating-section" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {coverUrl && (
        hardcoverUrl
          ? (
            <div class="book-cover-area">
              <a
                href={hardcoverUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="book-cover-link"
                aria-label={`View ${bookTitle} on Hardcover`}
              >
                {coverImg}
                <div class="book-cover-overlay">
                  <img src={coverUrl} alt="" class="book-cover-blur" aria-hidden="true" />
                  <div class="book-cover-overlay-text">
                    <span class="book-cover-overlay-title">{bookTitle}</span>
                    <i class="book-cover-overlay-author">{authors}</i>
                  </div>
                </div>
              </a>
              <a
                href={hardcoverUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="book-cover-badge"
                aria-label={`View ${bookTitle} on Hardcover`}
              >
                View on Hardcover <ExternalLink size={10} />
              </a>
            </div>
          )
          : <div style={{ marginBottom: '0.75rem' }}>{coverImg}</div>
      )}
      {rating !== null && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.floor(rating);
              const half = !filled && (rating - Math.floor(rating)) >= 0.5 && i === Math.floor(rating);
              return <Star key={i} filled={filled} half={half} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BookRating;
