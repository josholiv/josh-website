import { useState, useEffect } from 'preact/hooks';
import { User, Calendar, Timer, ChevronUp, ChevronDown, X } from "lucide-preact";

const BlogSorter = ({ posts, showSort = true, showTags = true }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(() => {
    // Initially sort posts by pubDate
    return [...posts].sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
  });

  const [hoveredSelect, setHoveredSelect] = useState(false);
  const [hoveredClearTags, setHoveredClearTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsSidebar, setShowTagsSidebar] = useState(true);

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
                className="btn icon-container-inline"
                >
                {showTagsSidebar ? "Hide Tags" : "Show Tags"}
                {showTagsSidebar ? <ChevronUp size="1rem" /> : <ChevronDown size="1rem" />}
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
      <span
  key={tag}
  className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
  onClick={() => handleTagClick(tag)}
>
  #{tag}
  <span className="tag-count">
    ({posts.filter(post => post.data.tags?.includes(tag)).length})
  </span>
</span>
    ))}
  </aside>
)}

        {/* Clear tags button */}
        {selectedTags.length > 0 && (
          <p>
            <button
              onClick={() => setSelectedTags([])}
              className="btn icon-container-inline"
              aria-label="Clear tags"
            >
              <X size="1rem" /> Clear Tags
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
              <div className="post-wrapper">
                {/* Thumbnail */}
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
        
                  <h3 className="post-title">
                    <a href={`/posts/${post.id}/`}>{post.data.title}</a>
                  </h3>

                  {/* Post metadata */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginTop: '0.25rem',
                    }}
                  >
                    <span className="pub-date icon-container-inline">
                      <Calendar size="1rem" />
                      {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </span>

                    <span style={{ color: 'var(--text-faint)' }}>|</span>

                    <span className="post-author icon-container-inline">
                      <User size="1rem" />
                      {post.data.author}
                    </span>

                    <span style={{ color: 'var(--text-faint)' }}>|</span>

                    <span className="post-read-time icon-container-inline">
                      <Timer size="1rem" />
                      {post.data.readTime} min read
                    </span>
                  </div>

                {/* Tags */}
                <div
                  className="tags"
                  style={{
                    margin: '0.75rem 0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {post.data.tags?.map((tag) => (
                    <span key={tag} className="tag-blogsorter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSorter;
