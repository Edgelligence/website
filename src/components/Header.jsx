import { useTheme } from '../hooks/useTheme';

// Theme toggle icons
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full px-4 py-4 md:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Edgelligence
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-white
                     hover:bg-gray-100 dark:hover:bg-gray-800 
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}

export default Header;
