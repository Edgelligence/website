import { useState, useId, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'edgelligence_subscribers';

function getStoredEmails() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function storeEmail(email) {
  try {
    const stored = getStoredEmails();
    const trimmed = email.trim().toLowerCase();
    if (!stored.includes(trimmed)) {
      stored.push(trimmed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
  } catch {
    // localStorage unavailable
  }
}

function isEmailStored(email) {
  return getStoredEmails().includes(email.trim().toLowerCase());
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
      data = { success: false, error: 'Invalid server response' };
    }
  } else {
    data = { success: false, error: 'Service unavailable' };
  }

  return { ok: response.ok, data };
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const emailId = useId();

  const syncPending = useCallback(async () => {
    const stored = getStoredEmails();
    if (stored.length === 0) return;

    const synced = [];
    for (const e of stored) {
      try {
        const { ok, data } = await submitToApi(e, 'landing_page');
        if ((ok && data.success) || data.error === 'Already subscribed') {
          synced.push(e);
        }
      } catch {
        break;
      }
    }

    if (synced.length > 0) {
      try {
        const remaining = stored.filter((e) => !synced.includes(e));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  useEffect(() => {
    syncPending();
  }, [syncPending]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;

    if (isEmailStored(email)) {
      setStatus('success');
      setMessage('You\'re already on the list!');
      setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, 3000);
      return;
    }

    setStatus('submitting');
    
    try {
      const { ok, data } = await submitToApi(email, 'landing_page');
      
      if (ok && data.success) {
        storeEmail(email);
        setStatus('success');
        setMessage(data.message || 'You\'re on the list!');
        setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, 3000);
      } else if (data.error === 'Already subscribed') {
        storeEmail(email);
        setStatus('success');
        setMessage('You\'re already on the list!');
        setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, 3000);
      } else if (data.error === 'Service unavailable' || data.error === 'Invalid server response') {
        // API not properly configured — save locally as fallback
        storeEmail(email);
        setStatus('success');
        setMessage('You\'re on the list!');
        setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
      }
    } catch {
      // API unavailable — save locally as fallback
      storeEmail(email);
      setStatus('success');
      setMessage('You\'re on the list!');
      setTimeout(() => { setStatus('idle'); setMessage(''); setEmail(''); }, 3000);
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
