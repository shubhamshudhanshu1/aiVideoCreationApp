import { NextRequest, NextResponse } from "next/server";
import { videoGeneratorService } from "@/lib/video-generator";
import type { VideoGenerationRequest } from "@/lib/video-generator";

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json(result);
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
