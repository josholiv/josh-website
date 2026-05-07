import { useState, useEffect } from 'preact/hooks';

const RecentBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hardcover')
      .then(r => r.json())
      .then(result => {
        const recentBooks = (result.userBooks || [])
          .map(entry => ({
            title: entry.book?.title || 'Untitled',
            cover: entry.book?.image?.url || null,
            lastRead: entry.last_read_date ?? null,
            authors: (entry.book?.contributions || [])
              .map(c => c.author?.name)
              .filter(Boolean)
              .join(', '),
            hardcoverUrl: entry.book?.slug
              ? `https://hardcover.app/books/${entry.book.slug}`
              : null,
          }))
          .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())
          .slice(0, 12);
        setBooks(recentBooks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (books.length === 0) return null;

  return (
    <div class="recent-books-grid">
      {books.map((book, i) => (
        <div class="rb-card" key={i}>
          <div class="rb-cover-area">
            <div class="rb-cover-wrap">
              {book.cover ? (
                <a
                  href={book.hardcoverUrl || '#'}
                  class="rb-cover-hover-wrap"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${book.title} on Hardcover`}
                >
                  <img src={book.cover} alt={book.title} class="rb-cover-img" loading="lazy" />
                  <div class="rb-cover-overlay">
                    <img src={book.cover} alt="" class="rb-cover-bg-blur" aria-hidden="true" loading="lazy" />
                    <div class="rb-cover-overlay-text">
                      <span class="rb-title">{book.title}</span>
                      <i class="rb-author">{book.authors}</i>
                    </div>
                  </div>
                </a>
              ) : (
                <div class="rb-cover-placeholder">
                  <span class="rb-title">{book.title}</span>
                  <i class="rb-author">{book.authors}</i>
                </div>
              )}
            </div>
            {book.hardcoverUrl && (
              <a
                href={book.hardcoverUrl}
                class="rb-hardcover-badge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${book.title} on Hardcover`}
              >
                View on Hardcover
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentBooks;
