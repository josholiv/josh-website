import { useState, useEffect } from 'preact/hooks';

const BlogSorter = ({ posts }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(posts);
  const [hoveredSelect, setHoveredSelect] = useState(false);
  const [hoveredClearTags, setHoveredClearTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false); // Tags toggled on mobile only

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

  return (
    <div className="blog-layout">
      <div className="blog-content">
        <div style="margin-bottom: 0.75rem; display: flex; align-items: center; flex-wrap: wrap;">
          <button
            onClick={() => setShowTags(prev => !prev)}
            className="btn show-tags-toggle"
            style={getButtonStyle(false)}
          >
            {showTags ? 'Hide Tags ▲' : 'Show Tags ▼'}
          </button>

          <div style="display: flex; gap: 0.75rem; margin-left: auto;">
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

          <aside className={`tags-sidebar ${showTags ? 'show' : ''}`}>
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

        {sortedPosts.length === 0 && selectedTags.length > 0 && (
          <div>
            <h3>No posts found with the selected combination of tags :(</h3>
            <p>Try clearing or changing your selection!</p>
          </div>
        )}

        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id} class="blog-post">
              <a href={`/posts/${post.id}/`}>
                <div class="post-wrapper">
                  {post.data.image?.url && (
                    <div class="blog-thumbnail-wrapper">
                      <img
                        src={post.data.image.url}
                        alt={post.data.image.alt || post.data.title}
                        class="blog-thumbnail"
                      />
                    </div>
                  )}
                  <div class="post-text">
                    <p class="post-title">
                      {post.data.title}
                    </p>

                    <div className="pub-date">
                      {new Date(post.data.pubDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </div>

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
  );
};

export default BlogSorter;
