# Email OTP Authentication Setup

This document explains how to set up the email OTP authentication system.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_video_app?schema=public"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
MAIL_FROM="no-reply@ai-video-app.com"

# App Configuration
NODE_ENV="development"
```

## Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create database**:
   ```sql
   CREATE DATABASE ai_video_app;
   ```
3. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev
   ```
4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## Email Configuration

### Gmail Setup (Recommended for development)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the app password in `SMTP_PASS`

### Production Email Services

For production, use a proper email service:

- **AWS SES**: `SMTP_HOST="email-smtp.us-east-1.amazonaws.com"`
- **SendGrid**: `SMTP_HOST="smtp.sendgrid.net"`
- **Mailgun**: `SMTP_HOST="smtp.mailgun.org"`

## API Endpoints

### Start OTP

```
POST /api/auth/email/start
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Verify OTP

```
POST /api/auth/email/verify
Content-Type: application/json

{
  "otp_id": "otp_id_from_start",
  "code": "123456",
  "handle": "optional_username"
}
```

### Get Current User

```
GET /api/me
```

### Logout

```
POST /api/auth/logout
```

## Features

- ✅ Email normalization (trim, lowercase)
- ✅ 6-digit OTP codes with 5-minute TTL
- ✅ Rate limiting (5 attempts per hour per email)
- ✅ Secure session management with HTTP-only cookies
- ✅ User creation on first login
- ✅ Audit logging for security events
- ✅ Development mode with mock codes
- ✅ Production-ready error handling

## Security Features

- Password hashing with SHA-256
- Session-based authentication
- Rate limiting
- Audit logging
- Secure cookie settings
- Input validation and sanitization

## Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. In development mode, OTP codes are displayed in the UI for testing

3. Check the database for audit logs:
   ```bash
   npx prisma studio
   ```

## Production Checklist

- [ ] Use production email service (AWS SES, SendGrid, etc.)
- [ ] Set up Redis for rate limiting
- [ ] Configure proper SMTP credentials
- [ ] Set `NODE_ENV=production`
- [ ] Set up monitoring and alerting
- [ ] Configure proper database connection pooling
- [ ] Set up backup and recovery procedures
