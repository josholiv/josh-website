import { useState, useEffect } from 'preact/hooks';

const RecentBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hardcover')
      .then(r => r.json())
      .then(result => {
        const recentBooks = (result.userBookReads || [])
          .map(entry => ({
            title: entry.user_book?.book?.title || 'Untitled',
            cover: entry.user_book?.book?.image?.url || null,
            lastRead: entry.finished_at ?? null,
            authors: (entry.user_book?.book?.contributions || [])
              .map(c => c.author?.name)
              .filter(Boolean)
              .join(', '),
            hardcoverUrl: entry.user_book?.book?.slug
              ? `https://hardcover.app/books/${entry.user_book.book.slug}`
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
          <div class="rb-cover-wrap img-glow-wrap">
            {book.cover ? (
              <img src={book.cover} alt={book.title} class="rb-cover-img" loading="lazy" />
            ) : (
              <div class="rb-cover-placeholder">
                <span class="rb-title">{book.title}</span>
                <i class="rb-author">{book.authors}</i>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentBooks;
