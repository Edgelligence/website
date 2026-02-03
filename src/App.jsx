import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    flex flex-col">
      <Hero />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;
