import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    flex flex-col overflow-hidden">
      <Hero />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;
