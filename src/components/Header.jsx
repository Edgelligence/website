import { useTheme } from '../hooks/useTheme';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="flex-shrink-0 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-lg sm:text-xl font-semibold tracking-tight select-none">
          Edgelligence
        </span>
        
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="p-2 rounded-lg
                     text-slate-600 dark:text-slate-400
                     hover:text-slate-900 dark:hover:text-slate-100
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-colors duration-200"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
