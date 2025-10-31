# How to Fix S3/R2 Credentials

The error `Credential access key has length 21, should be 32` means your R2 credentials are invalid or placeholder values.

## Step-by-Step Guide

### Step 1: Get Cloudflare R2 Credentials

1. **Go to Cloudflare Dashboard**

   - Visit: https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to R2**

   - In the sidebar, click **"R2"** (or go to Workers & Pages → R2)

3. **Create or Use Existing Bucket**

   - If you don't have a bucket, create one:
     - Click **"Create bucket"**
     - Give it a name (e.g., `ai-video-storage`)
     - Click **"Create bucket"**

4. **Create API Token**

   - Click **"Manage R2 API Tokens"** (usually in the top right or in settings)
   - Click **"Create API Token"**
   - Fill in:
     - **Token Name**: e.g., "ai-video-app"
     - **Permissions**: Select **"Object Read & Write"**
     - **Bucket**: Select your bucket name (or "All buckets" for access to all)
     - **TTL**: Optional (leave empty for no expiration)
   - Click **"Create API Token"**

5. **Copy Your Credentials**
   - After creation, you'll see:
     - **Access Key ID**: A long string (usually ~32 characters)
     - **Secret Access Key**: Another long string (save this immediately - you can't see it again!)
   - ⚠️ **IMPORTANT**: Copy the Secret Access Key NOW - you won't be able to see it again after closing the dialog!

### Step 2: Update docker-compose.yml

Open `docker-compose.yml` and update the R2 credentials in the `app-dev` section:

```yaml
# Cloudflare R2 Storage
R2_ENDPOINT: "https://c5f48a82dab81ee223aa84f4b9917291.r2.cloudflarestorage.com"
R2_REGION: "auto"
R2_BUCKET: "your-actual-bucket-name" # ← Replace with your bucket name
R2_PUBLIC_BASE: "https://your-custom-domain.com" # ← Or use R2 public URL
R2_ACCESS_KEY_ID: "your_actual_access_key_id" # ← Replace with your Access Key ID
R2_SECRET_ACCESS_KEY: "your_actual_secret_access_key" # ← Replace with your Secret Access Key
```

**Example:**

```yaml
R2_BUCKET: "ai-video-storage"
R2_PUBLIC_BASE: "https://pub-xxxxxxxxxxxxx.r2.dev"
R2_ACCESS_KEY_ID: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
R2_SECRET_ACCESS_KEY: "x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4"
```

### Step 3: Set Up Public Access (Optional but Recommended)

You have two options for `R2_PUBLIC_BASE`:

#### Option A: Use R2 Public URL (Easiest)

1. In Cloudflare R2 → Your Bucket → Settings
2. Enable **"Public Access"**
3. Copy the public URL (looks like: `https://pub-xxxxxxxxxxxxx.r2.dev`)
4. Use this as your `R2_PUBLIC_BASE`

#### Option B: Use Custom Domain (Advanced)

1. In Cloudflare R2 → Your Bucket → Settings → Custom Domain
2. Add your custom domain
3. Configure DNS as instructed
4. Use your custom domain as `R2_PUBLIC_BASE`

For development, **Option A is recommended**.

### Step 4: Restart Docker Services

After updating `docker-compose.yml`:

```bash
# Stop the current app
docker-compose stop app-dev

# Restart with new credentials
docker-compose up -d app-dev

# Or if you want to see logs
docker-compose up app-dev
```

### Step 5: Verify It Works

Try generating a video again. You should see in the logs:

```
Video uploaded to S3: draft/{userId}/{projectId}/video.mp4
```

Instead of:

```
S3 upload failed, using external URL: ...
```

## Alternative: Use AWS S3 Instead

If you prefer AWS S3 instead of Cloudflare R2:

1. **Get AWS Credentials**

   - Go to AWS Console → IAM → Users
   - Create a user with S3 access
   - Generate Access Keys

2. **Create S3 Bucket**

   - Go to S3 → Create bucket
   - Configure CORS and public access as needed

3. **Update docker-compose.yml**
   ```yaml
   # Use AWS S3 instead of R2
   AWS_ACCESS_KEY_ID: "your_aws_access_key"
   AWS_SECRET_ACCESS_KEY: "your_aws_secret_key"
   S3_BUCKET: "your-s3-bucket-name"
   S3_PUBLIC_BASE: "https://your-s3-bucket.s3.region.amazonaws.com"
   ```

## Troubleshooting

### "Access Denied" errors

- Verify Access Key ID and Secret Access Key are correct (no extra spaces)
- Check bucket name matches exactly
- Ensure API token has "Object Read & Write" permissions

### "Invalid endpoint" errors

- Verify `R2_ENDPOINT` matches your Cloudflare account ID
- Format should be: `https://{account-id}.r2.cloudflarestorage.com`

### Videos not accessible

- Check `R2_PUBLIC_BASE` is set correctly
- Verify bucket has public access enabled
- For custom domain, check DNS is configured correctly

### Credentials still not working

- Make sure you restarted the Docker container after updating credentials
- Check for typos or extra spaces in credentials
- Verify the credentials work in Cloudflare Dashboard

## Security Note

⚠️ **Never commit real credentials to Git!**

Consider using environment variables instead of hardcoding in docker-compose.yml:

1. Create a `.env` file (add to `.gitignore`):

   ```env
   R2_ACCESS_KEY_ID=your_actual_access_key_id
   R2_SECRET_ACCESS_KEY=your_actual_secret_access_key
   R2_BUCKET=your-bucket-name
   R2_PUBLIC_BASE=https://pub-xxxxx.r2.dev
   ```

2. Update docker-compose.yml to use variables:
   ```yaml
   R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID}
   R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY}
   R2_BUCKET: ${R2_BUCKET}
   R2_PUBLIC_BASE: ${R2_PUBLIC_BASE}
   ```
