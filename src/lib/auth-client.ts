// Client-side authentication utilities

export interface User {
  id: string;
  email: string;
  emailVerified: string | null;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  marketingOptIn: boolean;
}

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export interface OtpStartResponse {
  otp_id: string;
  mockCode?: string;
  ttl: number;
  error?: string;
}

export interface OtpVerifyResponse {
  user: User;
  error?: string;
}

// Start OTP process
export async function startOtp(email: string): Promise<OtpStartResponse> {
  const response = await fetch("/api/auth/email/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return response.json();
}

// Verify OTP code
export async function verifyOtp(
  otpId: string,
  code: string,
  handle?: string
): Promise<OtpVerifyResponse> {
  const response = await fetch("/api/auth/email/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp_id: otpId, code, handle }),
  });

  return response.json();
}

// Get current user
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await fetch("/api/me", {
    cache: "no-store",
  });

  return response.json();
}

// Logout
export async function logout(): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  return response.json();
}
