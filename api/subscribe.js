/**
 * Subscribe API - Vercel Serverless Function
 *
 * Handles email subscription requests for the "Notify Me" feature.
 * Uses Vercel KV or Postgres for persistent storage.
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
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(ip + (salt || ''));
  return hash.digest('hex').slice(0, 16);
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
 * Create JSON response with headers
 */
function jsonResponse(res, data, status = 200) {
  return res.status(status).json(data);
}

/**
 * Simple in-memory storage (for demo purposes)
 * In production, replace with Vercel Postgres, KV, or another database
 */
const subscribers = new Map();

/**
 * Handle POST /api/subscribe
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return jsonResponse(res, {
      success: false,
      error: 'Method not allowed'
    }, 405);
  }

  const body = req.body;

  if (!body) {
    return jsonResponse(res, {
      success: false,
      error: 'Invalid request body'
    }, 400);
  }

  // Validate email
  const validation = validateEmail(body.email);
  if (!validation.valid) {
    return jsonResponse(res, {
      success: false,
      error: validation.error
    }, 400);
  }

  const email = validation.email;
  const source = typeof body.source === 'string' ? body.source.slice(0, MAX_SOURCE_LENGTH) : 'landing_page';

  // Get client metadata for analytics (privacy-preserving)
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress;
  const userAgent = req.headers['user-agent']?.slice(0, 500) || null;
  const ipHash = await hashIP(clientIP, process.env.IP_SALT);

  try {
    // Check if already subscribed
    const existing = subscribers.get(email);

    if (existing && !existing.unsubscribed_at) {
      return jsonResponse(res, {
        success: false,
        error: 'Already subscribed'
      }, 409);
    }

    // Add or update subscription
    const now = new Date().toISOString();
    if (existing && existing.unsubscribed_at) {
      // Re-subscribe
      subscribers.set(email, {
        email,
        source,
        ip_hash: ipHash,
        user_agent: userAgent,
        created_at: existing.created_at,
        unsubscribed_at: null,
        updated_at: now
      });
      return jsonResponse(res, {
        success: true,
        message: 'Welcome back! You\'ve been re-subscribed.'
      });
    } else {
      // New subscription
      subscribers.set(email, {
        email,
        source,
        ip_hash: ipHash,
        user_agent: userAgent,
        created_at: now,
        unsubscribed_at: null
      });
      return jsonResponse(res, {
        success: true,
        message: 'You\'re on the list!'
      }, 201);
    }

  } catch (error) {
    console.error('Subscription error:', error);
    return jsonResponse(res, {
      success: false,
      error: 'Unable to process subscription. Please try again.'
    }, 500);
  }
}
