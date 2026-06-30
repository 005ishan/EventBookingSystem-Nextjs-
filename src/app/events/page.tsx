"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";

interface Attendee {
  initial: string;
  color: string;
}

interface EventData {
  date: string;
  time: string;
  location: string;
  title: string;
  description: string;
  attendees: Attendee[];
  count: string;
  image: string;
}

const events: EventData[] = [
  {
    date: "April 14 & 15",
    time: "2:00 PM",
    location: "Basantapur, Kathmandu",
    title: "Nepal Tourism Festival",
    description: "Many Tourists will be getting to know Nepal more from this event.",
    attendees: [
      { initial: "A", color: "#4A7AFF" },
      { initial: "K", color: "#7A4AFF" },
      { initial: "R", color: "#E44040" },
    ],
    count: "182",
    image: "/img/nepaltourism2024.jpg",
  },
  {
    date: "19 March",
    time: "2:00 PM",
    location: "Durbar Marg",
    title: "Nepal Tour 2026",
    description: "Albatross and Pahilo Batti Muni performing grab your tickets via esewa.",
    attendees: [
      { initial: "A", color: "#4A7AFF" },
      { initial: "K", color: "#7A4AFF" },
      { initial: "R", color: "#E44040" },
    ],
    count: "450",
    image: "/img/Tastethe.png",
  },
  {
    date: "Feb 04",
    time: "2:00 PM",
    location: "Bhuttandevi School Ground",
    title: "Nepathya Nepal Tour",
    description: "Nepathya will be around your hometown stay tuned.",
    attendees: [
      { initial: "A", color: "#4A7AFF" },
      { initial: "K", color: "#7A4AFF" },
      { initial: "R", color: "#E44040" },
    ],
    count: "808",
    image: "/img/standupcomedy.png",
  },
  {
    date: "Feb 10,21,22",
    time: "2:00 PM",
    location: "New Road",
    title: "Second INDO-NEPAL Trade Festival",
    description: "Many tradition themes to be performed so be there!!",
    attendees: [
      { initial: "A", color: "#4A7AFF" },
      { initial: "K", color: "#7A4AFF" },
      { initial: "R", color: "#E44040" },
    ],
    count: "503",
    image: "/img/nepaltourism2024.jpg",
  },
  {
    date: "May 05",
    time: "6:00 PM",
    location: "Patan Durbar Square",
    title: "Lalitpur Cultural Night",
    description: "Traditional music and dance performances under the stars.",
    attendees: [
      { initial: "S", color: "#4A7AFF" },
      { initial: "P", color: "#7A4AFF" },
      { initial: "M", color: "#E44040" },
    ],
    count: "234",
    image: "/img/Tastethe.png",
  },
  {
    date: "June 12-15",
    time: "10:00 AM",
    location: "Bhairahawa",
    title: "Lumbini Peace Festival",
    description: "Celebrate peace and harmony at the birthplace of Buddha.",
    attendees: [
      { initial: "D", color: "#4A7AFF" },
      { initial: "L", color: "#7A4AFF" },
      { initial: "T", color: "#E44040" },
    ],
    count: "320",
    image: "/img/standupcomedy.png",
  },
  {
    date: "July 08",
    time: "3:00 PM",
    location: "Chitwan",
    title: "Jungle Safari Expo",
    description: "Explore Nepal's wildlife and conservation efforts.",
    attendees: [
      { initial: "N", color: "#4A7AFF" },
      { initial: "B", color: "#7A4AFF" },
      { initial: "G", color: "#E44040" },
    ],
    count: "167",
    image: "/img/nepaltourism2024.jpg",
  },
  {
    date: "Aug 21-23",
    time: "9:00 AM",
    location: "Pokhara",
    title: "Pokhara International Marathon",
    description: "Run alongside the stunning Phewa Lake with the Annapurna range as your backdrop.",
    attendees: [
      { initial: "H", color: "#4A7AFF" },
      { initial: "A", color: "#7A4AFF" },
      { initial: "S", color: "#E44040" },
    ],
    count: "589",
    image: "/img/Tastethe.png",
  },
];

