"use client";
import { useState, useRef, useCallback } from "react";
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

interface ConsoleEntry {
  time: string;
  message: string;
  type: "info" | "success" | "error";
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
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const log = useCallback((message: string, type: ConsoleEntry["type"] = "info") => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setConsoleLogs((prev) => {
      const next = [...prev, { time, message, type }];
      return next.slice(-50); // keep last 50 entries
    });
    setTimeout(() => consoleEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

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
    log("Starting video generation...");
    log(`Prompt: "${prompt.trim()}"`);
    log(`Settings → duration: ${duration}s | ratio: ${aspectRatio} | styles: ${styles.length ? styles.join(", ") : "none"}`);

    try {
      log("Sending request to /api/video/generate");
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

      log(`Server responded with status ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      if (data.success && data.video) {
        log("Video generated successfully.", "success");
        setGeneratedVideo(data.video);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      log(`Error: ${err.message}`, "error");
      setError(err.message || "Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
      log("Done.");
    }
  };

  const logColor = (type: ConsoleEntry["type"]) => {
    if (type === "success") return "text-green-400";
    if (type === "error") return "text-red-400";
    return "text-gray-300";
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

      {/* Console panel — spans full width */}
      <div className="sm:col-span-2">
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-[#1a1a1e]">
          {/* title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#111114] border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-500 font-mono">console</span>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              clear
            </button>
          </div>
          {/* log output */}
          <div className="h-36 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
            {consoleLogs.length === 0 ? (
              <span className="text-gray-600">
                Waiting for activity... Press &quot;Generate&quot; to start.
              </span>
            ) : (
              consoleLogs.map((entry, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-600 shrink-0">{entry.time}</span>
                  <span className={logColor(entry.type)}>{entry.message}</span>
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
