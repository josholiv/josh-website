import { useState, useEffect, useRef } from 'preact/hooks';
import { X, Box, Dna, Rss, Code as CodeIcon, Map as MapIcon, SportShoe, Book } from "lucide-preact";

const tagIcons = {
  '3dprinting': Box,
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


const renderTagIconOnly = (tag) => {
  const TagIcon = getTagIcon(tag);
  if (!TagIcon) return null;
  return <TagIcon size="1.25rem" aria-label={tag} />;
};

const BlogSorter = ({ posts, showSort = true, showSearch = true }) => {
  const [sortOrder, setSortOrder] = useState('recently-updated');
  const [sortedPosts, setSortedPosts] = useState(() => {
    return [...posts].sort((a, b) =>
      new Date(b.data.dateModified ?? b.data.pubDate) - new Date(a.data.dateModified ?? a.data.pubDate)
    );
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Check for tag from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) setSelectedTags([tagFromUrl]);
    else setSelectedTags([]);
  }, []);

  // Sync tag selection from TagFilterPanel
  useEffect(() => {
    const handler = (e) => setSelectedTags(e.detail.tags);
    document.addEventListener('blog:tagchange', handler);
    return () => document.removeEventListener('blog:tagchange', handler);
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

  return (
    <div className="blog-layout">
      <div className="blog-content">

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
                <option value="recently-updated">Last updated</option>
                <option value="newest">Newest → oldest</option>
                <option value="oldest">Oldest → newest</option>
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
            {sortedPosts.map((post) => (
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

                  <div className="post-text">

                    <div className="post-tag-icons">
                      {post.data.tags?.filter(tag => getTagIcon(tag)).map(tag => (
                        <span key={tag} className={`tag-post-icon ${getTagThemeClass(tag)}`}>{renderTagIconOnly(tag)}</span>
                      ))}
                      <span className="pub-date">
                        {post.data.dateModified && new Date(post.data.dateModified).toDateString() !== new Date(post.data.pubDate).toDateString()
                          ? <>Updated {new Date(post.data.dateModified).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</>
                          : new Date(post.data.pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
                        }
                        {' | '}<span className="post-read-time">{post.data.readTime} min</span>
                      </span>
                    </div>

                    <div className="post-title">{renderPostTitle(post)}</div>
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