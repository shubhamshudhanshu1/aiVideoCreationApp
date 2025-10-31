# API Documentation

Complete API surface for the AI Video Creation App. All endpoints return JSON.

## Auth & Session

### POST /api/auth/email/start
Start email OTP flow.
- **Body**: `{ email: string }`
- **Response**: `{ otp_id: string, ttl: number, mockCode?: string }`
- **Status**: 200

### POST /api/auth/email/verify
Verify email OTP and create session.
- **Body**: `{ otp_id: string, code: string, handle?: string }`
- **Response**: `{ user: { id, email, handle, displayName } }`
- **Status**: 200
- **Sets cookie**: `sid` (httpOnly, secure in production)

### POST /api/auth/phone/start
Start phone OTP flow.
- **Body**: `{ phone: string, country?: string }`
- **Response**: `{ otp_id: string, ttl: number, mockCode?: string }`
- **Status**: 200

### POST /api/auth/phone/verify
Verify phone OTP and create session.
- **Body**: `{ otp_id: string, code: string, handle?: string }`
- **Response**: `{ user: { id, handle, displayName } }`
- **Status**: 200
- **Sets cookie**: `sid` (httpOnly, secure in production)

### POST /api/auth/logout
Logout and clear session.
- **Response**: `{ ok: true }`
- **Status**: 200
- **Clears cookie**: `sid`

### GET /api/me
Get current authenticated user.
- **Response**: `{ user: { id, email, handle, displayName, avatarUrl, marketingOptIn } | null }`
- **Status**: 200

### PATCH /api/me
Update current user profile.
- **Body**: `{ displayName?: string, handle?: string, avatarUrl?: string | null, marketingOptIn?: boolean }`
- **Response**: `{ user: { id, email, handle, displayName, avatarUrl, marketingOptIn } }`
- **Status**: 200
- **Auth**: Required

## Users & Profiles

### GET /api/users/[handle]
Get user profile and public projects.
- **Response**: `{ user: {...}, projects: [...] }`
- **Status**: 200

### POST /api/users/[handle]/follow
Follow a user.
- **Response**: `{ following: true }`
- **Status**: 200
- **Auth**: Required

### DELETE /api/users/[handle]/follow
Unfollow a user.
- **Response**: `{ following: false }`
- **Status**: 200
- **Auth**: Required

## Projects (Video Generation)

### POST /api/projects
Create a new video project.
- **Body**: `{ prompt: string, styles: string[], exclude_styles: string[], duration_s: number, aspect_ratio: "9:16"|"1:1"|"16:9", voiceover_off: boolean, model_version: string, seed?: number }`
- **Response**: `{ project_id: string, job_id: string }`
- **Status**: 200
- **Auth**: Required
- **Debits**: 1 credit

### GET /api/projects
List current user's projects.
- **Response**: `{ projects: [...] }`
- **Status**: 200
- **Auth**: Required

### GET /api/projects/[id]
Get project by ID.
- **Response**: Full project object with user info
- **Status**: 200

### PATCH /api/projects/[id]
Update project metadata.
- **Body**: `{ title?: string, allow_remix?: boolean, visibility?: "public"|"unlisted"|"private" }`
- **Response**: Updated project object
- **Status**: 200
- **Auth**: Required (owner)

### POST /api/projects/[id]/publish
Publish a project (make it public).
- **Response**: `{ ok: true }`
- **Status**: 200
- **Auth**: Required (owner)

### POST /api/projects/[id]/regenerate
Regenerate video for a project.
- **Response**: `{ job_id: string }`
- **Status**: 200
- **Auth**: Required (owner)

### POST /api/projects/[id]/remix
Create a remix of a project.
- **Response**: `{ project_id: string }`
- **Status**: 200
- **Auth**: Required
- **Debits**: 1 credit
- **Requires**: Original project `allowRemix: true`

## Social Features

### POST /api/projects/[id]/like
Like or dislike a project.
- **Body**: `{ type: "like" | "dislike" }`
- **Response**: `{ likes: number, dislikes: number }`
- **Status**: 200
- **Auth**: Required

