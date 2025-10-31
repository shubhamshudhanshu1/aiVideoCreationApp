# Deployment Guide - AI Video Creation App

This guide covers everything you need to deploy this application to production.

## 🎯 Deployment Options

### Option 1: Platform-as-a-Service (PaaS) - Recommended for Beginners

**Best for**: Quick deployment, managed infrastructure, automatic scaling

#### **Vercel** (Recommended for Next.js)
- ✅ Native Next.js support
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Free tier available
- ✅ Global CDN
- ⚠️ Requires external database (PostgreSQL) and Redis
- **Cost**: Free tier, then ~$20/month for Pro

#### **Railway**
- ✅ One-click PostgreSQL + Redis
- ✅ Easy Docker deployment
- ✅ Automatic SSL
- ✅ Simple environment variable management
- **Cost**: ~$5-20/month

#### **Render**
- ✅ Managed PostgreSQL
- ✅ Docker support
- ✅ Free tier available
- ⚠️ Slow on free tier
- **Cost**: Free tier, then ~$7-25/month

#### **Fly.io**
- ✅ Global edge deployment
- ✅ Managed PostgreSQL
- ✅ Docker support
- ✅ Good for video streaming
- **Cost**: ~$5-30/month

### Option 2: Virtual Private Server (VPS)

**Best for**: Full control, cost-effective at scale

#### **DigitalOcean Droplet**
- ✅ Full control
- ✅ Docker support
- ✅ $6/month starter
- ⚠️ Requires manual setup
- **Cost**: $6-40/month

#### **Linode / Akamai**
- ✅ Similar to DigitalOcean
- ✅ Good performance
- **Cost**: $5-40/month

#### **Hetzner**
- ✅ Very affordable
- ✅ Good performance in Europe
- **Cost**: €4-30/month

### Option 3: Cloud Providers

#### **AWS (EC2, RDS, ElastiCache)**
- ✅ Enterprise-grade
- ✅ Managed services
- ⚠️ Complex setup
- ⚠️ Can be expensive
- **Cost**: $20-100+/month

#### **Google Cloud Platform (GCE, Cloud SQL, Memorystore)**
- ✅ Similar to AWS
- ✅ Good ML/AI integration
- **Cost**: $20-100+/month

#### **Azure**
- ✅ Enterprise features
- ✅ Good integration
- **Cost**: $20-100+/month

## 📋 Prerequisites & Requirements

### Essential Services

1. **PostgreSQL Database**
   - Managed: Railway, Render, Supabase, Neon, or Vercel Postgres
   - Self-hosted: Docker container or VPS

2. **Redis Cache**
   - Managed: Upstash, Redis Cloud, or Railway
   - Self-hosted: Docker container or VPS

3. **Object Storage (Cloudflare R2)**
   - Already configured in your app
   - Need: R2 bucket + API credentials

4. **Email Service (SMTP)**
   - Options: SendGrid, AWS SES, Mailgun, Resend
   - Required for OTP authentication

5. **Video Generation API** (Optional for now)
   - Currently using mock videos
   - Future: Replicate, RunwayML, Pika Labs

### Environment Variables Checklist

Create a `.env.production` or set these in your hosting platform:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# Redis
REDIS_URL=redis://host:port or rediss://host:port (for SSL)

# Authentication
JWT_SECRET=your_strong_random_secret_key_min_32_chars
# Generate with: openssl rand -base64 32

# Email/SMTP (Choose one provider)
SMTP_HOST=smtp.sendgrid.net          # For SendGrid
# OR smtp.resend.com                  # For Resend
# OR email-smtp.us-east-1.amazonaws.com  # For AWS SES
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
MAIL_FROM=noreply@yourdomain.com

# Cloudflare R2 Storage
R2_ENDPOINT=https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com
R2_REGION=auto
R2_BUCKET=your-bucket-name
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_PUBLIC_BASE=https://your-custom-domain.com

# Application
NODE_ENV=production
PORT=3000
USE_MOCK_VIDEO=true  # Set to false when using real AI

