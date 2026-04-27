import { useState, useEffect, useRef } from 'preact/hooks';
import { Calendar, Timer, X, Cog, Dna, Rss, Code as CodeIcon, Map as MapIcon, SportShoe, Book, CalendarArrowDown, CalendarArrowUp, ClockArrowDown, ClockArrowUp, ArrowDownAZ, ArrowUpAZ, Shuffle } from "lucide-preact";

const tagIcons = {
  '3dprinting': Cog,
  science: Dna,
  blogging: Rss,
  code: CodeIcon,
  travel: MapIcon,
  triathlon: SportShoe,
  books: Book,
};

const getTagThemeClass = (tag = '') => `tag-theme-${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
const getTagIcon = (tag = '') => tagIcons[tag.toLowerCase()] ?? null;

const renderPostTitle = (post) => {
  if (post.data.tags?.includes('books') && post.data.bookTitle) {
    return <span>Book review: <em>{post.data.bookTitle}</em></span>;
  }
  return post.data.title;
};

const renderTagLabel = (tag) => {
  const TagIcon = getTagIcon(tag);
  return (
    <>
      {TagIcon ? <TagIcon size="0.9rem" className="tag-icon" aria-hidden="true" /> : <span aria-hidden="true">#</span>}
      <span>{tag}</span>
    </>
  );
};

const BlogSorter = ({ posts, showSort = true, showTags = true, showSearch = true }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(() => {
    return [...posts].sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Check for tag from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) setSelectedTags([tagFromUrl]);
    else setSelectedTags([]);
  }, []);

  // '/' keyboard shortcut to focus search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Filter and sort posts whenever sort order, selected tags, search query, or posts change
  useEffect(() => {
    let filteredPosts = posts;

    if (selectedTags.length > 0) {
      filteredPosts = posts.filter((post) =>
        selectedTags.every((tag) => post.data.tags?.includes(tag))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter((post) =>
        post.data.title.toLowerCase().includes(q) ||
        post.data.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    const sorted = [...filteredPosts].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.data.pubDate) - new Date(b.data.pubDate);
        case 'shortest':
          return (a.data.readTime ?? 0) - (b.data.readTime ?? 0);
        case 'longest':
          return (b.data.readTime ?? 0) - (a.data.readTime ?? 0);
        case 'a → z':
          return a.data.title.localeCompare(b.data.title);
        case 'z → a':
          return b.data.title.localeCompare(a.data.title);
        case 'random':
          return 0; // shuffle handled below
        default: // newest
          return new Date(b.data.pubDate) - new Date(a.data.pubDate);
      }
    });

    if (sortOrder === 'random') {
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }

    setSortedPosts(sorted);
  }, [sortOrder, selectedTags, searchQuery, posts, shuffleKey]);

  // Tags and counts
  const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];
  const tagCounts = tags.map(tag => ({
    tag,
    count: posts.filter(post => post.data.tags?.includes(tag)).length,
  }));
  tagCounts.sort((a, b) => b.count === a.count ? a.tag.localeCompare(b.tag) : b.count - a.count);
  const sortedTags = tagCounts.map(tc => tc.tag);

  const handleTagClick = (tag) => {
    setSelectedTags(prev => prev.includes(tag)
      ? prev.filter(t => t !== tag)
      : [...prev, tag]
    );
  };

  return (
    <div className="blog-layout">
      <div className="blog-content">

        {/* Tags */}
        {showTags && (
          <div className="tags-bar">
            {sortedTags.map((tag) => (
              <span
                key={tag}
                className={`tag ${getTagThemeClass(tag)} ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {renderTagLabel(tag)}
                <span className="tag-count">
                  ({posts.filter(post => post.data.tags?.includes(tag)).length})
                </span>
              </span>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="tag"
                style={{ color: 'var(--red-400)', border: 'none' }}
                aria-label="Clear tags"
              >
                <X size="0.9rem" />
              </button>
            )}
          </div>
        )}

        {/* Search + sort row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {showSearch && (
              <div style={{ position: 'relative' }}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchFocused ? '' : 'Search...'}
                  className="blog-search"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => { if (!searchQuery) setSearchFocused(false); }}
                />
                {!searchFocused && <kbd className="blog-search-kbd">/</kbd>}
              </div>
            )}
            {showSearch && <span className="blog-count" style={{ margin: 0, whiteSpace: 'nowrap' }}>{sortedPosts.length} of {posts.length} posts</span>}
          </div>

          {showSort && (
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'newest' ? 'active' : ''}`}
                onClick={() => setSortOrder('newest')}
                aria-label="Sort newest first"
                title="Newest first"
              >
                <CalendarArrowDown size="1rem" />
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                onClick={() => setSortOrder('oldest')}
                aria-label="Sort oldest first"
                title="Oldest first"
              >
                <CalendarArrowUp size="1rem" />
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'shortest' ? 'active' : ''}`}
                onClick={() => setSortOrder('shortest')}
                aria-label="Sort by shortest read time"
                title="Shortest read time"
              >
                <ClockArrowDown size="1rem" /> 
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'longest' ? 'active' : ''}`}
                onClick={() => setSortOrder('longest')}
                aria-label="Sort by longest read time"
                title="Longest read time"
              >
                <ClockArrowUp size="1rem" />
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'a → z' ? 'active' : ''}`}
                onClick={() => setSortOrder('a → z')}
                aria-label="Sort A to Z"
                title="A → Z"
              >
                <ArrowDownAZ size="1rem" />
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'z → a' ? 'active' : ''}`}
                onClick={() => setSortOrder('z → a')}
                aria-label="Sort Z to A"
                title="Z → A"
              >
                <ArrowUpAZ size="1rem" />
              </button>
              <button
                className={`btn sort-icon-btn ${sortOrder === 'random' ? 'active' : ''}`}
                onClick={() => { setSortOrder('random'); setShuffleKey(k => k + 1); }}
                aria-label="Randomize order"
                title="Shuffle"
              >
                <Shuffle size="1rem" />
              </button>
            </div>
          )}
        </div>

        {/* No posts message */}
        {sortedPosts.length === 0 && (selectedTags.length > 0 || searchQuery.trim()) && (
          <div class="blockquote callout-danger" style={{ marginTop: '2rem' }}>
            <div class="callout-title">
              <X size="1rem" />
              <span>
                {searchQuery.trim() && selectedTags.length > 0
                  ? <>No posts matching your search and <code># Tags</code> combination</>
                  : searchQuery.trim()
                  ? 'No posts matching your search'
                  : <>No posts matching those <code># Tags</code></>}
              </span>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div>
          <ul className="blog-list">
            {sortedPosts.map((post) => (
              <li key={post.id} className="blog-post">

                <a href={`/posts/${post.id}/`} className="post-wrapper post-card-link">

                  {post.data.image?.url && (
                    <div className="blog-thumbnail-wrapper">
                      <img
                        src={post.data.image.url}
                        alt={post.data.image.alt || post.data.title}
                        className="blog-thumbnail"
                      />
                    </div>
                  )}

                  <div className="post-text">

                    <div className="post-title">{renderPostTitle(post)}</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="pub-date icon-container-inline">
                        <Calendar size="1rem" />
                        {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>

                      <span style={{ color: 'var(--text-faint)' }}>|</span>

                      <span className="post-read-time icon-container-inline">
                        <Timer size="1rem" />
                        {post.data.readTime} min
                      </span>
                    </div>

                    <div
                      className="tags"
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'flex-start' }}
                    >
                      {post.data.tags?.map((tag) => (
                        <span key={tag} className={`tag-blogsorter ${getTagThemeClass(tag)}`}>
                          {renderTagLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSorter;