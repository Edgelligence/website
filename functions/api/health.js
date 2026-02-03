/**
 * Health Check API - Cloudflare Worker Function
 * 
 * Provides health status for the notification system.
 */

/**
 * Create JSON response
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
 * Handle GET /api/health
 */
export async function onRequestGet(context) {
  const { env } = context;
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
    },
  };
  
  // Check D1 database connectivity
  if (env.DB) {
    try {
      await env.DB.prepare('SELECT 1').first();
      health.services.database = 'ok';
    } catch (error) {
      health.services.database = 'error';
      health.status = 'degraded';
      console.error('Database health check failed:', error);
    }
  } else {
    health.services.database = 'not_configured';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  return jsonResponse(health, statusCode);
}

/**
 * Handle other methods
 */
export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Allow': 'GET, OPTIONS',
      },
    });
  }
  
  return jsonResponse({ 
    success: false, 
    error: 'Method not allowed' 
  }, 405);
}
