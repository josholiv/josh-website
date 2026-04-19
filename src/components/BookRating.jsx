import { useState, useEffect } from 'preact/hooks';

const Star = ({ filled, half }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/hardcover')
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

  return (
    <div class="book-rating-section" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
      {coverUrl && (
        <img
          src={coverUrl}
          alt={bookTitle}
          style={{ maxWidth: '200px', borderRadius: '6px', marginBottom: '0.75rem' }}
        />
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
