# Cloudflare R2 Setup Guide

This app is configured to use **Cloudflare R2** for video storage instead of AWS S3.

## Cloudflare R2 Configuration

### Account Information
- **Account ID**: `c5f48a82dab81ee223aa84f4b9917291`
- **R2 API Endpoint**: `https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com`

### Required Credentials

1. **R2 Access Key ID** - Get from Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. **R2 Secret Access Key** - Generated when creating API token
3. **Bucket Name** - Your R2 bucket name
4. **Public Base URL** - Custom domain or Cloudflare CDN URL for public access

### Setting Up R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Create a new API token with:
   - **Permissions**: Object Read & Write
   - **Bucket**: Your bucket name
4. Copy the **Access Key ID** and **Secret Access Key**

### Configuration in docker-compose.yml

All R2 settings are configured directly in `docker-compose.yml`:

```yaml
R2_ENDPOINT: "https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com"
R2_REGION: "auto"
R2_BUCKET: "your-bucket-name"
R2_PUBLIC_BASE: "https://your-custom-domain.com"
R2_ACCESS_KEY_ID: "your_r2_access_key_id"
R2_SECRET_ACCESS_KEY: "your_r2_secret_access_key"
```

### Update These Values:

1. **R2_BUCKET**: Replace `"your-bucket-name"` with your actual bucket name
2. **R2_PUBLIC_BASE**: Replace with your public CDN URL or custom domain
   - If using Cloudflare CDN: `https://your-account-id.r2.cloudflarestorage.com/your-bucket`
   - If using custom domain: `https://your-custom-domain.com`
3. **R2_ACCESS_KEY_ID**: Your R2 API token access key
4. **R2_SECRET_ACCESS_KEY**: Your R2 API token secret key

### Example Configuration

```yaml
R2_ENDPOINT: "https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com"
R2_REGION: "auto"
R2_BUCKET: "ai-video-storage"
R2_PUBLIC_BASE: "https://ai-videos.yourdomain.com"
R2_ACCESS_KEY_ID: "abc123def456..."
R2_SECRET_ACCESS_KEY: "xyz789uvw012..."
```

## Public Access Setup

To make videos publicly accessible:

1. **Option 1: Custom Domain** (Recommended)
   - Add custom domain in R2 settings
   - Point DNS to Cloudflare
   - Use custom domain as `R2_PUBLIC_BASE`

2. **Option 2: R2 Public URL**
   - Enable public access in bucket settings
   - Use: `https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com/your-bucket`

## CORS Configuration

If accessing videos from browser, configure CORS in R2:

1. Go to R2 bucket settings
2. Add CORS rule:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Features

- ✅ S3-compatible API (uses AWS SDK)
- ✅ Presigned URLs for uploads
- ✅ Presigned URLs for downloads
- ✅ No egress fees (unlike AWS S3)
- ✅ Automatic CDN integration
- ✅ Custom domain support

## Testing

Test R2 connection:

```bash
# Upload a test file
curl -X PUT "presigned-url" \
  --upload-file test.mp4

# Verify in Cloudflare Dashboard → R2 → Your Bucket
```

## Troubleshooting

### "Access Denied" errors
- Verify Access Key ID and Secret Access Key are correct
- Check bucket name matches exactly
- Ensure API token has correct permissions

### "Invalid endpoint" errors
- Verify R2_ENDPOINT matches your account ID
- Format: `https://{account-id}.r2.cloudflarestorage.com`

### Videos not accessible publicly
- Check `R2_PUBLIC_BASE` is set correctly
- Verify bucket has public access enabled (if needed)
- Check custom domain DNS settings

