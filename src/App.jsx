import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="md:h-screen md:max-h-screen md:overflow-hidden min-h-screen 
                      bg-gradient-to-br from-gray-50 via-white to-gray-100
                      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                      flex flex-col transition-colors duration-300">
        <Header />
        <Hero />
        <Newsletter />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
