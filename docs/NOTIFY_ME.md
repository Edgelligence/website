# Notify Me Feature Documentation

## Overview

The "Notify Me" feature allows users to subscribe to updates from Edgelligence. This production-ready implementation uses Cloudflare's edge infrastructure for reliable, scalable, and globally distributed subscription handling.

## Architecture

### Technology Stack

- **Frontend**: React component making API calls
- **Backend**: Cloudflare Pages Functions (Workers)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Deployment**: Cloudflare Pages with automatic functions routing

### Data Flow

1. **User Input**: User enters email address in the Newsletter component
2. **Validation**: Client-side HTML5 validation + server-side validation
3. **Submission**: POST request to `/api/subscribe` endpoint
4. **Processing**: Cloudflare Worker validates and stores the subscription
5. **Persistence**: Email is stored in Cloudflare D1 database
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
    "database": "ok"
  }
}
```

## Database Schema

### subscribers table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| email | TEXT | Email address (unique, case-insensitive) |
| source | TEXT | Where the subscription came from |
| ip_hash | TEXT | Privacy-preserving IP hash for analytics |
| user_agent | TEXT | Browser user agent (truncated) |
| created_at | TEXT | ISO 8601 timestamp |
| verified_at | TEXT | Email verification timestamp (future use) |
| unsubscribed_at | TEXT | Unsubscription timestamp |

### Indexes

- `idx_subscribers_email` - Fast email lookups
- `idx_subscribers_created_at` - Analytics queries
- `idx_subscribers_source` - Source filtering

## Implementation Details

### Component: Newsletter.jsx

The Newsletter component handles the entire subscription flow:

- **State Management**: Uses React useState for email input and submission status
- **Form Validation**: Leverages HTML5 email validation (required + type="email")
- **API Integration**: Fetches `/api/subscribe` endpoint with proper error handling
- **Error Handling**: Gracefully handles network errors and API failures
- **User Feedback**: Visual feedback through button state changes
- **Accessibility**: Proper ARIA labels and semantic HTML

### Worker: functions/api/subscribe.js

The subscription worker handles:

- **Input Validation**: Server-side email format validation
- **Duplicate Detection**: Prevents double subscriptions
- **Re-subscription**: Allows previously unsubscribed users to re-subscribe
- **Privacy**: Hashes IP addresses for analytics without storing raw IPs
- **Error Handling**: Graceful handling of database errors and race conditions

## Features

1. **Global Distribution**: D1 replicates data across Cloudflare's edge network
2. **Low Latency**: Workers run close to users for fast response times
3. **Persistence**: Subscriptions survive indefinitely in D1 database
4. **Duplicate Prevention**: Database-level uniqueness constraint
5. **Re-subscription Support**: Users can re-subscribe after unsubscribing
6. **Error Handling**: Graceful degradation and clear error messages
7. **Privacy**: IP hashing for analytics without raw IP storage
8. **Scalability**: Handles launch-day traffic with Cloudflare's infrastructure

## Privacy Considerations

- **Minimal Data**: Only stores email, source, and analytics metadata
- **IP Hashing**: Client IPs are hashed before storage
- **No Third-Party Services**: All data stays within Cloudflare infrastructure
- **User Control**: Unsubscription support (can be extended with API endpoint)
- **GDPR Ready**: Architecture supports data export and deletion

## Deployment

### Local Development

For local development with full API functionality:

```bash
# First time setup: apply database migrations
npm run db:migrate

# Start the development server
npm run dev:full
```

This runs Wrangler Pages with a local D1 database, proxying the Vite frontend. Access the site at the URL shown (typically `http://localhost:8788`).

For frontend-only development (API calls will fail):
```bash
npm run dev
```

To preview the full production build locally:
```bash
npm run build
npm run preview
```

### Initial Setup

1. Create the D1 database:
   ```bash
   wrangler d1 create edgelligence-subscribers
   ```

2. Update `wrangler.jsonc` with the database ID from step 1

3. Apply migrations:
   ```bash
   wrangler d1 migrations apply edgelligence-subscribers
   ```

4. Set production IP salt:
   ```bash
   wrangler secret put IP_SALT
   ```

5. Deploy:
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

### Environment Variables

| Variable | Description |
|----------|-------------|
| IP_SALT | Salt for IP address hashing (set via `wrangler secret`) |

## Monitoring

### Health Checks

Monitor the `/api/health` endpoint to ensure the service is operational:

```bash
curl https://your-domain.com/api/health
```

### Database Queries

Access the D1 database via Wrangler:

```bash
# Count subscribers
wrangler d1 execute edgelligence-subscribers --command "SELECT COUNT(*) FROM subscribers"

# List recent subscribers
wrangler d1 execute edgelligence-subscribers --command "SELECT email, created_at FROM subscribers ORDER BY created_at DESC LIMIT 10"

# Export all subscribers (CSV format)
wrangler d1 execute edgelligence-subscribers --command "SELECT email, source, created_at FROM subscribers WHERE unsubscribed_at IS NULL"
```

## Security Considerations

- **Input Validation**: Server-side validation prevents malformed data
- **SQL Injection**: Parameterized queries prevent injection attacks
- **Rate Limiting**: Cloudflare provides built-in DDoS protection
- **HTTPS Only**: All traffic encrypted in transit
- **XSS Protection**: React automatically escapes user input
- **Unique Constraints**: Database-level duplicate prevention

## localStorage Fallback

The Newsletter component uses a hybrid approach combining server-side persistence with localStorage as a fallback:

1. **Primary**: Subscriptions are sent to the `/api/subscribe` endpoint for server-side persistence in D1
2. **Fallback**: When the API is unavailable or returns a non-JSON response, the email is stored in localStorage (key: `edgelligence_subscribers`)
3. **Sync on load**: On component mount, any pending localStorage entries are synced to the API, and successfully synced entries are removed from localStorage
4. **Duplicate detection**: localStorage is also checked before submission to avoid unnecessary API calls for already-stored emails

This ensures a seamless user experience even when the backend is not yet configured or temporarily unavailable.

## Future Enhancements

1. **Email Verification**: Add double opt-in with verification emails
2. **Unsubscribe API**: Add `/api/unsubscribe` endpoint
3. **Admin Dashboard**: View and manage subscribers
4. **Notification Delivery**: Integrate with email service (SendGrid, SES)
5. **Analytics**: Track subscription sources and engagement
6. **Webhooks**: Notify external systems of new subscriptions
