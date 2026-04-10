import { useState, useRef, useEffect } from 'preact/hooks';
import { ChevronRight } from 'lucide-preact';

const Dropdown = ({ options, defaultOption, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultOption ?? options[0]);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
      <button className="btn icon-container-inline" onClick={() => setOpen(prev => !prev)}>
        {selected}
        <ChevronRight
          size="1rem"
          style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
      {open && (
        <div className="sort-dropdown">
          {options.map(option => (
            <button
              key={option}
              className="btn"
              style={{ borderRadius: 0, width: '100%', boxShadow: 'none' }}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;