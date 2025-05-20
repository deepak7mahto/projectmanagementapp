import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "~/context/UserContext";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccess("Login successful!");
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { displayName } },
        });
        if (error) throw error;
        setSuccess("Signup successful! Check your email for verification.");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-fade-in w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl transition-all duration-300">
        {/* App Name */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 rounded-full bg-blue-600 p-3 shadow">
            <span className="text-2xl font-extrabold text-white">PM</span>
          </div>
          <h1 className="text-center text-2xl font-bold tracking-wide text-gray-800">
            {mode === "login" ? "Login to PM" : "Sign Up for PM"}
          </h1>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          {mode === "signup" && (
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2 transition focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2 pr-10 transition focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>
        </form>
        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        {/* Mode Switch */}
        <div className="flex justify-center gap-4 text-sm">
          <button
            onClick={() => setMode("login")}
            className={`font-semibold transition ${
              mode === "login"
                ? "text-blue-600 underline"
                : "text-gray-500 hover:text-blue-600"
            }`}
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`font-semibold transition ${
              mode === "signup"
                ? "text-blue-600 underline"
                : "text-gray-500 hover:text-blue-600"
            }`}
            type="button"
          >
            Sign Up
          </button>
        </div>
        {/* Error/Success */}
        {error && (
          <div className="animate-fade-in mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700 shadow-inner">
            {error}
          </div>
        )}
        {success && (
          <div className="animate-fade-in mt-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700 shadow-inner">
            {success}
          </div>
        )}
      </div>
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
