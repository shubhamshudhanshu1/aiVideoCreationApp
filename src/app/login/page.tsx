import ActionButtons from "@/components/ActionButtons";
import { Apple, Phone, Mail, Github } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6">Login to AI Video</h1>
        <ActionButtons
          primary={{
            text: "Use my phone number",
            icon: <Phone size={16} />,
            iconPosition: "left",
            href: "/login/otp",
            variant: "btn",
            size: "lg",
            width: "full",
            textAlign: "center",
            className: "!justify-center",
          }}
          containerClassName="mb-6"
        />
        <div className="my-6 grid grid-cols-3 items-center text-mute text-xs gap-2">
          <hr />
          <span className="text-center">or</span>
          <hr />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button className="p-4 flex items-center justify-center hover:bg-black/5 transition-colors rounded-lg border border-gray-200">
            <Apple size={20} className="text-gray-700" />
          </button>
          <button className="p-4 flex items-center justify-center hover:bg-black/5 transition-colors rounded-lg border border-gray-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-blue-600"
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
          <button className="p-4 flex items-center justify-center hover:bg-black/5 transition-colors rounded-lg border border-gray-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-blue-500"
            >
              <path
                fill="currentColor"
                d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
              />
            </svg>
          </button>
          <button className="p-4 flex items-center justify-center hover:bg-black/5 transition-colors rounded-lg border border-gray-200">
            <Github size={20} className="text-gray-800" />
          </button>
        </div>
        <p className="text-xs text-mute mt-6">
          By creating an account, you agree to the Terms of Service and
          acknowledge the Privacy Policy.
        </p>
      </div>
    </div>
  );
}
