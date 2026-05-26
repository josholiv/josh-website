import { useState, useEffect, useRef } from 'preact/hooks';
import { Tag as TagIcon, ChevronRight, X, Box, Dna, Rss, Code as CodeIcon, Map as MapIcon, SportShoe, Book } from 'lucide-preact';

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

const renderTagLabel = (tag) => {
  const Icon = getTagIcon(tag);
  return (
    <>
      {Icon ? <Icon size="0.9rem" className="tag-icon" aria-hidden="true" /> : <span aria-hidden="true">#</span>}
      <span>{tag}</span>
    </>
  );
};

const TagFilterPanel = ({ posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const isMounted = useRef(false);

  const allTags = [...new Set(posts.flatMap(p => p.data.tags || []))];
  const tagCounts = allTags.map(tag => ({
    tag,
    count: posts.filter(p => p.data.tags?.includes(tag)).length,
  }));
  tagCounts.sort((a, b) => b.count === a.count ? a.tag.localeCompare(b.tag) : b.count - a.count);
  const sortedTags = tagCounts.map(tc => tc.tag);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get('tag');
    if (tagFromUrl) setSelectedTags([tagFromUrl]);

    const applyOpen = () => setIsOpen(window.innerWidth >= 1300);
    applyOpen();
    window.addEventListener('resize', applyOpen, { passive: true });
    return () => window.removeEventListener('resize', applyOpen);
  }, []);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    document.dispatchEvent(new CustomEvent('blog:tagchange', { detail: { tags: selectedTags } }));
  }, [selectedTags]);

  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <nav className="toc tag-filter-panel" id="tag-panel" data-open={String(isOpen)}>
      <button className="toc-title" onClick={() => setIsOpen(o => !o)}>
        <TagIcon size="0.9rem" />
        Tags
        <span className="toc-chevron">
          <ChevronRight size="0.9rem" />
        </span>
      </button>
      <div className="toc-body">
        <div className="toc-body-inner">
          <ul className="tag-filter-list">
            {sortedTags.map(tag => (
              <li key={tag} className="tag-filter-item">
                <span
                  className={`tag ${getTagThemeClass(tag)} ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagClick(tag)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleTagClick(tag)}
                >
                  {renderTagLabel(tag)}
                  <span className="tag-count">
                    ({posts.filter(p => p.data.tags?.includes(tag)).length})
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              style={{ background: 'none', border: 'none', padding: '0.4rem 0 0', cursor: 'pointer', color: 'var(--text-normal)', display: 'inline-flex', alignItems: 'center' }}
              aria-label="Clear tag filter"
            >
              <X size={16} strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TagFilterPanel;
