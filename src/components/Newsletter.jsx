import { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    setStatus('submitting');
    
    try {
      // Get existing subscriptions from localStorage
      const existingData = localStorage.getItem('edgelligence_subscriptions');
      const subscriptions = existingData ? JSON.parse(existingData) : [];
      
      // Check if email already exists
      const emailExists = subscriptions.some(sub => sub.email === email);
      
      if (emailExists) {
        setStatus('error');
        setMessage('You are already subscribed!');
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
        return;
      }
      
      // Add new subscription
      const newSubscription = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'landing_page'
      };
      
      subscriptions.push(newSubscription);
      
      // Save to localStorage
      localStorage.setItem('edgelligence_subscriptions', JSON.stringify(subscriptions));
      
      // Success feedback
      setStatus('success');
      setMessage('Successfully subscribed!');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setEmail('');
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'submitting':
        return 'Subscribing...';
      case 'success':
        return '✓ Subscribed!';
      case 'error':
        return '✗ Try Again';
      default:
        return 'Notify Me';
    }
  };

  const getButtonClass = () => {
    const baseClass = "px-6 py-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm";
    
    switch (status) {
      case 'success':
        return `${baseClass} bg-green-600 hover:bg-green-700 text-white`;
      case 'error':
        return `${baseClass} bg-red-600 hover:bg-red-700 text-white`;
      case 'submitting':
        return `${baseClass} bg-blue-600 text-white opacity-50 cursor-not-allowed`;
      default:
        return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
    }
  };

  return (
    <section className="w-full max-w-md mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'submitting'}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition-all text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'success'}
            className={getButtonClass()}
          >
            {getButtonText()}
          </button>
        </div>
        {message && (
          <p 
            className={`text-sm text-center ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export default Newsletter;
