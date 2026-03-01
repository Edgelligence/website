/**
 * Health Check API - Vercel Serverless Function
 *
 * Provides health status for the notification system.
 */

import { neon } from '@neondatabase/serverless';

/**
 * Handle GET /api/health
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      database: 'unknown',
    },
  };

  // Check database connectivity
  if (process.env.edgelligence_DATABASE_URL) {
    try {
      const sql = neon(process.env.edgelligence_DATABASE_URL);
      // Simple query to check connectivity
      await sql`SELECT 1 as test`;
      health.services.database = 'ok';
    } catch (error) {
      console.error('Database health check failed:', error);
      health.services.database = 'error';
      health.status = 'degraded';
    }
  } else {
    health.services.database = 'not_configured';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(health);
}
