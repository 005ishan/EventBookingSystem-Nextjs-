"use client";

import { useState, useRef, useEffect, type TouchEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { SkeletonAuthenticatedPage } from "@/components/Skeleton";
import { isAuthenticated, getUser } from "@/services/authService";
import { getAllEvents } from "@/services/eventService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

type EventStatus = "Live now" | "Upcoming" | "Completed";

function getEventStatus(dateRaw: string, timeRaw?: string): EventStatus {
  const now = new Date();
  const eventDate = new Date(dateRaw);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const diff = eventDay.getTime() - today.getTime();
  if (diff > 0) return "Upcoming";
  if (diff < 0) return "Completed";
  if (timeRaw) {
    const [hours, minutes] = timeRaw.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const eventDateTime = new Date(eventDay);
      eventDateTime.setHours(hours, minutes, 0, 0);
      if (now.getTime() < eventDateTime.getTime()) return "Upcoming";
    }
  }
  return "Live now";
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(timeStr: string) {
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${parts[1]} ${ampm}`;
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  image: string;
  organizer: string;
  status: EventStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseDownX = useRef<number | null>(null);
  const minSwipe = 50;

  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setCheckedAuth(true);
    fetchEvents();
  }, [router]);

  async function fetchEvents() {
    try {
      const data = await getAllEvents();
      const mapped: EventData[] = (data.events || [])
        .filter((e: any) => {
          const s = getEventStatus(e.date, e.time);
          return s === "Live now" || s === "Upcoming";
        })
        .map((e: any) => ({
          _id: e._id,
          title: e.title,
          description: e.description,
          date: formatDate(e.date),
          time: formatTime(e.time),
          location: e.location,
          price: Number(e.price) || 0,
          totalSeats: e.totalSeats,
          availableSeats: e.availableSeats,
          image: e.image ? `${API_BASE}${e.image}` : "/img/nepaltourism2024.jpg",
          organizer: e.createdBy?.organizerName || e.createdBy?.name || "",
          status: getEventStatus(e.date, e.time),
        }))
        .sort((a, b) => {
          const p: Record<EventStatus, number> = { "Live now": 0, Upcoming: 1, Completed: 2 };
          return p[a.status] - p[b.status];
        });
      setAllEvents(mapped);
    } catch {}
    setLoading(false);
  }

  function handleSwipe(dist: number) {
    const maxIdx = Math.min(2, allEvents.length - 1);
    if (dist > minSwipe && currentFeatured < maxIdx) {
      setCurrentFeatured(currentFeatured + 1);
    } else if (dist < -minSwipe && currentFeatured > 0) {
      setCurrentFeatured(currentFeatured - 1);
    }
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function onTouchMove(e: TouchEvent<HTMLDivElement>) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function onTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    handleSwipe(touchStartX.current - touchEndX.current);
  }

  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    mouseDownX.current = e.clientX;
  }

  function onMouseUp(e: MouseEvent<HTMLDivElement>) {
    if (mouseDownX.current === null) return;
    handleSwipe(mouseDownX.current - e.clientX);
    mouseDownX.current = null;
  }

  function onMouseLeave() {
    mouseDownX.current = null;
  }

  function goToNext() {
    const maxIdx = Math.min(2, allEvents.length - 1);
    setCurrentFeatured(currentFeatured === maxIdx ? 0 : currentFeatured + 1);
  }

  useEffect(() => {
    if (allEvents.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [currentFeatured, allEvents.length]);

  const featured = allEvents.slice(0, 3);
  const liveEvents = allEvents.filter((e) => e.status === "Live now");
  const upcomingEvents = allEvents.filter((e) => e.status === "Upcoming");

  function toCardProps(e: EventData) {
    const filledPct = e.totalSeats > 0 ? (e.totalSeats - e.availableSeats) / e.totalSeats : 0;
    return {
      img: e.image,
      title: e.title,
      price: e.price === 0 ? "Free" : `Rs. ${e.price.toLocaleString()}`,
      desc: e.description,
      btn: "Book Now",
      date: e.status === "Live now" ? "LIVE NOW" : `${e.date} \u2022 ${e.time}`,
      organizer: e.organizer || undefined,
      soldOut: e.availableSeats === 0,
      trending: e.availableSeats > 0 && filledPct >= 0.7,
    };
  }

  if (!checkedAuth) {
    return <SkeletonAuthenticatedPage />;
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div
        className="self-stretch bg-[#0A0E1A] border border-solid border-black flex flex-col min-h-screen"
        style={{ boxShadow: "0px 4px 4px #00000040" }}
      >
        <AuthenticatedNavbar />
        <div className="flex-1 overflow-y-auto">
          <section className="self-stretch bg-[#00000000] pb-10">
            <div className="flex flex-col items-center self-stretch max-w-[1278px] pt-16 pb-8 px-6 mx-auto">
              {user?.name ? (
                <h1 className="text-[#DDE2F8] text-5xl text-center whitespace-pre-line">
                  Welcome back,{" "}
                  <span className="text-[#FF4B4B]">{user.name.split(" ")[0]}</span>
                  <span className="block text-2xl text-[#E4BDBA]/60 mt-2 font-light">
                    Find your next experience
                  </span>
                </h1>
              ) : (
                <h1 className="text-[#DDE2F8] text-6xl text-center w-[400px] whitespace-pre-line">
                  {"Find Your Next\n"}
                  <span className="text-[#FF4B4B]">Experience</span>
                </h1>
              )}
            </div>

            {loading ? (
              <div className="max-w-[1150px] mx-auto h-[500px] flex items-center justify-center">
                <p className="text-[#E4BDBA]/40 text-sm">Loading events...</p>
              </div>
            ) : featured.length > 0 ? (
              <div
                className="relative max-w-[1150px] mx-auto overflow-hidden rounded-2xl select-none cursor-grab active:cursor-grabbing"
                style={{ background: "linear-gradient(180deg, #0D1322, #0D132266, #0D132200)" }}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentFeatured * 100}%)` }}
                >
                  {featured.map((event) => (
                    <div key={event._id} className="min-w-full flex justify-between items-start relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      <div className="absolute inset-0 bg-[#0D1322]/80" />
                      <div className="flex flex-col shrink-0 items-start py-16 mt-[200px] gap-4 relative z-10">
                        <div className="flex items-center bg-[#FF4B4BE3] py-1 px-4 ml-16 gap-2 rounded-[9999px]">
                          <div className="bg-white w-2 h-2 rounded-[9999px]" />
                          <span className="text-white text-xs font-bold">FEATURED EVENT</span>
                        </div>
                        <div className="flex flex-col items-start pt-2 pr-[332px] mx-16">
                          <span className="text-white text-base">{event.title}</span>
                          {event.organizer && (
                            <span className="text-[#E4BDBA]/50 text-xs mt-1">by {event.organizer}</span>
                          )}
                        </div>
                        <p className="text-[#E4BDBA] text-base w-[539px] ml-16 whitespace-pre-line">{event.description}</p>
                        <div className="flex items-start pt-4 ml-16">
                          <button
                            className="flex flex-col shrink-0 items-start bg-[#FF4B4B] text-left py-4 px-10 mr-[17px] rounded-xl border-0 hover:bg-[#E03B3B]"
                            style={{ boxShadow: "0px 0px 20px #FF4B4B33" }} onClick={() => router.push(`/events/${event._id}`)}
                          >
                            <span className="text-white text-lg font-bold">
                              {event.status === "Live now" ? "Join Now" : "Reserve Spot"}
                            </span>
                          </button>
                          <button
                            className="flex flex-col shrink-0 items-start bg-[#FFFFFF1A] text-left py-[17px] px-10 mr-[173px] rounded-xl border border-solid border-[#FFFFFF33] hover:bg-[#FFFFFF26]"
                            onClick={() => router.push(`/events/${event._id}`)}
                          >
                            <span className="text-white text-lg font-bold">Event Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-8 right-16 flex items-center gap-3">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFeatured(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentFeatured ? "bg-[#FF4B4B] scale-110" : "bg-[#FFFFFF4D] hover:bg-[#FFFFFF80]"}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {!loading && liveEvents.length > 0 && (
              <section className="flex flex-col self-stretch max-w-[1278px] pt-20 px-16 mx-auto gap-8">
                <div className="flex flex-col self-stretch gap-2">
                  <h2 className="text-white text-base">Happening Now</h2>
                  <p className="text-[#E4BDBA] text-base">Don&apos;t miss out on these live experiences</p>
                </div>
                <div className="flex items-center self-stretch gap-[33px]">
                  {liveEvents.map((event) => (
                    <EventCard key={event._id} {...toCardProps(event)} onAction={() => router.push(`/events/${event._id}`)} />
                  ))}
                </div>
              </section>
            )}

            {!loading && upcomingEvents.length > 0 && (
              <section className="flex flex-col self-stretch max-w-[1278px] pt-20 px-16 mx-auto gap-8">
                <div className="flex flex-col self-stretch gap-2">
                  <h2 className="text-white text-base">Upcoming Near You</h2>
                  <p className="text-[#E4BDBA] text-base">Recommended based on your location: Kathmandu, Nepal</p>
                </div>
                <div className="flex items-center self-stretch gap-[33px]">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} {...toCardProps(event)} onAction={() => router.push(`/events/${event._id}`)} />
                  ))}
                </div>
                <div className="flex flex-col items-center self-stretch pt-4">
                  <button
                    className="flex flex-col items-start bg-[#2F3445] text-left py-[17px] px-12 rounded-xl border border-solid border-[#2F3445] hover:bg-[#3A4155]"
                    onClick={() => router.push("/events")}
                  >
                    <span className="text-[#DDE2F8] text-base font-bold">Explore More Events</span>
                  </button>
                </div>
              </section>
            )}
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}