# Optional: Prisma
PRISMA_ENGINES_CHECKSUM_IGNORE=1
PRISMA_CLI_NO_ENGINE_CHECK=1
```

## 🚀 Deployment Steps by Platform

### Method 1: Deploy to Vercel (Recommended)

#### Prerequisites Setup

1. **Set up PostgreSQL**:
   - Option A: Vercel Postgres (integrated)
   - Option B: Neon (free tier) or Supabase (free tier)
   
2. **Set up Redis**:
   - Upstash Redis (free tier): https://upstash.com
   - Or Redis Cloud (free tier): https://redis.com/cloud

3. **Set up Cloudflare R2**:
   - Follow `CLOUDFLARE_R2_SETUP.md`
   - Create bucket and get API credentials

4. **Set up Email Service**:
   - Resend (recommended): https://resend.com (free tier)
   - Or SendGrid: https://sendgrid.com (100 emails/day free)

#### Deployment Steps

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ai-video-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add all variables from the checklist above

4. **Configure Build Settings**:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Database Migration**:
   - After deployment, run migrations:
   ```bash
   # Locally or via Vercel CLI
   npx prisma migrate deploy
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-app.vercel.app`

#### Limitations on Vercel

- **Serverless functions**: 10s timeout on free tier, 60s on Pro
- **Video generation**: May timeout for long operations
- **Solution**: Use Vercel Edge Functions or external job queue (BullMQ, Inngest)

---

### Method 2: Deploy to Railway

#### Setup Steps

1. **Sign up**: https://railway.app

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Or "Deploy from Dockerfile"

3. **Add Services**:
   - Add PostgreSQL database (Railway auto-creates)
   - Add Redis service
   - Add your app service

4. **Configure App Service**:
   - Environment Variables: Add all from checklist
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Or use Dockerfile

5. **Set DATABASE_URL**:
   - Railway auto-provides PostgreSQL URL
   - Use the `DATABASE_URL` from PostgreSQL service

6. **Deploy & Migrate**:
   ```bash
   # Connect via Railway CLI or web terminal
   npx prisma migrate deploy
   ```

7. **Get Public URL**:
   - Railway provides `https://your-app.railway.app`
   - Can add custom domain

---

### Method 3: Deploy to DigitalOcean Droplet (VPS)

#### Initial Setup

1. **Create Droplet**:
   - Size: $12/month (2GB RAM) minimum
   - Image: Ubuntu 22.04
   - Add SSH key

