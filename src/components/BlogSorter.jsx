import { useState, useEffect, useRef } from 'preact/hooks';
import { CalendarPlus, CalendarClock, Timer, X, Cog, Dna, Rss, Code as CodeIcon, Map as MapIcon, SportShoe, Book } from "lucide-preact";

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
    return <span>Book review: <em>{post.data.bookTitleShort ?? post.data.bookTitle}</em></span>;
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

const BlogSorter = ({ posts, showSort = true, showTags = true, showSearch = true, lazyLoadAll = false }) => {
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
        case 'recently-updated':
          return new Date(b.data.dateModified ?? b.data.pubDate) - new Date(a.data.dateModified ?? a.data.pubDate);
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
                style={{ color: 'var(--red-400)' }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              {/* <label htmlFor="blog-sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>Sort by</label> */}
              <select
                id="blog-sort-select"
                className="sort-select"
                value={sortOrder}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'random') setShuffleKey(k => k + 1);
                  setSortOrder(val);
                }}
              >
                <option value="newest">Newest → oldest</option>
                <option value="oldest">Oldest → newest</option>
                <option value="recently-updated">Last updated</option>
                <option value="shortest">Shortest read</option>
                <option value="longest">Longest read</option>
                <option value="a → z">A → Z</option>
                <option value="z → a">Z → A</option>
                <option value="random">Random</option>
              </select>
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
                  : <>No posts found </>}
              </span>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div>
          <ul className="blog-list">
            {sortedPosts.map((post, index) => (
              <li key={post.id} className="blog-post">

                <a
                  href={`/posts/${post.id}/`}
                  className="post-wrapper post-card-link"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >

                  {post.data.image?.url && (
                    <div className="blog-thumbnail-wrapper">
                      <img
                        src={post.data.image.url}
                        alt={post.data.image.alt || post.data.title}
                        className="blog-thumbnail"
                        loading={lazyLoadAll ? "lazy" : (index < 4 ? "eager" : "lazy")}
                      />
                    </div>
                  )}

                  <div className="post-text">

                    <div className="post-title">{renderPostTitle(post)}</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="pub-date icon-container-inline">
                        <CalendarPlus size="1rem" />
                        {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>

                      {post.data.dateModified && new Date(post.data.dateModified).toDateString() !== new Date(post.data.pubDate).toDateString() && (
                        <>
                          <span style={{ color: 'var(--bg-border)' }}>|</span>
                          <span className="pub-date icon-container-inline">
                            <CalendarClock size="1rem" />
                            Updated {new Date(post.data.dateModified).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                              timeZone: 'UTC',
                            })}
                          </span>
                        </>
                      )}

                      <span style={{ color: 'var(--bg-border)' }}>|</span>

                      <span className="post-read-time icon-container-inline">
                        <Timer size="1rem" />
                        {post.data.readTime} minute read
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