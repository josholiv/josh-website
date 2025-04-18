import { useState, useEffect } from 'preact/hooks';

const BlogSorter = ({ posts }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState([]);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [hoveredSelect, setHoveredSelect] = useState(false);

  const baseButtonStyle = {
    padding: '0.6rem 1rem',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    cursor: 'pointer',
    backgroundColor: '#d9d9d9',
    color: '#000000',
    border: 'none',
    borderRadius: '1rem',
    transition: 'background-color 0.2s ease',
    marginTop: '0rem',
    marginBottom: '1rem',
  };

  const getButtonStyle = (isHovered) => ({
    ...baseButtonStyle,
    backgroundColor: isHovered ? '#bdbdbd' : '#d9d9d9',
  });

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      const dateA = new Date(a.data.pubDate);
      const dateB = new Date(b.data.pubDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setSortedPosts(sorted);
  }, [sortOrder, posts]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const toggleThumbnails = () => {
    setShowThumbnails((prev) => !prev);
  };

  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <a href="/tags" class="tag-index-link">#Tag Index</a>

        <div style="display: flex; align-items: center; gap: 0.75rem; margin-left: auto;">
          <button
            onClick={toggleThumbnails}
            style={getButtonStyle(hoveredBtn)}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
          >
            {showThumbnails ? 'Compact View' : 'Expanded View'}
          </button>

          <div class="sort-container">
            <label for="sort-select" style="margin-right: 0.5rem;"></label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={handleSortChange}
              style={getButtonStyle(hoveredSelect)}
              onMouseEnter={() => setHoveredSelect(true)}
              onMouseLeave={() => setHoveredSelect(false)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <hr style="margin-bottom: 1rem;" />

      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id} class="blog-post">
            <a href={`/posts/${post.id}/`}>
              <div class="post-wrapper">
                {showThumbnails && post.data.image?.url && (
                  <img 
                    src={post.data.image.url} 
                    alt={post.data.image.alt || post.data.title} 
                    class="blog-thumbnail" 
                  />
                )}
                <p class="post-title">{post.data.title}</p>
                <div class="post-tags">
                  {post.data.tags?.length > 0 && post.data.tags.map(tag => `#${tag}`).join(' ')}
                </div>
                <div class="pub-date">
                  {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSorter;
