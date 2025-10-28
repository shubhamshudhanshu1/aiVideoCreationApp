"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import ActionButtons from "@/components/ActionButtons";
import { CheckCircle, Phone, Mail, ArrowLeft } from "lucide-react";

export default function OTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") || "phone";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const isPhoneMethod = method === "phone";

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
          {isPhoneMethod ? "Your Phone Number" : "Your Email Address"}
        </h2>

        {isPhoneMethod ? (
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
        )}
        <ActionButtons
          primary={{
            text: "Confirm",
            icon: isPhoneMethod ? <Phone size={20} /> : <Mail size={20} />,
            iconPosition: "left",
            variant: "btn",
            size: "lg",
            width: "full", // Full width button
            borderStyle: "solid",
            borderWidth: "2",
            borderColor: "blue-500",
            textAlign: "center", // Center-aligned text
            className: "!justify-center", // Force center alignment
            onClick: () => {
              // Handle form submission based on method
              if (isPhoneMethod) {
                console.log("Phone login:", countryCode + phoneNumber);
                // Add phone login logic here
              } else {
                console.log("Email login:", email);
                // Add email login logic here
              }
            },
          }}
          containerClassName="mt-6"
          align="center"
        />
      </div>
    </div>
  );
}
