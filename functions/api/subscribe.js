/**
 * Subscribe API - Cloudflare Worker Function
 * 
 * Handles email subscription requests for the "Notify Me" feature.
 * Uses Cloudflare D1 for persistent storage.
 */

// Email validation regex - simplified pattern that accepts most valid emails
// while being permissive enough for edge cases. Server-side validation is a
// secondary check; the HTML5 email input provides primary validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 50;

/**
 * Hash the client IP for privacy-preserving analytics
 * Uses a simple hash since we don't need cryptographic strength
 */
async function hashIP(ip, salt) {
  if (!ip) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (salt || ''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate email address
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: 'Email is too long' };
  }
  
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, email: trimmedEmail };
}

/**
 * Create JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Handle POST /api/subscribe
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Check if D1 database is configured
  if (!env.DB) {
    console.error('D1 database not configured');
    return jsonResponse({ 
      success: false, 
      error: 'Service temporarily unavailable' 
    }, 503);
  }
  
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ 
      success: false, 
      error: 'Invalid request body' 
    }, 400);
  }
  
  // Validate email
  const validation = validateEmail(body.email);
  if (!validation.valid) {
    return jsonResponse({ 
      success: false, 
      error: validation.error 
    }, 400);
  }
  
  const email = validation.email;
  const source = typeof body.source === 'string' ? body.source.slice(0, MAX_SOURCE_LENGTH) : 'landing_page';
  
  // Get client metadata for analytics (privacy-preserving)
  const clientIP = request.headers.get('CF-Connecting-IP');
  const userAgent = request.headers.get('User-Agent')?.slice(0, 500) || null;
  const ipHash = await hashIP(clientIP, env.IP_SALT);
  
  try {
    // Atomic upsert using D1 batch (single round trip, runs as a transaction).
    // 1. INSERT OR IGNORE: succeeds for new emails, silently ignored for existing
    // 2. UPDATE: re-subscribes only if previously unsubscribed
    const [insertResult, updateResult] = await env.DB.batch([
      env.DB.prepare(
        'INSERT OR IGNORE INTO subscribers (email, source, ip_hash, user_agent) VALUES (?, ?, ?, ?)'
      ).bind(email, source, ipHash, userAgent),
      env.DB.prepare(
        'UPDATE subscribers SET unsubscribed_at = NULL, source = ?, ip_hash = ?, user_agent = ? WHERE email = ? AND unsubscribed_at IS NOT NULL'
      ).bind(source, ipHash, userAgent, email),
    ]);
    
    if (insertResult.meta.changes === 1) {
      return jsonResponse({ 
        success: true, 
        message: 'You\'re on the list!' 
      }, 201);
    }
    
    if (updateResult.meta.changes === 1) {
      return jsonResponse({ 
        success: true, 
        message: 'Welcome back! You\'ve been re-subscribed.' 
      });
    }
    
    return jsonResponse({ 
      success: false, 
      error: 'Already subscribed' 
    }, 409);
    
  } catch (error) {
    console.error('Database error:', error);
    return jsonResponse({ 
      success: false, 
      error: 'Unable to process subscription. Please try again.' 
    }, 500);
  }
}

/**
 * Handle unsupported methods
 */
export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Allow': 'POST, OPTIONS',
      },
    });
  }
  
  return jsonResponse({ 
    success: false, 
    error: 'Method not allowed' 
  }, 405);
}