2. **SSH into Droplet**:
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Docker & Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   apt-get install docker-compose-plugin -y
   ```

4. **Clone Repository**:
   ```bash
   apt-get update
   apt-get install git -y
   git clone https://github.com/yourusername/ai-video-app.git
   cd ai-video-app
   ```

5. **Configure Environment**:
   ```bash
   nano .env
   # Add all environment variables
   ```

6. **Update docker-compose.yml**:
   - Remove `ports` mapping for production (use reverse proxy)
   - Update all environment variables

7. **Set up Reverse Proxy (Nginx)**:
   ```bash
   apt-get install nginx certbot python3-certbot-nginx -y
   ```

   Create `/etc/nginx/sites-available/ai-video-app`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/ai-video-app /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

8. **Get SSL Certificate**:
   ```bash
   certbot --nginx -d yourdomain.com
   ```

9. **Build & Start Services**:
   ```bash
   docker-compose -f docker-compose.yml build
   docker-compose -f docker-compose.yml up -d
   ```

10. **Run Migrations**:
    ```bash
    docker-compose exec app npx prisma migrate deploy
    ```

11. **Set up Auto-restart** (Docker Compose already has `restart: unless-stopped`)

---

### Method 4: Deploy with Docker to Any Platform

#### Build Docker Image

```bash
docker build -t ai-video-app .
```

#### Run with Docker Compose

1. **Update `docker-compose.yml`**:
   - Set all production environment variables
   - Configure volumes for persistent data

2. **Deploy**:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Run Migrations**:
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

---

## 🔧 Post-Deployment Checklist

### 1. Database Setup
- [ ] Database is accessible
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify tables created: `npx prisma studio` or connect via client
- [ ] (Optional) Seed initial data: `npm run db:seed`

### 2. Environment Variables
- [ ] All environment variables set correctly
- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `DATABASE_URL` is correct
- [ ] `REDIS_URL` is correct
- [ ] R2 credentials are valid
- [ ] SMTP credentials are working

### 3. Storage (Cloudflare R2)
- [ ] R2 bucket exists and is accessible
- [ ] CORS configured (if needed)
- [ ] Public URL/base domain set up
- [ ] Test upload/download

### 4. Email Service
- [ ] SMTP credentials valid
- [ ] Test email sending (OTP)
- [ ] `MAIL_FROM` domain verified (if required by provider)

### 5. Application Health
- [ ] App starts without errors
- [ ] Health check endpoint responds (if configured)
- [ ] API routes work
- [ ] Static assets load
- [ ] Database queries work

### 6. Security
- [ ] `JWT_SECRET` is unique and strong
- [ ] Database password is strong
- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables not exposed
- [ ] Rate limiting configured (if needed)

### 7. Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure logging
- [ ] Set up alerts

### 8. Domain & DNS
- [ ] Custom domain configured
- [ ] DNS records set correctly
- [ ] SSL certificate active
- [ ] CORS headers configured (if needed)

---

## 🧪 Testing Deployment

### Test Checklist

1. **Homepage**: Visit root URL, should load
2. **Login**: Test email/phone OTP flow
3. **Video Creation**: Test `/create` page
4. **Video Upload**: Test upload functionality
5. **Video Playback**: Test video player
6. **API Endpoints**: Test key API routes
7. **Database**: Verify data persists
8. **Email**: Check OTP emails arrive

### Common Issues & Fixes

#### Issue: "DATABASE_URL not found"
- **Fix**: Ensure environment variable is set in hosting platform

#### Issue: "Prisma Client not generated"
- **Fix**: Run `npx prisma generate` in build process or add to Dockerfile

#### Issue: "Connection refused" to database
- **Fix**: Check database URL, firewall rules, and network settings

#### Issue: "Redis connection failed"
- **Fix**: Verify `REDIS_URL` and ensure Redis service is running

#### Issue: "R2 access denied"
- **Fix**: Verify R2 credentials and bucket name match exactly

#### Issue: "Email not sending"
- **Fix**: Check SMTP credentials, verify domain (for some providers), check spam folder

---

## 💰 Cost Estimates

### Minimal Setup (Free/Low Cost)
- **Hosting**: Vercel (Free) or Railway ($5/month)
- **Database**: Supabase (Free) or Neon (Free tier)
- **Redis**: Upstash (Free tier)
- **Storage**: Cloudflare R2 (Free tier: 10GB storage, unlimited egress)
- **Email**: Resend (Free: 3,000 emails/month)
- **Total**: $0-5/month

### Small Scale Production
- **Hosting**: Vercel Pro ($20/month) or Railway ($20/month)
- **Database**: Managed PostgreSQL ($7-15/month)
- **Redis**: Upstash ($10/month)
- **Storage**: Cloudflare R2 ($0.015/GB/month)
- **Email**: SendGrid ($15/month for 40k emails)
- **Domain**: $12/year
- **Total**: ~$50-70/month

### Medium Scale
- **Hosting**: VPS ($20-40/month) or Vercel Enterprise
- **Database**: Managed PostgreSQL ($25-50/month)
- **Redis**: Managed Redis ($20/month)
- **Storage**: Cloudflare R2 ($50-100/month)
- **Email**: SendGrid Pro ($80/month)
- **CDN**: Cloudflare Pro ($20/month)
- **Total**: ~$200-300/month

---

## 🔐 Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use platform secrets management
   - Rotate secrets regularly

2. **Database**:
   - Use strong passwords
   - Enable SSL connections
   - Restrict network access
   - Regular backups

3. **Application**:
   - Keep dependencies updated
   - Enable HTTPS only
   - Set security headers
   - Implement rate limiting
   - Use CORS properly

4. **Authentication**:
   - Strong `JWT_SECRET`
   - Secure session management
   - Implement CSRF protection

---

## 📊 Recommended Architecture

```
┌─────────────┐
│   CDN/DNS   │ (Cloudflare)
│             │
└──────┬──────┘
       │
┌──────▼──────────────────┐
│   Next.js App          │ (Vercel/Railway/VPS)
│   - API Routes         │
│   - Server Components  │
└──────┬──────────────────┘
       │
       ├──► PostgreSQL (Managed/Self-hosted)
       ├──► Redis (Upstash/Managed)
       ├──► Cloudflare R2 (Storage)
       └──► SMTP Provider (Resend/SendGrid)
```

---

## 🚀 Quick Start Commands

### Local Testing Before Deploy
```bash
# Test production build locally
npm run build
npm start

# Or with Docker
docker-compose up --build app
```

### Deployment Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (production)
npx prisma migrate deploy

# Check database connection
npx prisma db pull

# View database
npx prisma studio
```

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs app`
2. Verify environment variables
3. Test database connection
4. Check service status
5. Review application logs in hosting platform

---

**Last Updated**: 2024

