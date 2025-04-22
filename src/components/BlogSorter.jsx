import { useState, useEffect } from 'preact/hooks';

const BlogSorter = ({ posts }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(posts);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showCompactView, setShowCompactView] = useState(false); // Track compact view state
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [hoveredSelect, setHoveredSelect] = useState(false);
  const [hoveredHideTags, setHoveredHideTags] = useState(false); 
  const [hoveredClearTags, setHoveredClearTags] = useState(false); 
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false); // Tags hidden by default

  const baseButtonStyle = {
    padding: '0.6rem 1rem',
    height: '2.25rem',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    cursor: 'pointer',
    backgroundColor: '#d9d9d9',
    color: '#000000',
    border: 'none',
    borderRadius: '1rem',
    marginTop: '0rem',
  };

  const getButtonStyle = (isHovered) => ({
    ...baseButtonStyle,
    backgroundColor: isHovered ? '#bdbdbd' : '#d9d9d9',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) {
      setSelectedTags([tagFromUrl]);
    } else {
      setSelectedTags([]);
    }
  }, []);

  useEffect(() => {
    const filteredPosts = posts.filter((post) =>
      selectedTags.every((tag) => post.data.tags?.includes(tag))
    );

    const sorted = [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.data.pubDate);
      const dateB = new Date(b.data.pubDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setSortedPosts(sorted);
  }, [sortOrder, selectedTags, posts]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const toggleThumbnails = () => {
    setShowThumbnails((prev) => !prev);
  };

  const toggleCompactView = () => {
    setShowCompactView((prev) => !prev); // Toggle the compact view
  };

  const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];

  const tagCounts = tags.map(tag => ({
    tag,
    count: posts.filter(post => post.data.tags?.includes(tag)).length,
  }));

  tagCounts.sort((a, b) => {
    if (b.count === a.count) {
      return a.tag.localeCompare(b.tag);
    }
    return b.count - a.count;
  });

  const sortedTags = tagCounts.map(tagCount => tagCount.tag);

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const truncateDescription = (description) => {
    if (description.length > 85) {
      let truncated = description.slice(0, 85);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
  
      // Ensure it doesn't cut off in the middle of a word
      truncated = description.slice(0, lastSpaceIndex);
  
      // Remove punctuation at the end
      truncated = truncated.replace(/[.,!?;]$/, '');
      
      return truncated + '...';
    }
    return description;
  };
  

  return (
    <div>
      <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button
            onClick={() => setShowTags(prev => !prev)}
            className="btn"
            style={getButtonStyle(hoveredHideTags)}
            onMouseEnter={() => setHoveredHideTags(true)}
            onMouseLeave={() => setHoveredHideTags(false)}
          >
            {showTags ? 'Hide Tags ▲' : 'Show Tags ▼'}
          </button>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-left: auto;">
          <button
            onClick={toggleCompactView} // Updated to toggle compact view
            className="btn"
            style={getButtonStyle(hoveredBtn)}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
          >
            {showCompactView ? 'Expanded View' : 'Compact View'}
          </button>

          <div className="sort-container">
            <label for="sort-select" style="margin-right: 0.5rem;"></label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={handleSortChange}
              className="btn"
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

      {selectedTags.length > 0 && (
        <p>
          <button
            onClick={() => setSelectedTags([])}
            className="btn"
            style={getButtonStyle(hoveredClearTags)}
            onMouseEnter={() => setHoveredClearTags(true)}
            onMouseLeave={() => setHoveredClearTags(false)}
          >
            ✖ Clear Tags
          </button>
        </p>
      )}

      {showTags && (
        <div class="tags" style="margin-bottom: 0.75rem;">
          {sortedTags.map((tag) => (
            <div
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              {tag}
              <span className="tag-count">
                ({posts.filter(post => post.data.tags?.includes(tag)).length})
              </span>
            </div>
          ))}
        </div>
      )}

      {sortedPosts.length === 0 && selectedTags.length > 0 && (
        <div>
          <h3>No posts found with the selected combination of tags.</h3>
          <p>Try clearing or changing your selection!</p>
        </div>
      )}

      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id} class="blog-post">
            <a href={`/posts/${post.id}/`}>
              <div class="post-wrapper">
                {!showCompactView && showThumbnails && post.data.image?.url && (
                  <img
                    src={post.data.image.url}
                    alt={post.data.image.alt || post.data.title}
                    class="blog-thumbnail"
                  />
                )}
                <p class="post-title">{post.data.title}</p>
                
                {!showCompactView && post.data.tags?.length > 0 && (
                  <div className="post-tags">
                    {post.data.tags.map(tag => `#${tag}`).join(' ')}
                  </div>
                )}

                {/* Truncate description in compact view */}
                <div className="post-description">
                  <p>
                    {showCompactView ? truncateDescription(post.data.description) : post.data.description}
                  </p>
                </div>
                
                <div className="pub-date">
                  {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </div>
                <div className="post-author">
                  by {post.data.author}
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
