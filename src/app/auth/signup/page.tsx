"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, verifyOtp } from "@/services/authService";
import { useToast } from "@/components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: "",
    color: "bg-gray-600",
  });
  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSignup() {
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const data = await registerUser(fullName, email, password);

      // Dev mode — auto-verified, redirect straight to dashboard
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
        return;
      }

      setShowOtp(true);
      showToast(data.message || "OTP sent to your email. Please verify.", "success");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setOtpLoading(true);

    try {
      const data = await verifyOtp(email, otp);
      showToast(data.message || "Email verified successfully!", "success");
      router.push("/auth/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "OTP verification failed.";
      setError(message);
    } finally {
      setOtpLoading(false);
    }
  }

  if (showOtp) {
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

            <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">
              Verify Email
            </h1>

            <p className="text-[#E8E4DA]/40 text-[13px] font-light">
              Enter the OTP sent to {email}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
              OTP Code
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
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all tracking-[8px] text-center text-lg font-bold"
              />
            </div>
          </div>

          <div className="mb-6">
            <button
              className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.length !== 6}
            >
              <span className="text-white text-[15px] font-medium tracking-[0.20px]">
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
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
              Event              <span className="text-[#4A7AFF]">
                  Booking
              </span>
              System
            </span>
          </Link>

          <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">
            Create Account
          </h1>

          <p className="text-[#E8E4DA]/40 text-[13px] font-light">
            Join EBS and discover amazing experiences
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
              First name
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
              Last name
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
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

        <div className="mb-5">
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
              onChange={(e) => {
                setPassword(e.target.value);
                const pwd = e.target.value;
                let score = 0;
                if (pwd.length >= 8) score += 20;
                if (pwd.length >= 12) score += 20;
                if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
                if (/[0-9]/.test(pwd)) score += 20;
                if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
                const strengthMap: Record<string, { label: string; color: string }> = {
                  "0": { label: "", color: "bg-gray-600" },
                  "20": { label: "Weak", color: "bg-red-500" },
                  "40": { label: "Fair", color: "bg-orange-500" },
                  "60": { label: "Good", color: "bg-yellow-500" },
                  "80": { label: "Strong", color: "bg-lime-500" },
                  "100": { label: "Very strong", color: "bg-green-500" },
                };
                const key = String(Math.min(100, Math.ceil(score / 20) * 20));
                setPasswordStrength({ score, ...strengthMap[key] });
              }}
              placeholder="Create a strong password"
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
            />
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              {passwordStrength.label && (
                <span className="text-[10px] font-medium text-gray-400 shrink-0">
                  {passwordStrength.label}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
            Confirm password
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
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA]/25 placeholder:text-[#E8E4DA]/25 focus:text-[#E8E4DA] focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSignup}
            disabled={loading}
          >
            <span className="text-white text-[15px] font-medium tracking-[0.20px]">
              {loading ? "Creating account..." : "Create Account"}
            </span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-[#E8E4DA]/35 text-[13px]">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/login"
            className="text-[#4A7AFF] text-[13px] font-medium hover:underline transition-all"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
