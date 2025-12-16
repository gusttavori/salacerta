import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

export function CustomSelect({
  options = [],
  placeholder = 'Selecione',
  value,
  onChange,
  disabled = false
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(option) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
    >
      <button
        type="button"
        className={styles.control}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
      >
        <span className={!selectedOption ? styles.placeholder : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span
          className={`${styles.arrow} ${open ? styles.open : ''}`}
        />
      </button>

      {open && (
        <ul className={styles.menu}>
          {options.map(option => (
            <li
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
