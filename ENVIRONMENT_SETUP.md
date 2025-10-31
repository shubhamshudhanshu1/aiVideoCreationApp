# Environment Variables Setup

## Required Environment Variables

### Database
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`
  - Default in docker-compose: `postgresql://user:password@db:5432/ai_video_app?schema=public`

### Redis
- `REDIS_URL` - Redis connection string
  - Default in docker-compose: `redis://redis:6379`

### Auth & Security
- `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
  - **Important**: Change this in production!
  - Generate with: `openssl rand -base64 32`

### Email/SMTP
- `SMTP_HOST` - SMTP server hostname
  - Dev: `mailhog` (uses MailHog container)
  - Prod: `smtp.sendgrid.net` or your SMTP provider
- `SMTP_PORT` - SMTP port (usually 587)
- `SMTP_USER` - SMTP username
  - For SendGrid: `apikey`
- `SMTP_PASS` - SMTP password/API key
- `MAIL_FROM` - From email address

### Cloudflare R2 (Video Storage)
- `R2_ENDPOINT` - R2 API endpoint
  - Format: `https://{account-id}.r2.cloudflarestorage.com`
  - Default: `https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com`
- `R2_REGION` - R2 region (always `"auto"`)
- `R2_ACCESS_KEY_ID` - R2 API token access key
- `R2_SECRET_ACCESS_KEY` - R2 API token secret key
- `R2_BUCKET` - R2 bucket name for storing videos
- `R2_PUBLIC_BASE` - Public base URL (custom domain or CDN URL)
  - Format: `https://your-custom-domain.com`

### Video Generation
- `USE_MOCK_VIDEO` - Use mock videos instead of real AI
  - Set to `"true"` for development
  - Set to `"false"` when using real AI services

### Node.js
- `NODE_ENV` - Environment (`development` or `production`)
- `NODE_TLS_REJECT_UNAUTHORIZED` - Set to `0` in dev (bypass SSL verification)

### Prisma (Optional)
- `PRISMA_ENGINES_CHECKSUM_IGNORE=1` - Ignore engine checksums
- `PRISMA_CLI_NO_ENGINE_CHECK=1` - Skip engine checks

## Docker Compose Configuration

All environment variables are configured in `docker-compose.yml`:

### Development (`app-dev` service)
- Uses MailHog for email (no SMTP credentials needed)
- Mock videos enabled by default
- Database, Redis, and MailHog all run in containers

### Production (`app` service)
- Requires real SMTP credentials
- Requires AWS S3 credentials for video storage
- All services connected via Docker network

## Setting Up Environment Variables

### Option 1: Using .env file (Recommended)
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@localhost:5434/ai_video_app
JWT_SECRET=your_strong_secret_key_here
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your-bucket-name
S3_PUBLIC_BASE=https://your-cdn.cloudfront.net
```

Then reference in docker-compose:
```yaml
JWT_SECRET: ${JWT_SECRET}
AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
```

### Option 2: Direct in docker-compose.yml
Set values directly in `docker-compose.yml` (not recommended for secrets)

### Option 3: System Environment Variables
Export variables in your shell:
```bash
export JWT_SECRET=your_secret
export AWS_ACCESS_KEY_ID=your_key
```

Docker Compose will automatically pick them up.

## Quick Start

1. **Copy environment template** (if .env.example exists):
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your values**

3. **Start services**:
   ```bash
   docker-compose up -d db redis mailhog
   ```

4. **Run migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Start dev server**:
   ```bash
   docker-compose up app-dev
   ```

## Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure production SMTP (SendGrid, AWS SES, etc.)
- [ ] Set up AWS S3 bucket and CloudFront
- [ ] Add AWS credentials
- [ ] Set `USE_MOCK_VIDEO=false` (if using real AI)
- [ ] Update `MAIL_FROM` to your domain
- [ ] Set `NODE_ENV=production`
- [ ] Review and secure all secrets

## Notes

- **Development**: Most services work without external credentials (uses MailHog, mock videos)
- **Production**: Requires real SMTP and S3 credentials
- **AWS S3**: Optional but recommended for video storage. Without it, videos must be stored elsewhere
- **JWT_SECRET**: Currently used for future JWT token generation (if needed)

