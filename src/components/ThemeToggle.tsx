import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') {
        setIsLight(true);
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    const mode = next ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem('theme', mode);
    } catch {}
  };

  return (
    <button
      onClick={toggleTheme}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: isLight ? '#facc15' : '#94a3b8',
        padding: '6px 10px',
        borderRadius: 999,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
      aria-label="Toggle Theme"
    >
      {isLight ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
};
