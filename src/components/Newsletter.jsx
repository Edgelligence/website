import { useState, useEffect, useId } from 'react';

const RESET_DELAY = 3000;
const ERR_SERVICE_UNAVAILABLE = 'Service unavailable';
const ERR_INVALID_RESPONSE = 'Invalid server response';
const ERR_ALREADY_SUBSCRIBED = 'Already subscribed';
const STORAGE_KEY = 'edgelligence_pending_subscriptions';

// LocalStorage queue management
function getPendingSubscriptions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addPendingSubscription(email, source) {
  try {
    const pending = getPendingSubscriptions();
    // Avoid duplicates in queue
    if (!pending.some(sub => sub.email === email)) {
      pending.push({ email, source, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    }
  } catch (error) {
    console.error('Failed to store subscription locally:', error);
  }
}

function removePendingSubscription(email) {
  try {
    const pending = getPendingSubscriptions();
    const filtered = pending.filter(sub => sub.email !== email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to update local storage:', error);
  }
}

async function submitToApi(email, source) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), source }),
  });

  const contentType = response.headers.get('content-type') || '';
  let data;

  if (contentType.includes('application/json')) {
    const responseText = await response.text();
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { success: false, error: ERR_INVALID_RESPONSE };
    }
  } else {
    data = { success: false, error: ERR_SERVICE_UNAVAILABLE };
  }

  return { ok: response.ok, status: response.status, data };
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const emailId = useId();

  const showSuccess = (msg) => {
    setStatus('success');
    setMessage(msg);
    setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, RESET_DELAY);
  };

  const showError = (msg) => {
    setStatus('error');
    setMessage(msg);
    setTimeout(() => { setStatus('idle'); setMessage(''); }, RESET_DELAY);
  };

  // Process pending subscriptions on mount
  useEffect(() => {
    const processPending = async () => {
      const pending = getPendingSubscriptions();
      
      // Process sequentially to avoid overwhelming the API
      // and to ensure proper error handling for each subscription
      for (const subscription of pending) {
        try {
          const { ok, data } = await submitToApi(subscription.email, subscription.source);
          
          // Remove from queue on success or if already subscribed
          if ((ok && data.success) || data.error === ERR_ALREADY_SUBSCRIBED) {
            removePendingSubscription(subscription.email);
          }
        } catch {
          // Keep in queue for next retry
          console.log('Will retry subscription for:', subscription.email);
        }
      }
    };

    processPending();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;

    setStatus('submitting');
    
    try {
      const { ok, status, data } = await submitToApi(email, 'landing_page');
      
      if (ok && data.success) {
        // Remove from queue if it was pending
        removePendingSubscription(email);
        showSuccess(data.message || 'You\'re on the list!');
      } else if (data.error === ERR_ALREADY_SUBSCRIBED) {
        // Remove from queue if it was pending
        removePendingSubscription(email);
        showSuccess('You\'re already on the list!');
      } else if (status >= 500 || data.error === ERR_SERVICE_UNAVAILABLE || data.error === ERR_INVALID_RESPONSE) {
        // Service-level error - persist for retry when service recovers
        addPendingSubscription(email, 'landing_page');
        showSuccess('Saved! We\'ll notify you when back online.');
      } else {
        // Client error (validation, etc.) - show error
        showError(data.error || 'Subscription failed. Please try again later.');
      }
    } catch {
      // Network error - add to queue and show user they're queued
      addPendingSubscription(email, 'landing_page');
      showSuccess('Saved! We\'ll notify you when back online.');
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
