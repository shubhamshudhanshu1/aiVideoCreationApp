# Quick Deployment Checklist

Use this checklist to ensure you have everything ready for deployment.

## ✅ Pre-Deployment Requirements

### Services to Set Up

- [ ] **PostgreSQL Database**
  - Managed: Supabase/Neon (free) or Railway/Render ($5-15/month)
  - Self-hosted: Docker container or VPS
  
- [ ] **Redis Cache**
  - Upstash Redis (free tier) or Redis Cloud
  - Self-hosted: Docker container
  
- [ ] **Cloudflare R2 Storage**
  - Create bucket in Cloudflare R2
  - Get API token (Access Key ID + Secret)
  - Set up custom domain (optional)
  - Configure CORS rules
  
- [ ] **Email/SMTP Provider**
  - Resend (recommended, 3k emails/month free)
  - SendGrid (100 emails/day free)
  - AWS SES (very cheap, requires setup)
  - Mailgun (5k emails/month free)

### Environment Variables to Configure

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://... or rediss://... (SSL)

# Auth
JWT_SECRET=(generate: openssl rand -base64 32)

# Email
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=noreply@yourdomain.com

# Cloudflare R2
R2_ENDPOINT=https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com
R2_REGION=auto
R2_BUCKET=your-bucket-name
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_BASE=https://your-domain.com

# App
NODE_ENV=production
USE_MOCK_VIDEO=true
```

## 🚀 Deployment Platforms (Choose One)

### Option 1: Vercel (Easiest for Next.js)
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Set environment variables
- [ ] Run migrations after deploy
- [ ] ✅ Done!

### Option 2: Railway (Easiest Full Stack)
- [ ] Connect GitHub repo
- [ ] Add PostgreSQL service
- [ ] Add Redis service
- [ ] Deploy app service
- [ ] Set environment variables
- [ ] Run migrations
- [ ] ✅ Done!

### Option 3: VPS (DigitalOcean/Linode)
- [ ] Create droplet/server
- [ ] Install Docker
- [ ] Clone repo
- [ ] Configure .env
- [ ] Set up Nginx + SSL
- [ ] Deploy with docker-compose
- [ ] Run migrations
- [ ] ✅ Done!

## 🔍 Post-Deployment Checks

- [ ] App loads at root URL
- [ ] Database migrations completed
- [ ] Can register/login (test OTP)
- [ ] Can create videos
- [ ] Videos upload to R2
- [ ] Videos play correctly
- [ ] HTTPS/SSL working
- [ ] Environment variables secured
- [ ] Monitoring set up (optional)

## 💰 Budget Planning

### Free Tier Setup
- Vercel (Free) + Supabase (Free) + Upstash (Free) + Cloudflare R2 (Free) + Resend (Free)
- **Cost**: $0/month

### Small Production
- Vercel Pro ($20) + Managed DB ($10) + Redis ($10) + Email ($15)
- **Cost**: ~$55/month

### Medium Scale
- VPS ($40) + Managed Services ($50) + Storage ($50) + Email ($80)
- **Cost**: ~$220/month

---

**See `DEPLOYMENT_GUIDE.md` for detailed instructions!**

