"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      alert(data.message || "Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <div className="relative w-[575px] bg-[#10152A] rounded-2xl px-[52px] pt-12 pb-10 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center gap-1.5 mb-8 mt-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="text-[#E8E4DA] text-xl font-bold">
              Event
              <span className="text-[#4A7AFF]">
                Booking
              </span>
              System
            </span>
          </Link>

          <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">Login</h1>

          <p className="text-[#E8E4DA]/40 text-[13px] font-light">
            Sign in to your EBS account
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
            Email address
          </label>
          <div className="relative">
            <svg
              className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
            Password
          </label>
          <div className="relative">
            <svg
              className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mb-2 h-[30px]">
          <button className="text-[#4A7AFF] text-xs hover:underline transition-all">
            Forgot password?
          </button>
        </div>

        <div className="mb-6">
          <button
            className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            <span className="text-white text-[15px] font-medium tracking-[0.20px]">
              {loading ? "Logging in..." : "Log in"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-[0.5px] bg-white/10" />
          <span className="text-[#E8E4DA]/30 text-xs">or continue with</span>
          <div className="flex-1 h-[0.5px] bg-white/10" />
        </div>

        <div className="flex gap-3 mb-7">
          <button className="flex-1 h-11 bg-white/4 rounded-[10px] border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-[#E8E4DA]/70 text-[13px] font-medium">
              Google
            </span>
          </button>

          <button className="flex-1 h-11 bg-white/4 rounded-[10px] border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <div className="w-[18px] h-[18px] bg-[#1877F2] rounded flex items-center justify-center">
              <span className="text-white text-[13px] font-bold leading-[13px]">
                f
              </span>
            </div>
            <span className="text-[#E8E4DA]/70 text-[13px] font-medium">
              Facebook
            </span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-[#E8E4DA]/35 text-[13px]">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/auth/signup"
            className="text-[#4A7AFF] text-[13px] font-medium hover:underline transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
