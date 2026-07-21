"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, forgotPassword, resetPassword } from "@/services/authService";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotStep, setForgotStep] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(600);
  const [otpExpired, setOtpExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { showToast } = useToast();

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      showToast(data.message || "Login successful!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    setError("");
    setLoading(true);

    try {
      await forgotPassword(forgotEmail);
      setOtpTimer(600);
      setOtpExpired(false);
      setForgotStep("otp");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setLoading(true);

    try {
      await forgotPassword(forgotEmail);
      setOtpTimer(600);
      setOtpExpired(false);
      setOtp("");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setLoading(true);

    try {
      const data = await resetPassword(forgotEmail, otp, newPassword);
      setForgotStep("success");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (forgotStep !== "otp" || otpExpired) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [forgotStep, otpExpired]);

  function closeForgot() {
    if (timerRef.current) clearInterval(timerRef.current);
    setForgotStep(null);
    setError("");
    setOtp("");
    setNewPassword("");
    setForgotEmail("");
    setOtpTimer(600);
    setOtpExpired(false);
  }

  const renderForgotFlow = () => {
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
                <span className="text-[#4A7AFF]">Booking</span>
                System
              </span>
            </Link>

            {forgotStep === "email" && (
              <>
                <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">Forgot Password</h1>
                <p className="text-[#E8E4DA]/40 text-[13px] font-light">
                  Enter your email to receive a reset OTP
                </p>
              </>
            )}

            {forgotStep === "otp" && (
              <>
                <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">Reset Password</h1>
                <p className="text-[#E8E4DA]/40 text-[13px] font-light">
                  Enter the OTP sent to {forgotEmail}
                </p>
              </>
            )}

            {forgotStep === "success" && (
              <>
                <h1 className="text-[#E8E4DA] text-[28px] font-bold mt-4">Password Reset</h1>
                <p className="text-[#E8E4DA]/40 text-[13px] font-light">
                  Your password has been updated successfully
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {forgotStep === "email" && (
            <>
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
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
                  />
                </div>
              </div>

              <button
                className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendOtp}
                disabled={loading}
              >
                <span className="text-white text-[15px] font-medium tracking-[0.20px]">
                  {loading ? "Sending..." : "Send OTP"}
                </span>
              </button>

              <button
                className="w-full mt-3 text-[#E8E4DA]/50 text-xs hover:text-[#E8E4DA] transition-all"
                onClick={closeForgot}
              >
                Back to Login
              </button>
            </>
          )}

          {forgotStep === "otp" && (
            <>
              <div className="flex flex-col items-center gap-1.5 mb-5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#E8E4DA]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-xs ${otpExpired ? "text-red-400" : "text-[#E8E4DA]/40"}`}>
                    {otpExpired
                      ? "OTP expired"
                      : `Code expires in ${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, "0")}`}
                  </span>
                </div>
                <button
                  className="text-xs text-[#4A7AFF] hover:underline transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  {loading ? "Resending..." : "Didn&apos;t receive the email? Resend"}
                </button>
              </div>

              <div className="mb-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[#E8E4DA]/55 text-xs font-medium tracking-[0.40px] mb-[7px]">
                  New Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
                  />
                </div>
              </div>

              {otpExpired ? (
                <button
                  className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  <span className="text-white text-[15px] font-medium tracking-[0.20px]">
                    {loading ? "Sending..." : "Resend OTP"}
                  </span>
                </button>
              ) : (
                <button
                  className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResetPassword}
                  disabled={loading || otp.length < 6 || newPassword.length < 6}
                >
                  <span className="text-white text-[15px] font-medium tracking-[0.20px]">
                    {loading ? "Resetting..." : "Reset Password"}
                  </span>
                </button>
              )}

              <button
                className="w-full mt-3 text-[#E8E4DA]/50 text-xs hover:text-[#E8E4DA] transition-all"
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setForgotStep("email");
                  setError("");
                }}
              >
                Back
              </button>
            </>
          )}

          {forgotStep === "success" && (
            <>
              <div className="flex flex-col items-center gap-4 my-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-[#E8E4DA]/60 text-sm text-center">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
              </div>

              <button
                className="w-full h-12 bg-[#4A7AFF] rounded-[11px] flex items-center justify-center hover:bg-[#3A6AEF] active:bg-[#2A5ADF] transition-all duration-200"
                onClick={closeForgot}
              >
                <span className="text-white text-[15px] font-medium tracking-[0.20px]">
                  Back to Login
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (forgotStep) {
    return renderForgotFlow();
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
              <span className="text-[#4A7AFF]">Booking</span>
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
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
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
              className="w-full h-[46px] bg-white/5 rounded-[10px] border border-white/12 pl-[42px] pr-[14px] text-sm text-[#E8E4DA] placeholder:text-[#E8E4DA]/25 focus:outline-none focus:border-[#4A7AFF]/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mb-2 h-[30px]">
          <button
            className="text-[#4A7AFF] text-xs hover:underline transition-all"
            onClick={() => {
              setForgotStep("email");
              setForgotEmail(email || "");
              setError("");
            }}
          >
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
