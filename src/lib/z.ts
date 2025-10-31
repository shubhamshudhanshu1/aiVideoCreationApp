import { z } from "zod";

export const CreateProject = z.object({
  prompt: z.string().min(5).max(600),
  styles: z.array(z.string()).max(5).default([]),
  exclude_styles: z.array(z.string()).max(5).default([]),
  duration_s: z.number().int().min(10).max(60),
  aspect_ratio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  voiceover_off: z.boolean().default(true),
  model_version: z.string().default("v4.5-all"),
  seed: z.number().int().optional(),
});

export const PatchProject = z.object({
  title: z.string().max(120).optional(),
  allow_remix: z.boolean().optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
});

export const CommentBody = z.object({
  text: z.string().min(1).max(400),
});

export const LikeBody = z.object({
  type: z.enum(["like", "dislike"]),
});

export const EmailStart = z.object({
  email: z.string().email(),
});

export const EmailVerify = z.object({
  otp_id: z.string(),
  code: z.string().length(6),
  handle: z.string().min(3).max(30).optional(),
});

export const PhoneStart = z.object({
  phone: z.string(),
  country: z.string().optional(),
});

export const PhoneVerify = z.object({
  otp_id: z.string(),
  code: z.string().length(6),
  handle: z.string().min(3).max(30).optional(),
});
