"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import BookingModal from "@/components/BookingModal";
import { isAuthenticated } from "@/services/authService";
import { getEventById } from "@/services/eventService";
import { initiateEsewaPayment, submitToEsewa } from "@/services/esewaService";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingState, setBookingState] = useState<
    "idle" | "processing" | "redirecting" | "error"
  >("idle");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setCheckedAuth(true);

    const fetchEvent = async () => {
      try {
        const data = await getEventById(params.id as string);
        const e = data.event;
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const d = new Date(e.date);
        const dateStr = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

        const timeParts = (e.time || "").split(":");
        let timeStr = e.time || "";
        if (timeParts.length >= 2) {
          const h = parseInt(timeParts[0], 10);
          const ampm = h >= 12 ? "PM" : "AM";
          const hour12 = h % 12 || 12;
          timeStr = `${hour12}:${timeParts[1]} ${ampm}`;
        }

        const organizer =
          e.createdBy?.organizerName || e.createdBy?.name || "Organizer";
        const image = e.image
          ? `${API_BASE}${e.image}`
          : "/img/nepaltourism2024.jpg";

        setEvent({
          title: e.title,
          description: e.description,
          category: e.category,
          date: dateStr,
          time: timeStr,
          location: e.location,
          price: e.price,
          totalSeats: e.totalSeats,
          availableSeats: e.availableSeats,
          image,
          organizer,
        });
        setLoading(false);
      } catch {
        router.push("/events");
      }
    };
    fetchEvent();
  }, [params.id, router]);

  const handleBookNow = useCallback(() => {
    setBookingOpen(true);
    setBookingState("idle");
    setBookingMessage("");
  }, []);

  const handleBookingConfirm = useCallback(
    async (qty: number) => {
      setBookingOpen(false);
      setBookingState("processing");
      setBookingMessage("Initiating payment with eSewa...");

      try {
        const res = await initiateEsewaPayment(params.id as string, qty);
        setBookingState("redirecting");
        setBookingMessage("Redirecting to eSewa...");

        // Short delay so the user sees the message before redirect
        setTimeout(() => {
          submitToEsewa(res.gatewayUrl, res.formData);
        }, 800);
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          "Failed to initiate payment. Please try again.";
        setBookingState("error");
        setBookingMessage(msg);
      }
    },
    [params.id],
  );

  if (!checkedAuth) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A]">
        <AuthenticatedNavbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />

      <div className="relative w-full h-[300px] md:h-[422px] overflow-hidden">
        {/* Back button */}
        <button
          onClick={() => router.push("/events")}
          className="absolute top-6 left-6 z-20 w-9 h-9 rounded-lg bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center hover:bg-[rgba(0,0,0,0.7)] transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 bg-[#0A0E1A]/80" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-20 relative z-10">
        {/* Booking status banner */}
        {(bookingState === "processing" ||
          bookingState === "redirecting" ||
          bookingState === "error") && (
          <div
            className={`mb-6 px-5 py-4 rounded-xl border text-sm flex items-center gap-3 ${
              bookingState === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : bookingState === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}
          >
            {(bookingState === "processing" ||
              bookingState === "redirecting") && (
              <svg
                className="w-4 h-4 animate-spin shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {bookingState === "error" && (
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="font-[DM_Sans]">{bookingMessage}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[#E8E4DA] text-3xl md:text-5xl font-['Playfair_Display'] font-semibold">
              {event.title}
            </h1>
            <p className="text-[rgba(232,228,218,0.30)] text-xs mt-2">
              Event Organized by {event.organizer}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#3BA67C] text-2xl font-[DM_Sans] font-semibold">
              Rs. {event.price}
            </span>
            <button
              onClick={handleBookNow}
              disabled={
                bookingState === "processing" ||
                bookingState === "redirecting"
              }
              className="px-6 py-3 bg-[#3BA67C] rounded-lg hover:bg-[#2d8e68] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white text-sm font-medium">
                {bookingState === "processing" ||
                bookingState === "redirecting"
                  ? "Processing..."
                  : "Book Now"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
          <span className="text-[rgba(232,228,218,0.50)] text-base md:text-lg">{event.date}</span>
          <span className="text-[rgba(232,228,218,0.50)] text-base md:text-lg">{event.time}</span>
          <span className="text-[rgba(232,228,218,0.50)] text-base md:text-lg">{event.location}</span>
        </div>

        <div className="mb-8">
          <span className="px-3 py-1 bg-[rgba(74,122,255,0.10)] rounded-full text-[#7AAAFF] text-xs">
            {event.category}
          </span>
          <span className="ml-3 text-[rgba(232,228,218,0.25)] text-xs">
            {event.availableSeats} / {event.totalSeats} seats available
          </span>
        </div>

        <div className="mb-16 max-w-[1000px]">
          <h2 className="text-[#E8E4DA] text-xl font-['Playfair_Display'] font-semibold mb-4">
            Description
          </h2>
          <p className="text-[rgba(232,228,218,0.45)] text-base md:text-lg leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        eventTitle={event.title}
        eventPrice={`Rs. ${Number(event.price).toLocaleString()}`}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}