### POST /api/projects/[id]/comment
Add a comment to a project.
- **Body**: `{ text: string }` (max 400 chars)
- **Response**: `{ count: number }`
- **Status**: 200
- **Auth**: Required

## Feed, Library, Search

### GET /api/feed/explore
Explore feed with cursor pagination.
- **Query**: `?cursor=project_id`
- **Response**: `{ items: [{ id, title, coverUrl, likes, comments, plays, mp4Url?, hlsUrl? }], nextCursor?: string }`
- **Status**: 200

### GET /api/library
Get current user's library (all projects).
- **Response**: `{ items: [project, ...] }`
- **Status**: 200
- **Auth**: Required

## Playlists & Templates

### POST /api/playlists
Create a playlist.
- **Body**: `{ name: string, isPublic: boolean }`
- **Response**: `{ playlist: { id, name, isPublic, ... } }`
- **Status**: 200
- **Auth**: Required

### POST /api/playlists/[id]/items
Add project to playlist.
- **Body**: `{ project_id: string }`
- **Response**: `{ success: true }`
- **Status**: 200
- **Auth**: Required (playlist owner)

### GET /api/templates
Get official templates.
- **Response**: `{ items: [{ id, name, tags, creator, createdAt }] }`
- **Status**: 200

## Credits & Billing

### GET /api/credits/balance
Get current user's credit balance.
- **Response**: `{ balance: number }`
- **Status**: 200
- **Auth**: Required
- **Default**: 40 credits for new users

## Jobs (Render Status)

### GET /api/jobs/[id]/events
Server-Sent Events stream for job progress.
- **Response**: Stream of `{ id, projectId, state, progress }` events
- **Content-Type**: `text/event-stream`
- **Closes when**: `state` is `done` or `failed`

## Media (S3)

### POST /api/videos/upload-url
Get presigned URL for uploading draft video.
- **Body**: `{ contentType: string }`
- **Response**: `{ key: string, url: string, projectId: string }`
- **Status**: 200
- **Auth**: Required
- **Expires**: 5 minutes

### POST /api/videos/draft-url
Get presigned URL for viewing draft video.
- **Body**: `{ key: string }`
- **Response**: `{ url: string }`
- **Status**: 200
- **Auth**: Required (must own the draft)
- **Expires**: 1 hour

### POST /api/videos/publish
Publish video from draft to public storage.
- **Body**: `{ projectId: string, draftKey: string }`
- **Response**: `{ key: string, publicUrl: string }`
- **Status**: 200
- **Auth**: Required (project owner)

## Moderation (v1.1)

### POST /api/mod/flag
Flag a project for moderation.
- **Body**: `{ project_id: string, reason: string }`
- **Response**: `{ ok: true }`
- **Status**: 200
- **Auth**: Required

### GET /api/mod/queue
Get moderation queue (admin only).
- **Response**: `{ items: [...] }`
- **Status**: 200
- **Auth**: Required (admin)

### POST /api/mod/decision
Make moderation decision (admin only).
- **Body**: `{ project_id: string, action: "approve" | "reject" }`
- **Response**: `{ ok: true }`
- **Status**: 200
- **Auth**: Required (admin)

## Admin/Ops (v1.1)

### GET /api/admin/metrics
Get admin metrics.
- **Response**: `{ users: number, projects: number, publicProjects: number, totalCreditsIssued: number }`
- **Status**: 200
- **Auth**: Required (admin)

### POST /api/admin/reindex
Trigger search index reindex.
- **Response**: `{ ok: true }`
- **Status**: 200
- **Auth**: Required (admin)

## Error Responses

All endpoints return errors in this format:
```json
{ "error": "Error message" }
```

Status codes:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not found
- `409` - Conflict (e.g., handle taken)
- `500` - Internal server error

## Authentication

Most endpoints require authentication via session cookie `sid`. Cookie is set on successful OTP verification.

## Credit System

- New users start with 40 credits
- Creating a project costs 1 credit
- Remixing a project costs 1 credit
- Balance checked before deduction
- Returns 402 if insufficient credits

