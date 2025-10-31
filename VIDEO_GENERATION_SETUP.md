# Video Generation Setup Guide

This guide explains how to use the AI video generation feature on the `/create` page.

## Overview

The video generation feature allows users to create videos using AI/LLM based on form inputs like prompts, duration, aspect ratio, and style preferences.

## Current Implementation

### Default Mode (Development)

- **Mock Mode**: By default, the app uses mock video generation (returns placeholder videos)
- **No API Key Required**: Works immediately without any setup
- **Perfect for Development**: Ideal for testing the UI and workflow

### Real AI Generation (Future)

Currently, the application uses mock videos for development. To enable real AI video generation, you can integrate with services like:

#### Option 1: Replicate API (Free Tier Available)

1. Sign up at [Replicate](https://replicate.com) (free tier available)
2. Get your API key
3. Modify `/src/app/api/video/generate/route.ts` to use Replicate API instead

**Replicate Models:**

- `stability-ai/stable-video-diffusion`
- `anotherjesse/zeroscope-v2-xl`

## Usage

1. Navigate to `/create` page
2. Fill in the form:
   - **Prompt**: Describe the video you want to create
   - **Duration**: Select duration (5-60 seconds)
   - **Aspect Ratio**: Choose 9:16, 1:1, or 16:9
   - **Styles**: Select style presets (optional)
   - **No Voiceover**: Toggle voiceover option
3. Click "Generate"
4. Wait for the video to be generated
5. Preview the generated video on the right side

## Environment Variables

Add these to your `.env.local` or `docker-compose.yml`:

```env
# Video generation mode (set to "false" to disable mock mode when integrating real AI)
USE_MOCK_VIDEO=true
```

## API Endpoint

The video generation is handled by `/api/video/generate` endpoint:

**Request:**

```json
{
  "prompt": "A serene sunset over mountains",
  "duration": 30,
  "aspectRatio": "16:9",
  "styles": ["cinematic"],
  "noVoiceover": true
}
```

**Response:**

```json
{
  "success": true,
  "video": {
    "url": "https://...",
    "thumbnailUrl": "https://...",
    "duration": 30,
    "aspectRatio": "16:9",
    "prompt": "...",
    "styles": ["cinematic"],
    "generatedAt": "2024-..."
  }
}
```

## Docker Setup

If using Docker, add environment variables to `docker-compose.yml`:

```yaml
app-dev:
  environment:
    # ... existing vars ...
    USE_MOCK_VIDEO: "true"
```

## Notes

- **Development Mode**: Mock videos work without any API keys
- **Production**: For production, consider using a paid service like RunwayML or Pika Labs for better quality
- **Rate Limits**: Free tiers have rate limits - check your service provider's limits
- **Video Storage**: Generated videos are currently returned as URLs. For production, you'll want to store them in S3, Cloudflare R2, or similar storage service

## Troubleshooting

### "Failed to generate video"

- Currently using mock videos - check server logs for any issues
- When integrating real AI services, ensure API keys are configured correctly
- Verify the API service is accessible
- Check network connectivity

### Mock videos not loading

- Check browser console for CORS errors
- Verify the sample video URLs are accessible
- Try using a different placeholder video URL

## Future Enhancements

- [ ] Add progress tracking during generation
- [ ] Support for video editing after generation
- [ ] Batch generation
- [ ] Save generated videos to database
- [ ] Integration with storage services (S3, Cloudflare R2)
- [ ] Multiple AI provider support
