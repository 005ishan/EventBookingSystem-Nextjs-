"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";
import { getEventById } from "@/services/eventService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await getEventById(params.id as string);
        const e = data.event;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

        const organizer = e.createdBy?.organizerName || e.createdBy?.name || "Organizer";
        const image = e.image ? `${API_BASE}${e.image}` : "/img/nepaltourism2024.jpg";

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

  if (!isAuthenticated()) return null;

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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 bg-[#0A0E1A]/80" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 -mt-20 relative z-10">
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
            <span className="text-[rgba(232,228,218,0.38)] text-2xl font-[DM_Sans]">
              Rs. {event.price}
            </span>
            <button className="px-6 py-3 bg-[#FF4A4A] rounded-lg hover:bg-[#e03b3b] transition-all">
              <span className="text-white text-sm font-medium">Book Now</span>
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

      <Footer />
    </div>
  );
}
