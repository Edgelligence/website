import { useState, useId, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'edgelligence_subscribers';
const RESET_DELAY = 3000;
const ERR_SERVICE_UNAVAILABLE = 'Service unavailable';
const ERR_INVALID_RESPONSE = 'Invalid server response';
const ERR_ALREADY_SUBSCRIBED = 'Already subscribed';

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
      data = { success: false, error: ERR_INVALID_RESPONSE };
    }
  } else {
    data = { success: false, error: ERR_SERVICE_UNAVAILABLE };
  }

  return { ok: response.ok, data };
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

  const syncPending = useCallback(async () => {
    const stored = getStoredEmails();
    if (stored.length === 0) return;

    const synced = [];
    for (const e of stored) {
      try {
        const { ok, data } = await submitToApi(e, 'landing_page');
        if ((ok && data.success) || data.error === ERR_ALREADY_SUBSCRIBED) {
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
      showSuccess('You\'re already on the list!');
      return;
    }

    setStatus('submitting');
    
    try {
      const { ok, data } = await submitToApi(email, 'landing_page');
      
      if (ok && data.success) {
        storeEmail(email);
        showSuccess(data.message || 'You\'re on the list!');
      } else if (data.error === ERR_ALREADY_SUBSCRIBED) {
        storeEmail(email);
        showSuccess('You\'re already on the list!');
      } else if (data.error === ERR_SERVICE_UNAVAILABLE || data.error === ERR_INVALID_RESPONSE) {
        // API not properly configured — save locally as fallback
        storeEmail(email);
        showSuccess('You\'re on the list!');
      } else {
        showError(data.error || 'Something went wrong');
      }
    } catch {
      // API unavailable — save locally as fallback
      storeEmail(email);
      showSuccess('You\'re on the list!');
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
