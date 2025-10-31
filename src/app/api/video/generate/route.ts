import { NextRequest, NextResponse } from "next/server";

interface GenerateVideoRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  styles?: string[];
  noVoiceover?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json();
    const {
      prompt,
      duration = 30,
      aspectRatio = "16:9",
      styles = [],
      noVoiceover = false,
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Video generation - currently using mock videos for development
    // In production, you can integrate with services like Replicate, RunwayML, etc.
    const useMock = process.env.USE_MOCK_VIDEO !== "false";

    // Mock response - returns a placeholder video for development
    console.log("Generating video (mock mode)");
    const videoUrl =
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
    const thumbnailUrl = `https://picsum.photos/1280/720?random=${Date.now()}`;

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      video: {
        url: videoUrl,
        thumbnailUrl: thumbnailUrl,
        duration: duration,
        aspectRatio: aspectRatio,
        prompt: prompt,
        styles: styles,
        generatedAt: new Date().toISOString(),
      },
      message: useMock
        ? "Mock video generated (development mode)"
        : "Video generated successfully",
    });
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 }
    );
  }
}
