import Link from "next/link";
import ActionButtons from "@/components/ActionButtons";

export default function Login() {
  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-4">Login to AI Video</h1>
      <Link href="/login/otp" className="btn w-full justify-center">
        Use my phone number
      </Link>
      <div className="my-6 grid grid-cols-3 items-center text-mute text-xs gap-2">
        <hr />
        <span className="text-center">or</span>
        <hr />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button className="card p-4">🍎</button>
        <button className="card p-4">G</button>
        <button className="card p-4">MS</button>
        <button className="card p-4">Ｄ</button>
      </div>
      <p className="text-xs text-mute mt-6">
        By creating an account, you agree to the Terms of Service and
        acknowledge the Privacy Policy.
      </p>
    </div>
  );
}
