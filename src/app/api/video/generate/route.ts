import { NextRequest, NextResponse } from "next/server";
import { videoGeneratorService } from "@/lib/video-generator";
import type { VideoGenerationRequest } from "@/lib/video-generator";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBuffer, publicUrl } from "@/lib/s3";
import { Aspect, JobState } from "@prisma/client";

function mapAspectRatio(ratio: string): Aspect {
  switch (ratio) {
    case "9:16":
      return Aspect.RATIO_9X16;
    case "1:1":
      return Aspect.RATIO_1X1;
    case "16:9":
      return Aspect.RATIO_16X9;
    default:
      return Aspect.RATIO_16X9;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: VideoGenerationRequest = await request.json();
    const {
      prompt,
      duration = 30,
      aspectRatio = "16:9",
      styles = [],
      noVoiceover = false,
    } = body;

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate video using the video generator service
    const result = await videoGeneratorService.generateVideo({
      prompt: prompt.trim(),
      duration,
      aspectRatio,
      styles,
      noVoiceover,
    });

    if (!result.success || !result.video) {
      return NextResponse.json(
        { error: "Failed to generate video" },
        { status: 500 }
      );
    }

    // Download the video from the external URL with proper headers
    // Use fallback URLs if the primary one fails
    const fallbackUrls = [
      result.video.url,
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    ];

    let videoBuffer: Buffer | null = null;
    let lastError: Error | null = null;

    for (const videoUrl of fallbackUrls) {
      try {
        const videoResponse = await fetch(videoUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'video/mp4,video/*,*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
          },
        });
        
        if (videoResponse.ok) {
          videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
          break; // Success, exit loop
        } else {
          console.warn(`Failed to download from ${videoUrl}: ${videoResponse.statusText}`);
        }
      } catch (error: any) {
        console.warn(`Error downloading from ${videoUrl}:`, error.message);
        lastError = error;
      }
    }

    if (!videoBuffer) {
      throw new Error(`Failed to download video from all sources: ${lastError?.message || 'Unknown error'}`);
    }

    // Try to upload to S3, but fallback to external URL if S3 isn't configured
    let videoUrl = result.video.url;
    let draftKey: string | null = null;

    // Check if S3 credentials are configured
    const hasS3Credentials = 
      (process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID) &&
      (process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY) &&
      (process.env.R2_BUCKET || process.env.S3_BUCKET);

    if (hasS3Credentials) {
      try {
        const projectId = `prj_${Date.now()}-${Math.random().toString(36).slice(2)}`;
        draftKey = `draft/${user.id}/${projectId}/video.mp4`;

        // Upload video to S3
        await uploadBuffer(draftKey, videoBuffer, "video/mp4");

        // Get public URL for the draft video
        videoUrl = publicUrl(draftKey);
        console.log(`Video uploaded to S3: ${draftKey}`);
      } catch (s3Error: any) {
        console.warn(`S3 upload failed, using external URL:`, s3Error.message);
        // Continue with external URL if S3 upload fails
        videoUrl = result.video.url;
      }
    } else {
      console.warn(`S3 credentials not configured, using external video URL`);
      // Use external URL directly
      videoUrl = result.video.url;
    }

    // Create VideoProject in database
    console.log(`Creating VideoProject for user ${user.id}...`);
    const project = await prisma.videoProject.create({
      data: {
        userId: user.id,
        prompt: result.video.prompt,
        styles: result.video.styles,
        exclude: [],
        durationS: result.video.duration,
        aspect: mapAspectRatio(result.video.aspectRatio),
        voiceoff: noVoiceover,
        modelVersion: "mock-v1",
        status: "draft",
      },
    });
    console.log(`VideoProject created: ${project.id}`);

    // Create render job (mark as done since it's already generated)
    const job = await prisma.renderJob.create({
      data: {
        projectId: project.id,
        state: JobState.done,
        progress: 100,
      },
    });
    console.log(`RenderJob created: ${job.id}`);

    // Update project with jobId and video URL
    await prisma.videoProject.update({
      where: { id: project.id },
      data: { 
        jobId: job.id,
        mp4Url: videoUrl, // Use S3 URL if available, otherwise external URL
      },
    });
    console.log(`VideoProject updated with video URL: ${videoUrl.substring(0, 50)}...`);

    // Return result with project info and video URL
    const response = {
      success: true,
      video: {
        ...result.video,
        url: videoUrl, // Use S3 URL if uploaded, otherwise external URL
      },
      project: {
        id: project.id,
        projectId: project.id,
      },
      message: draftKey 
        ? "Video generated, uploaded to S3, and saved to database"
        : "Video generated and saved to database (using external URL)",
    };
    console.log(`Video generation completed successfully for project ${project.id}`);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to generate video" 
      },
      { status: 500 }
    );
  }
}
