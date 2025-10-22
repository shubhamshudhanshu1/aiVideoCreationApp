import FormField from "@/components/FormField";
import ActionButtons from "@/components/ActionButtons";

export default function OTP() {
  return (
    <div className="max-w-md mx-auto card p-6">
      <h2 className="text-xl font-semibold mb-4">Your Phone Number</h2>
      <div className="flex gap-2">
        <FormField
          label=""
          type="select"
          options={[
            { value: "+91", label: "🇮🇳 +91" },
            { value: "+1", label: "🇺🇸 +1" },
          ]}
          className="max-w-[110px]"
        />
        <FormField
          label=""
          type="text"
          placeholder="+91 74835 15071"
          className="flex-1"
        />
      </div>
      <ActionButtons
        primary={{ text: "Confirm", variant: "btn" }}
        className="w-full justify-center mt-6"
      />
    </div>
  );
}
