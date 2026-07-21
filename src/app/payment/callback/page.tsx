"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { verifyEsewaPayment } from "@/services/esewaService";

export default function PaymentCallbackWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0E1A]">
        <AuthenticatedNavbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Processing payment...</p>
        </div>
      </div>
    }>
      <PaymentCallback />
    </Suspense>
  );
}

function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const encodedData = searchParams.get("data");

    if (!encodedData) {
      setStatus("error");
      setMessage("No payment data received from eSewa.");
      return;
    }

    // Decode the data to extract transaction_uuid, then find the booking
    let decoded: any;
    try {
      const urlDecoded = decodeURIComponent(encodedData);
      const base64 = urlDecoded.replace(/ /g, "+");
      const jsonStr = atob(base64);
      decoded = JSON.parse(jsonStr);
    } catch {
      setStatus("error");
      setMessage("Failed to decode payment response.");
      return;
    }

    // Call verification with just the encoded data — backend will look up booking by transactionUuid
    verifyEsewaPayment("", encodedData)
      .then((res) => {
        if (res.status === "paid") {
          setStatus("success");
          setMessage("Payment successful! Booking confirmed.");
          setTimeout(() => router.push(`/events/${res.booking?.event || ""}`), 2000);
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      })
      .catch((err: any) => {
        const serverMsg = err.response?.data?.message || "Failed to verify payment.";
        setStatus("error");
        setMessage(serverMsg);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] p-8 text-center">
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <svg className="w-10 h-10 animate-spin text-[#4A7AFF]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-[#E8E4DA] text-sm font-[DM_Sans]">{message}</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#E8E4DA] text-base font-[DM_Sans] font-medium">{message}</p>
              <p className="text-[rgba(232,228,218,0.30)] text-xs font-[DM_Sans]">Redirecting to event page...</p>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#E8E4DA] text-sm font-[DM_Sans]">{message}</p>
              <button
                onClick={() => router.push("/events")}
                className="mt-2 px-6 py-2.5 bg-[#4A7AFF] rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
