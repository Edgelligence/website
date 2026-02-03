import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col
                      bg-gradient-to-br from-slate-50 via-white to-slate-100
                      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                      text-slate-900 dark:text-slate-100
                      transition-colors duration-300">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 min-h-0">
          <Hero />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
