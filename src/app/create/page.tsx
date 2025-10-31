"use client";
import { useState } from "react";
import FormField from "@/components/FormField";
import VideoCard from "@/components/VideoCard";
import ActionButtons from "@/components/ActionButtons";

const preset = ["cinematic", "vlog", "anime", "3D", "fast-cut", "mellow"];

interface GeneratedVideo {
  url: string;
  thumbnailUrl: string;
  duration: number;
  aspectRatio: string;
  prompt: string;
  styles: string[];
  generatedAt: string;
}

export default function Create() {
  const [styles, setStyles] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(30);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [noVoiceover, setNoVoiceover] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const toggle = (s: string) =>
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: Number(duration),
          aspectRatio,
          styles,
          noVoiceover,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      if (data.success && data.video) {
        setGeneratedVideo(data.video);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="card p-5">
        <div className="flex gap-4 mb-4">
          <button className="chip">Simple</button>
          <button className="chip bg-ink text-white">Custom</button>
        </div>

        <FormField
          label="Prompt"
          type="textarea"
          placeholder="Describe your video... e.g., 'A serene sunset over mountains with birds flying'"
          rows={4}
          value={prompt}
          onChange={setPrompt}
          required
        />

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Styles</div>
          <div className="flex flex-wrap gap-2">
            {preset.map((s) => (
              <button
                key={s}
                className={`chip ${
                  styles.includes(s) ? "bg-ink text-white" : ""
                }`}
                onClick={() => toggle(s)}
                disabled={isGenerating}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <FormField
            label="Duration (seconds)"
            type="number"
            min={5}
            max={60}
            value={duration}
            onChange={(val) => setDuration(Number(val))}
          />
          <FormField
            label="Aspect Ratio"
            type="select"
            value={aspectRatio}
            onChange={setAspectRatio}
            options={[
              { value: "9:16", label: "9:16 (Vertical)" },
              { value: "1:1", label: "1:1 (Square)" },
              { value: "16:9", label: "16:9 (Horizontal)" },
            ]}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="voice"
            type="checkbox"
            className="scale-110"
            checked={noVoiceover}
            onChange={(e) => setNoVoiceover(e.target.checked)}
            disabled={isGenerating}
          />
          <label htmlFor="voice" className="text-sm">
            No voiceover
          </label>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <ActionButtons
          primary={{
            text: isGenerating ? "Generating..." : "Generate",
            variant: "btn",
            onClick: handleGenerate,
            disabled: isGenerating || !prompt.trim(),
            loading: isGenerating,
          }}
          secondary={[
            { text: "Advanced", variant: "chip", disabled: isGenerating },
          ]}
          containerClassName="mt-6"
        />

        {generatedVideo && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✓ Video generated successfully! Check the preview on the right.
          </div>
        )}
      </div>

      <div>
        {generatedVideo ? (
          <div className="card p-5">
            <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
            <video
              src={generatedVideo.url}
              poster={generatedVideo.thumbnailUrl}
              controls
              className="w-full rounded-lg mb-4"
              style={{
                aspectRatio:
                  generatedVideo.aspectRatio === "9:16"
                    ? "9/16"
                    : generatedVideo.aspectRatio === "1:1"
                    ? "1/1"
                    : "16/9",
              }}
            />
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Prompt:</strong> {generatedVideo.prompt}
              </p>
              <p>
                <strong>Duration:</strong> {generatedVideo.duration}s
              </p>
              <p>
                <strong>Aspect Ratio:</strong> {generatedVideo.aspectRatio}
              </p>
              {generatedVideo.styles.length > 0 && (
                <p>
                  <strong>Styles:</strong> {generatedVideo.styles.join(", ")}
                </p>
              )}
            </div>
          </div>
        ) : (
          <VideoCard id="preview" title="Preview" variant="preview" />
        )}
      </div>
    </div>
  );
}
