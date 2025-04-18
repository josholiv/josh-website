import { useState, useEffect } from 'preact/hooks';

const BlogSorter = ({ posts }) => {
  // State initialization for sortOrder
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortedPosts, setSortedPosts] = useState(posts);

  // UseEffect to load sort order from localStorage, if in the browser
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sortOrder')) {
      setSortOrder(localStorage.getItem('sortOrder'));
    }
  }, []); // Run only once on mount

  // Sort the posts whenever the sortOrder or posts list changes
  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      const dateA = new Date(a.data.pubDate);
      const dateB = new Date(b.data.pubDate);
      return sortOrder === 'newest' 
        ? dateB - dateA  // Sort descending for newest first
        : dateA - dateB; // Sort ascending for oldest first
    });
    setSortedPosts(sorted);  // Update the sorted posts state
  }, [sortOrder, posts]);  // Re-run when sortOrder or posts change

  // Handle the change of sorting order
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);  // Update the sort order state
    if (typeof window !== 'undefined') {
      localStorage.setItem('sortOrder', newSortOrder);  // Save the new sort order to localStorage
    }
  };

  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
  <a href="/tags" class="tag-index-link">#Tag Index</a>
  <div class="sort-container">
    <label for="sort-select" style="margin-right: 0.5rem;"></label>
    <select id="sort-select" value={sortOrder} onChange={handleSortChange}>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
</div>
      <hr style="margin-bottom: 1rem;" />
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id} class="blog-post">
            <a href={`/posts/${post.id}/`}>
              <div class="post-wrapper">
                {post.data.image?.url && (
                  <img 
                    src={post.data.image.url} 
                    alt={post.data.image.alt || post.data.title} 
                    class="blog-thumbnail" 
                  />
                )}
                <p class="post-title">{post.data.title}</p>
                <div 
                  class="post-tags" 
                  style="color: #aaa; font-size: 0.9rem; margin-top: 0.5rem;">
                  {post.data.tags?.length > 0 && post.data.tags.join(', ')}
                </div>
                <div class="pub-date" style="color: #aaa; font-size: 0.9rem; margin-top: 0.5rem;">
                  <i>{new Date(post.data.pubDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</i>
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
