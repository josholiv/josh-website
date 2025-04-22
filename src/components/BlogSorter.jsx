import { useState, useEffect } from 'preact/hooks';

const BlogSorter = ({ posts }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(posts);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [hoveredSelect, setHoveredSelect] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

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

  // Create a count for each tag
  const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];

  // Create a count for each tag
  const tagCounts = tags.map(tag => ({
    tag,
    count: posts.filter(post => post.data.tags?.includes(tag)).length,
  }));

  // Sort tags: first by count (desc), then alphabetically (asc)
  tagCounts.sort((a, b) => {
    if (b.count === a.count) {
      return a.tag.localeCompare(b.tag); // If counts are equal, sort alphabetically
    }
    return b.count - a.count; // Otherwise, sort by count in descending order
  });

  // Extract sorted tags
  const sortedTags = tagCounts.map(tagCount => tagCount.tag);

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div class="tags">
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

        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            {selectedTags.length > 0 && (
             <button
             onClick={() => setSelectedTags([])}
             className="btn"
           >
             ✖ Clear Tags
           </button>
            )}
          </div>

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
      </div>

      <hr style="margin-bottom: 1rem;" />

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
                <div class="post-author">
                  by {post.data.author}
                </div>
                <div class="post-description">
                  <p>{post.data.description}</p>
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
