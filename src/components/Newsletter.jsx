import { useState, useId } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const emailId = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;

    setStatus('submitting');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'landing_page',
        }),
      });
      
      // Safely parse response - handle non-JSON responses gracefully
      const contentType = response.headers.get('content-type') || '';
      let data;
      
      if (contentType.includes('application/json')) {
        const responseText = await response.text();
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {
          data = { success: false, error: 'Invalid server response' };
        }
      } else {
        // Non-JSON response indicates server misconfiguration or outage
        data = { success: false, error: 'Service unavailable' };
      }
      
      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'You\'re on the list');
        
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
          setEmail('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
      }
      
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again.');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
    }
  };

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <section className="w-full max-w-md mt-6 sm:mt-8" aria-label="Newsletter signup">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <label htmlFor={emailId} className="sr-only">Email address</label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isSubmitting}
          autoComplete="email"
          className="flex-1 px-4 py-2.5 rounded-lg text-sm
                     bg-white dark:bg-slate-800
                     border border-slate-200 dark:border-slate-700
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:border-blue-500 dark:focus:border-blue-500
                     focus:ring-1 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium
                     transition-colors duration-200
                     disabled:cursor-not-allowed
                     ${isSuccess 
                       ? 'bg-emerald-600 text-white' 
                       : status === 'error'
                       ? 'bg-red-600 text-white'
                       : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                     }`}
        >
          {isSubmitting ? 'Joining...' : isSuccess ? 'Joined!' : status === 'error' ? 'Error' : 'Notify Me'}
        </button>
      </form>
      
      {message && (
        <p 
          className={`mt-2 text-sm text-center ${
            status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </section>
  );
}

export default Newsletter;
