import { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Store email (in real implementation, this would send to a backend)
      console.log('Newsletter signup:', email);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto px-4 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent transition-all text-sm"
        />
        <button
          type="submit"
          disabled={submitted}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                     rounded-lg transition-all duration-200 disabled:opacity-50 
                     disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
        >
          {submitted ? '✓ Subscribed!' : 'Notify Me'}
        </button>
      </form>
    </section>
  );
}

export default Newsletter;
