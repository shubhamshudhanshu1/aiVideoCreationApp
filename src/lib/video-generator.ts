/**
 * Video Generation Service
 *
 * This module handles video generation from text prompts.
 * Currently uses a dummy/mock generator for development.
 * Can be easily swapped with real AI services (Replicate, RunwayML, etc.)
 */

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  styles?: string[];
  noVoiceover?: boolean;
}

export interface GeneratedVideo {
  url: string;
  thumbnailUrl: string;
  duration: number;
  aspectRatio: string;
  prompt: string;
  styles: string[];
  generatedAt: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  video: GeneratedVideo;
  message: string;
}

/**
 * Dummy Video Generator
 * Returns placeholder videos for development and prototyping
 */
export class DummyVideoGenerator {
  /**
   * Generate a video from a text prompt
   * @param request Video generation request
   * @returns Generated video response
   */
  async generate(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResponse> {
    const {
      prompt,
      duration = 30,
      aspectRatio = "16:9",
      styles = [],
      noVoiceover = false,
    } = request;

    // Simulate processing time (2-4 seconds)
    const processingTime = 2000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // Generate different video URLs based on aspect ratio
    // Using reliable, publicly accessible video URLs that actually work
    const videoUrls = {
      "16:9": [
        "https://www.w3schools.com/html/mov_bbb.mp4", // Big Buck Bunny (horizontal)
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      ],
      "9:16": [
        "https://www.w3schools.com/html/mov_bbb.mp4", // Vertical - use horizontal video (will be cropped)
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
      ],
      "1:1": [
        "https://www.w3schools.com/html/mov_bbb.mp4", // Square - use horizontal video (will be cropped)
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4",
      ],
    };

    // Select a random video from the array for variety
    const availableUrls =
      videoUrls[aspectRatio as keyof typeof videoUrls] || videoUrls["16:9"];
    const videoUrl =
      availableUrls[Math.floor(Math.random() * availableUrls.length)];

    // Generate a thumbnail with random seed based on prompt and timestamp
    const thumbnailSeed = Date.now() + prompt.length;
    const thumbnailUrl = `https://picsum.photos/seed/${thumbnailSeed}/1280/720`;

    return {
      success: true,
      video: {
        url: videoUrl,
        thumbnailUrl: thumbnailUrl,
        duration: Math.min(Math.max(duration, 5), 60), // Clamp between 5-60 seconds
        aspectRatio: aspectRatio,
        prompt: prompt,
        styles: styles,
        generatedAt: new Date().toISOString(),
      },
      message: "Mock video generated (development mode)",
    };
  }
}

/**
 * Video Generator Service
 * Main entry point for video generation
 * Can be extended to support multiple providers
 */
export class VideoGeneratorService {
  private generator: DummyVideoGenerator;

  constructor() {
    // Initialize with dummy generator
    // In the future, can be swapped with:
    // - ReplicateGenerator
    // - RunwayMLGenerator
    // - CustomAIGenerator
    this.generator = new DummyVideoGenerator();
  }

  /**
   * Generate a video from a text prompt
   * @param request Video generation request
   * @returns Generated video response
   */
  async generateVideo(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResponse> {
    try {
      return await this.generator.generate(request);
    } catch (error: any) {
      console.error("Video generation error:", error);
      throw new Error(error.message || "Failed to generate video");
    }
  }

  /**
   * Set a custom generator (for testing or future AI integrations)
   * @param generator Custom video generator
   */
  setGenerator(generator: DummyVideoGenerator): void {
    this.generator = generator;
  }
}

// Export singleton instance
export const videoGeneratorService = new VideoGeneratorService();
