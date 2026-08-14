const Star = ({ filled, half }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : half ? 'url(#half-fill-blog)' : 'none'}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={`star ${filled ? 'filled' : half ? 'half' : 'empty'}`}
    width="14"
    height="14"
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

/**
 * Rating and cover are resolved from the books collection at build time and
 * passed in, so this renders as static HTML with no client-side fetch.
 *
 * @param {{ bookTitle: string, rating?: number | null, coverUrl?: string | null, coverSrcSet?: string }} props
 */
const BookRating = ({ bookTitle, rating = null, coverUrl = null, coverSrcSet }) => {
  if (rating === null && !coverUrl) return null;

  return (
    <div class="book-rating-section" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-start' }}>
      {coverUrl && (
        <div class="img-glow-wrap book-cover-wrap" style={{ marginBottom: '0.75rem' }}>
          <img
            src={coverUrl}
            srcset={coverSrcSet}
            alt={bookTitle}
            class="book-cover-img"
            decoding="async"
          />
        </div>
      )}
      {rating !== null && (
        <div style={{ display: 'flex', gap: '1px' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.floor(rating);
              const half = !filled && (rating - Math.floor(rating)) >= 0.5 && i === Math.floor(rating);
              return <Star key={i} filled={filled} half={half} />;
            })}
        </div>
      )}
    </div>
  );
};

export default BookRating;
