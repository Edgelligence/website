# Notify Me Feature Documentation

## Overview

The "Notify Me" feature allows users to subscribe to updates from Edgelligence. This implementation uses Vercel's serverless infrastructure for reliable, scalable subscription handling.

## Architecture

### Technology Stack

- **Frontend**: React component making API calls
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Neon Postgres (serverless PostgreSQL)
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
    "api": "ok",
    "database": "ok"
  }
}
```

## Database Integration

### Current Implementation

The application uses **Neon Postgres** (serverless PostgreSQL) for production-ready data persistence. Neon is the recommended database solution for Vercel deployments.

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing_page',
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
```

### Setup Instructions

1. **Create a Neon Database**
   - Visit [neon.tech](https://neon.tech) and sign up (free tier available)
   - Create a new project
   - Copy the connection string (starts with `postgresql://`)

2. **Initialize Database**
   - Open the Neon SQL Editor
   - Run the SQL script from `scripts/init-db.sql`
   - This creates the `subscribers` table and indexes

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add `DATABASE_URL` with your Neon connection string
   - Optionally add `IP_SALT` for IP hashing

4. **Deploy**
   - Push your code to trigger deployment
   - Vercel will automatically use the environment variables

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

- **Database Integration**: Uses Neon Postgres with parameterized queries
- **Input Validation**: Server-side email format validation
- **Duplicate Detection**: Database-level unique constraint on email
- **Re-subscription**: Allows previously unsubscribed users to re-subscribe
- **Privacy**: Hashes IP addresses for analytics without storing raw IPs
- **Error Handling**: Graceful handling of database and validation errors
- **CORS Support**: Enables cross-origin requests

## Features

1. **Global Distribution**: Vercel's edge network for fast response times
2. **Low Latency**: Functions run close to users
3. **Production-Ready Database**: Neon Postgres for reliable data persistence
4. **Duplicate Prevention**: Database-level unique constraint
5. **Re-subscription Support**: Users can re-subscribe after unsubscribing
6. **Error Handling**: Clear error messages for network and API failures
7. **Privacy**: IP hashing for analytics without raw IP storage
8. **Scalability**: Serverless architecture handles traffic automatically
9. **Connection Pooling**: Neon provides automatic connection management

## Privacy Considerations

- **Minimal Data**: Only stores email, source, and analytics metadata
- **IP Hashing**: Client IPs are hashed before storage
- **User Control**: Unsubscription support (can be extended with API endpoint)
- **GDPR Ready**: Architecture supports data export and deletion

## Deployment

### Local Development

For local development with database access:

```bash
# Install dependencies
npm install

# Set up environment variables (create .env.local)
# DATABASE_URL=your_neon_connection_string

# Start the development server with Vercel CLI
npm install -g vercel
vercel dev
```

The Vercel CLI runs at `http://localhost:3000/` with full API and database support.

For frontend-only development (API calls will fail):
```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173/`.

### Production Deployment

#### Step 1: Set Up Neon Database

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Run the initialization script (`scripts/init-db.sql`) in Neon SQL Editor

#### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`: Your Neon connection string
   - `IP_SALT`: Random string for IP hashing (optional)
4. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
# Set environment variables
vercel env add DATABASE_URL
vercel env add IP_SALT

# Deploy
vercel --prod
```

### Environment Variables

Set these in the Vercel dashboard (Settings > Environment Variables):

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | **Yes** |
| `IP_SALT` | Salt for IP address hashing | Optional |

**Note**: The `DATABASE_URL` should be in this format:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

## Monitoring

### Health Checks

Monitor the `/api/health` endpoint to ensure the service is operational:

```bash
curl https://your-domain.vercel.app/api/health
```

The health check verifies both API and database connectivity.

### Database Management

Access your Neon database console to:
- View subscriber data
- Run analytics queries
- Export subscriber lists
- Monitor database performance

Example queries:

```sql
-- Count total subscribers
SELECT COUNT(*) FROM subscribers WHERE unsubscribed_at IS NULL;

-- List recent subscribers
SELECT email, source, created_at
FROM subscribers
WHERE unsubscribed_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Get subscribers by source
SELECT source, COUNT(*) as count
FROM subscribers
WHERE unsubscribed_at IS NULL
GROUP BY source;
```

## Security Considerations

- **Input Validation**: Server-side validation prevents malformed data
- **SQL Injection**: Parameterized queries prevent injection attacks (using Neon's tagged template literals)
- **Rate Limiting**: Vercel provides built-in DDoS protection
- **HTTPS Only**: All traffic encrypted in transit
- **XSS Protection**: React automatically escapes user input
- **Database Security**: Neon provides SSL connections and automatic backups
- **Unique Constraints**: Database-level duplicate prevention

## Future Enhancements

1. **Email Verification**: Add double opt-in with verification emails
2. **Unsubscribe API**: Add `/api/unsubscribe` endpoint
3. **Admin Dashboard**: View and manage subscribers
4. **Notification Delivery**: Integrate with email service (SendGrid, Resend, etc.)
5. **Analytics**: Enhanced tracking of subscription sources and engagement
6. **Webhooks**: Notify external systems of new subscriptions
7. **Backup Strategy**: Implement additional backup procedures beyond Neon's automatic backups
