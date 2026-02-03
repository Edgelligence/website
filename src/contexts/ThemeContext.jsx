import { useState, useEffect } from 'react';
import { ThemeContext } from './themeContext';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then prefer dark mode
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgelligence_theme');
      if (saved) return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('edgelligence_theme', theme);
    
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
