import { useState, useEffect } from 'preact/hooks';
import { Calendar, Timer, ChevronRight, X, XCircle } from "lucide-preact";
import noTagResults from '../assets/no-tag-results.png';
import Dropdown from './Dropdown.jsx';

const BlogSorter = ({ posts, showSort = true, showTags = true, noPostsImage = noTagResults.src }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(() => {
    return [...posts].sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsSidebar, setShowTagsSidebar] = useState(false);

  // Check for tag from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) setSelectedTags([tagFromUrl]);
    else setSelectedTags([]);
  }, []);

  // ensure tags are visible whenever tags are selected, even if the user didn't explicitly click the "Show Tags" button
  useEffect(() => {
    if (selectedTags.length > 0) setShowTagsSidebar(true);
  }, [selectedTags]);

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
                Tags
                <ChevronRight
                  size="1rem"
                  style={{
                    transform: showTagsSidebar ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
            )}

            {showSort && (
              <div style={{ marginLeft: 'auto' }}>
                <Dropdown
                  options={['Newest', 'Oldest']}
                  defaultOption="Newest"
                  onSelect={(option) => setSortOrder(option.toLowerCase())}
                />
              </div>
            )}
          </div>
        )}

        {showTags && (
          <aside className={`tags-sidebar ${showTagsSidebar ? 'show' : ''}`}>
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
          <div class="blockquote callout-danger" style={{ marginTop: '2rem' }}>
            <div class="callout-title" style={{marginBottom: '0.5rem'}}>
              <XCircle size="1rem" />
              <span>Missing</span>
            </div>
            <div class="callout-body">
              <div class="callout-body-inner">
                There are no posts with that combination of tags. Try clearing or changing your selection!
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div style={{ marginTop: showSort || showTags ? '2rem' : '0' }}>
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

                    <div className="post-title">{post.data.title}</div>

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
                      style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'flex-start' }}
                    >
                      {post.data.tags?.map((tag) => (
                        <span key={tag} className="tag-blogsorter">
                          #{tag}
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