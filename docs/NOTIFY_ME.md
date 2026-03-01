# Notify Me Feature Documentation

## Overview

The "Notify Me" feature allows users to subscribe to updates from Edgelligence. This implementation uses Vercel's serverless infrastructure for reliable, scalable subscription handling.

## Architecture

### Technology Stack

- **Frontend**: React component making API calls
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: In-memory storage (demo) - Ready for Vercel Postgres, KV, or other database integration
- **Deployment**: Vercel with automatic serverless functions routing

### Data Flow

1. **User Input**: User enters email address in the Newsletter component
2. **Validation**: Client-side HTML5 validation + server-side validation
3. **Submission**: POST request to `/api/subscribe` endpoint
4. **Processing**: Vercel Serverless Function validates and stores the subscription
5. **Persistence**: Email is stored in the configured database
6. **Feedback**: User receives immediate visual feedback (success/failure)
7. **State Reset**: After 3 seconds, form resets to allow new submissions

### API Endpoints

#### POST /api/subscribe

Subscribe an email address to notifications.

**Request:**
```json
{
  "email": "user@example.com",
  "source": "landing_page"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "You're on the list!"
}
```

**Already Subscribed Response (409):**
```json
{
  "success": false,
  "error": "Already subscribed"
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

#### GET /api/health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-03T12:45:00.000Z",
  "services": {
    "api": "ok"
  }
}
```

## Database Integration

### Current Implementation

The current implementation uses in-memory storage for demonstration purposes. This is suitable for testing and development but **not recommended for production**.

### Recommended Production Solutions

#### Option 1: Vercel Postgres

```javascript
import { sql } from '@vercel/postgres';

// Create table (run once)
await sql`
  CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
  );
`;

// Insert subscriber
await sql`
  INSERT INTO subscribers (email, source, ip_hash, user_agent)
  VALUES (${email}, ${source}, ${ipHash}, ${userAgent})
  ON CONFLICT (email) DO UPDATE SET
    unsubscribed_at = NULL,
    source = ${source}
  WHERE subscribers.unsubscribed_at IS NOT NULL;
`;
```

#### Option 2: Vercel KV

```javascript
import { kv } from '@vercel/kv';

// Store subscriber
await kv.set(`subscriber:${email}`, {
  email,
  source,
  ipHash,
  userAgent,
  createdAt: new Date().toISOString(),
  unsubscribedAt: null
});

// Get subscriber
const subscriber = await kv.get(`subscriber:${email}`);
```

#### Option 3: MongoDB Atlas, Supabase, or Other Services

Any database service can be integrated by updating the `api/subscribe.js` file.

## Implementation Details

### Component: Newsletter.jsx

The Newsletter component handles the entire subscription flow:

- **State Management**: Uses React useState for email input and submission status
- **Form Validation**: Leverages HTML5 email validation (required + type="email")
- **API Integration**: Fetches `/api/subscribe` endpoint with proper error handling
- **Error Handling**: Surfaces network and API errors directly to the user
- **User Feedback**: Visual feedback through button state changes
- **Accessibility**: Proper ARIA labels and semantic HTML

### Serverless Function: api/subscribe.js

The subscription function handles:

- **Input Validation**: Server-side email format validation
- **Duplicate Detection**: Prevents double subscriptions
- **Re-subscription**: Allows previously unsubscribed users to re-subscribe
- **Privacy**: Hashes IP addresses for analytics without storing raw IPs
- **Error Handling**: Graceful handling of errors
- **CORS Support**: Enables cross-origin requests

## Features

1. **Global Distribution**: Vercel's edge network for fast response times
2. **Low Latency**: Functions run close to users
3. **Persistence**: Ready for database integration
4. **Duplicate Prevention**: Application-level uniqueness check
5. **Re-subscription Support**: Users can re-subscribe after unsubscribing
6. **Error Handling**: Clear error messages for network and API failures
7. **Privacy**: IP hashing for analytics without raw IP storage
8. **Scalability**: Handles traffic with Vercel's serverless infrastructure

## Privacy Considerations

- **Minimal Data**: Only stores email, source, and analytics metadata
- **IP Hashing**: Client IPs are hashed before storage
- **User Control**: Unsubscription support (can be extended with API endpoint)
- **GDPR Ready**: Architecture supports data export and deletion

## Deployment

### Local Development

For local development:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The Vite dev server runs at `http://localhost:5173/`. Note that API calls will fail in local development unless you set up Vercel CLI for local testing:

```bash
# Install Vercel CLI
npm install -g vercel

# Run with Vercel CLI (links functions and frontend)
vercel dev
```

### Production Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect the configuration
4. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
vercel --prod
```

### Environment Variables

Set these in the Vercel dashboard (Settings > Environment Variables):

| Variable | Description | Required |
|----------|-------------|----------|
| IP_SALT | Salt for IP address hashing | Optional |
| DATABASE_URL | Database connection string (if using Postgres) | For production |

## Monitoring

### Health Checks

Monitor the `/api/health` endpoint to ensure the service is operational:

```bash
curl https://your-domain.vercel.app/api/health
```

### Vercel Dashboard

Use the Vercel dashboard to monitor:
- Function invocations
- Response times
- Error rates
- Bandwidth usage

## Security Considerations

- **Input Validation**: Server-side validation prevents malformed data
- **SQL Injection**: Use parameterized queries (when database is integrated)
- **Rate Limiting**: Vercel provides built-in protection
- **HTTPS Only**: All traffic encrypted in transit
- **XSS Protection**: React automatically escapes user input
- **CORS Configuration**: Properly configured in serverless functions

## Upgrading to Production Database

To upgrade from in-memory storage to a production database:

1. Choose your database solution (Vercel Postgres, KV, etc.)
2. Install required packages:
   ```bash
   npm install @vercel/postgres
   # or
   npm install @vercel/kv
   ```
3. Update `api/subscribe.js` to use the database client
4. Set database environment variables in Vercel
5. Test locally with `vercel dev`
6. Deploy to production

## Future Enhancements

1. **Email Verification**: Add double opt-in with verification emails
2. **Unsubscribe API**: Add `/api/unsubscribe` endpoint
3. **Admin Dashboard**: View and manage subscribers
4. **Notification Delivery**: Integrate with email service (SendGrid, Resend, etc.)
5. **Analytics**: Track subscription sources and engagement
6. **Webhooks**: Notify external systems of new subscriptions
7. **Database Persistence**: Integrate Vercel Postgres or KV for production