function EventCard({ event }: { event: EventData }) {
  return (
    <div className="w-[312px] h-[335px] bg-[#0D1223] overflow-hidden rounded-[14px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.08)] flex flex-col shrink-0">
      <div
        className="self-stretch h-[155px] relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute right-[14px] top-[22px] opacity-[0.18]">
          <span className="text-[#E8E4DA] text-[110px] font-[DM_Sans] leading-none">🎤</span>
        </div>
      </div>
      <div className="self-stretch pt-4 pb-[18px] px-[18px] flex flex-col gap-[6px] flex-1">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.38)] leading-none">
            {event.date}
          </span>
          <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.38)] leading-none">
            {event.time}
          </span>
          <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.38)] leading-none truncate">
            {event.location}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-[#E8E4DA] text-base font-['Playfair_Display'] font-semibold leading-[20.80px]">
            {event.title}
          </h3>
        </div>
        <p className="text-[12px] font-[DM_Sans] font-light leading-[19.20px] text-[rgba(232,228,218,0.38)]">
          {event.description}
        </p>
        <div className="self-stretch pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-[5px]">
            <div className="flex items-center">
              {event.attendees.map((person, i) => (
                <div
                  key={i}
                  className="w-[22px] h-[22px] rounded-full outline outline-1 outline-[#0D1223] outline-offset-[-1px] flex items-center justify-center"
                  style={{
                    backgroundColor: person.color,
                    marginLeft: i > 0 ? "-6px" : "0",
                    zIndex: 3 - i,
                  }}
                >
                  <span className="text-white text-[9px] font-[DM_Sans] font-medium">
                    {person.initial}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.32)] ml-[4px]">
              {event.count}
            </span>
          </div>
          <button className="px-[14px] py-[6px] bg-[rgba(74,122,255,0.14)] rounded-[7px] outline outline-1 outline-offset-[-1px] outline-[rgba(74,122,255,0.32)] hover:bg-[rgba(74,122,255,0.25)] transition-all">
            <span className="text-[12px] font-[DM_Sans] font-medium text-[#7AAAFF]">
              View Details ❗
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  if (!checkedAuth) return null;

  return (
    <div className="bg-[#0A0E1A] min-h-screen">
      <AuthenticatedNavbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 90px)" }}>
        <aside className="w-[260px] shrink-0 bg-[#0D1223] border-r border-[rgba(255,255,255,0.07)] flex flex-col pt-7 pb-7 px-[22px] gap-7">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Search
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center pl-[36px] pr-3">
              <input
                type="text"
                placeholder="Search events..."
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[rgba(232,228,218,0.22)] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-none"
              />
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />
          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />
          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Date range
            </span>
            <div className="flex flex-col gap-2">
              <div className="h-9 bg-[rgba(255,255,255,0.05)] rounded-[8px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center px-3">
                <span className="flex-1 text-[12px] font-[DM_Sans] text-[rgba(232,228,218,0.60)]">
                  05/18/2026
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1.5" y="2.25" width="9" height="8.5" rx="1" stroke="currentColor" strokeWidth="0.75" fill="none" />
                  <path d="M1.5 4.5H10.5" stroke="currentColor" strokeWidth="0.75" />
                  <rect x="3" y="1.5" width="0.75" height="1.5" rx="0.375" fill="currentColor" />
                  <rect x="8.25" y="1.5" width="0.75" height="1.5" rx="0.375" fill="currentColor" />
                </svg>
              </div>
              <div className="h-9 bg-[rgba(255,255,255,0.05)] rounded-[8px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center px-3">
                <span className="flex-1 text-[12px] font-[DM_Sans] text-[rgba(232,228,218,0.60)]">
                  05/31/2026
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1.5" y="2.25" width="9" height="8.5" rx="1" stroke="currentColor" strokeWidth="0.75" fill="none" />
                  <path d="M1.5 4.5H10.5" stroke="currentColor" strokeWidth="0.75" />
                  <rect x="3" y="1.5" width="0.75" height="1.5" rx="0.375" fill="currentColor" />
                  <rect x="8.25" y="1.5" width="0.75" height="1.5" rx="0.375" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <button className="h-9 rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.03)] transition-all">
            <span className="text-[13px] font-[DM_Sans] text-[rgba(232,228,218,0.40)]">
              Clear all filters
            </span>
          </button>
        </aside>

        <div className="flex-1 px-[48px] pt-7">
          <div className="mb-4">
            <h1 className="text-[26px] font-['Playfair_Display'] font-bold text-[#E8E4DA]">
              Ongoing{" "}
              <span className="text-[#4A7AFF] italic">Events</span>
            </h1>
            <p className="text-[13px] font-[DM_Sans] text-[rgba(232,228,218,0.35)] mt-1">
              Showing {events.length} of {events.length} events
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {events.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        </div>
      </div>
      <div className="pt-12"><Footer /></div>
    </div>
  );
}
