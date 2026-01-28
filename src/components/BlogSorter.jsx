import { useState, useEffect } from 'preact/hooks';
import { User } from "lucide-preact";

const BlogSorter = ({ posts, showSort = true, showTags = true }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(() => {
    // Initially sort posts by pubDate
    return [...posts].sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
  });

  const [hoveredSelect, setHoveredSelect] = useState(false);
  const [hoveredClearTags, setHoveredClearTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsSidebar, setShowTagsSidebar] = useState(false);

  // Check for tag from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) setSelectedTags([tagFromUrl]);
    else setSelectedTags([]);
  }, []);

  // Filter and sort posts whenever sort order, selected tags, or posts change
  useEffect(() => {
    let filteredPosts = posts;

    if (selectedTags.length > 0) {
      filteredPosts = posts.filter((post) =>
        selectedTags.every((tag) => post.data.tags?.includes(tag))
      );
    }

    const sorted = [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.data.pubDate);
      const dateB = new Date(b.data.pubDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setSortedPosts(sorted);
  }, [sortOrder, selectedTags, posts]);

  const handleSortChange = (e) => setSortOrder(e.target.value);

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

        {/* Sort & Tag Toggle */}
        {(showSort || showTags) && (
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {showTags && (
              <button
                onClick={() => setShowTagsSidebar(prev => !prev)}
                className="btn show-tags-toggle"
              >
                {showTagsSidebar ? 'Hide Tags ▲' : 'Show Tags ▼'}
              </button>
            )}

            {showSort && (
              <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="btn"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Tags Sidebar */}
        {showTags && showTagsSidebar && (
          <aside className={`tags-sidebar show`}>
            {sortedTags.map((tag) => (
              <div
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              >
                #{tag}
                <span className="tag-count">
                  ({posts.filter(post => post.data.tags?.includes(tag)).length})
                </span>
              </div>
            ))}
          </aside>
        )}

        {/* Clear tags button */}
        {selectedTags.length > 0 && (
          <p>
            <button
              onClick={() => setSelectedTags([])}
              className="btn"
            >
              ✖ Clear
            </button>
          </p>
        )}

        {/* No posts message */}
        {sortedPosts.length === 0 && selectedTags.length > 0 && (
          <div>
            <h3>No posts found with the selected combination of tags :(</h3>
            <p>Try clearing or changing your selection!</p>
          </div>
        )}

        {/* Posts List */}
        <div style={{ marginTop: '2rem'}}>
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id} className="blog-post">
              <a href={`/posts/${post.id}/`}>
                <div className="post-wrapper">
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
                    <h3 className="post-title">{post.data.title}</h3>
                    <span className="pub-date">
                      {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </span>

                    <span className="post-author icon-container-inline"><span>|</span><User size="1.2rem" style={{ color: "var(--neutral-500)" }}/>
                    &nbsp;
                    <span>{post.data.author} |</span></span>

                    <span className="post-read-time"> {post.data.readTime} minute read</span>

                    <div className="post-description">
                      {post.data.description}
                    </div>
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
