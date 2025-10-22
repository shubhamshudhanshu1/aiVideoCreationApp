import FormField from "@/components/FormField";
import ActionButtons from "@/components/ActionButtons";
import { CheckCircle, Phone } from "lucide-react";

export default function OTP() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Your Phone Number</h2>
        <div className="flex gap-2">
          <div className="w-32">
            <FormField
              label=""
              type="select"
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
            containerClassName="flex-1"
          />
        </div>
        <ActionButtons
          primary={{
            text: "Confirm",
            icon: <CheckCircle size={20} />,
            iconPosition: "left",
            variant: "btn",
            size: "lg",
            width: "full", // Full width button
            borderStyle: "solid",
            borderWidth: "2",
            borderColor: "blue-500",
            textAlign: "center", // Center-aligned text
            className: "!justify-center", // Force center alignment
          }}
          containerClassName="mt-6"
          align="center"
        />
      </div>
    </div>
  );
}
