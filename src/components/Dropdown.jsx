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
    window.dispatchEvent(new CustomEvent('dropdown-select', { detail: { option } }));
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>

      {/* Invisible sizer — forces container to width of longest option */}
      <div aria-hidden="true" style={{ visibility: 'hidden', height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {options.map(option => (
          <button key={option} className="btn icon-container-inline" style={{ width: '100%', justifyContent: 'space-between' }}>
            {option}
            <ChevronRight size="1rem" />
          </button>
        ))}
      </div>

      {/* Trigger button */}
      <button
        className="btn icon-container-inline"
        onClick={() => setOpen(prev => !prev)}
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
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
        <div className="sort-dropdown" style={{ width: '100%' }}>
          {options.map(option => (
            <button
              key={option}
              className="btn"
              style={{ borderRadius: 0, width: '100%', boxShadow: 'none', justifyContent: 'flex-start' }}
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