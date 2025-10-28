"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import ActionButtons from "@/components/ActionButtons";
import { CheckCircle, Phone, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { startOtp, verifyOtp, User } from "@/lib/auth-client";

export default function OTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") || "phone";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otpCode, setOtpCode] = useState("");
  const [otpId, setOtpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mockCode, setMockCode] = useState<string | null>(null);

  const isPhoneMethod = method === "phone";
  const isOtpSent = otpId !== null;

  const handleStartOtp = async () => {
    if (isPhoneMethod) {
      // For phone, we'll just simulate for now since we don't have SMS integration
      setError("Phone OTP not implemented yet. Please use email.");
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await startOtp(email);
      if (response.error) {
        setError(response.error);
      } else {
        setOtpId(response.otp_id);
        setMockCode(response.mockCode || null);
        setSuccess(true);
        setError("");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpId || !otpCode) {
      setError("Please enter the OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOtp(otpId, otpCode);
      if (response.error) {
        setError(response.error);
      } else {
        // Successfully logged in, redirect to home or dashboard
        router.push("/");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isOtpSent
            ? "Enter Verification Code"
            : isPhoneMethod
            ? "Your Phone Number"
            : "Your Email Address"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && !isOtpSent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            OTP sent successfully! Check your email.
          </div>
        )}

        {!isOtpSent ? (
          isPhoneMethod ? (
            <div className="flex gap-2">
              <div className="w-32">
                <FormField
                  label=""
                  type="select"
                  value={countryCode}
                  onChange={setCountryCode}
                  options={[
                    { value: "+91", label: "🇮🇳 +91" },
                    { value: "+1", label: "🇺🇸 +1" },
                  ]}
                />
              </div>

              <FormField
                label=""
                type="text"
                placeholder="Input Phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                containerClassName="flex-1"
              />
            </div>
          ) : (
            <FormField
              label=""
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={setEmail}
            />
          )
        ) : (
          <div className="space-y-4">
            <FormField
              label=""
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={setOtpCode}
              maxLength={6}
            />
            {mockCode && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <strong>Development Mode:</strong> Your code is {mockCode}
              </div>
            )}
          </div>
        )}
        <ActionButtons
          primary={{
            text: isLoading
              ? "Processing..."
              : isOtpSent
              ? "Verify Code"
              : isPhoneMethod
              ? "Send SMS"
              : "Send Code",
            icon: isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isOtpSent ? (
              <CheckCircle size={20} />
            ) : isPhoneMethod ? (
              <Phone size={20} />
            ) : (
              <Mail size={20} />
            ),
            iconPosition: "left",
            variant: "btn",
            size: "lg",
            width: "full", // Full width button
            borderStyle: "solid",
            borderWidth: "2",
            borderColor: "blue-500",
            textAlign: "center", // Center-aligned text
            className: "!justify-center", // Force center alignment
            onClick: isOtpSent ? handleVerifyOtp : handleStartOtp,
            disabled: isLoading,
          }}
          containerClassName="mt-6"
          align="center"
        />

        {isOtpSent && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setOtpId(null);
                setOtpCode("");
                setSuccess(false);
                setError("");
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
