"use client";
import { useState } from "react";
import FormField from "@/components/FormField";
import VideoCard from "@/components/VideoCard";
import ActionButtons from "@/components/ActionButtons";

const preset = ["cinematic", "vlog", "anime", "3D", "fast-cut", "mellow"];

export default function Create() {
  const [styles, setStyles] = useState<string[]>([]);
  const toggle = (s: string) =>
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );

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
          placeholder="Describe your video..."
          rows={4}
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
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <FormField label="Duration" type="number" min={10} max={60} />
          <FormField
            label="Aspect Ratio"
            type="select"
            options={[
              { value: "9:16", label: "9:16" },
              { value: "1:1", label: "1:1" },
              { value: "16:9", label: "16:9" },
            ]}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="voice"
            type="checkbox"
            className="scale-110"
            defaultChecked
          />
          <label htmlFor="voice" className="text-sm">
            No voiceover
          </label>
        </div>

        <ActionButtons
          primary={{ text: "Generate", variant: "btn" }}
          secondary={[{ text: "Advanced", variant: "chip" }]}
          className="mt-6"
        />
      </div>

      <VideoCard id="preview" title="Preview" variant="preview" />
    </div>
  );
}
