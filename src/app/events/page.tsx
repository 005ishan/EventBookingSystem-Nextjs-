"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";
import { getAllEvents } from "@/services/eventService";
import { SkeletonEventCardGrid } from "@/components/Skeleton";

type EventStatus = "Live now" | "Upcoming" | "Completed";

interface EventData {
  _id: string;
  date: string;
  time: string;
  location: string;
  category: string;
  title: string;
  description: string;
  priceNum: number;
  organizer: string;
  createdById: string;
  image: string;
  totalSeats: number;
  availableSeats: number;
  status: EventStatus;
  dateRaw: string;
}

const statusColors: Record<
  EventStatus,
  { dot: string; bg: string; text: string }
> = {
  "Live now": {
    dot: "bg-[#FF4B4B]",
    bg: "bg-[rgba(255,75,75,0.12)]",
    text: "text-[#FF4B4B]",
  },
  Upcoming: {
    dot: "bg-[#4A7AFF]",
    bg: "bg-[rgba(74,122,255,0.12)]",
    text: "text-[#4A7AFF]",
  },
  Completed: {
    dot: "bg-[#3BA67C]",
    bg: "bg-[rgba(59,166,124,0.12)]",
    text: "text-[#3BA67C]",
  },
};

function getEventStatus(dateRaw: string, timeRaw?: string): EventStatus {
  const now = new Date();
  const eventDate = new Date(dateRaw);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );
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

function EventCard({ event, onOrganizerClick }: { event: EventData; onOrganizerClick: (id: string, name: string) => void }) {
  const router = useRouter();
  return (
    <div className="w-[312px] h-[335px] bg-[#0D1223] overflow-hidden rounded-[14px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.08)] flex flex-col shrink-0">
      <div
        className="self-stretch h-[155px] relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-[#0D1223]/60" />
        <div className="absolute top-3 left-3">
          <span
            className={`${statusColors[event.status].bg} ${statusColors[event.status].text} px-2 py-0.5 rounded-full text-[10px] font-[DM_Sans] font-medium flex items-center gap-1.5`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusColors[event.status].dot}`}
            />
            {event.status}
          </span>
        </div>
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
          <button
            onClick={() => onOrganizerClick(event.createdById, event.organizer)}
            className="text-[10px] font-[DM_Sans] text-[rgba(232,228,218,0.30)] leading-none mt-[6px] hover:text-[#7AAAFF] transition-colors text-left"
          >
            Event Organized by {event.organizer}
          </button>
        </div>
        <p className="text-[12px] font-[DM_Sans] font-light leading-[19.20px] text-[rgba(232,228,218,0.38)] line-clamp-2">
          {event.description}
        </p>
        <div className="self-stretch pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.45)]">
            {event.availableSeats} / {event.totalSeats} seats
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-[DM_Sans] font-semibold text-[#3BA67C]">
              {event.priceNum === 0 ? "Free" : `Rs. ${event.priceNum.toLocaleString()}`}
            </span>
            {event.status !== "Completed" && (
              <button
                onClick={() => router.push(`/events/${event._id}`)}
                className="px-[14px] py-[6px] bg-[#3BA67C] rounded-[7px] hover:bg-[#2d8e68] transition-all"
              >
                <span className="text-[12px] font-[DM_Sans] font-medium text-white">
                  Buy Tickets
                </span>
              </button>
            )}
            {event.status === "Completed" && (
              <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.25)] italic">
                Ended
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function mapEvent(raw: any): EventData {
  const organizerName =
    raw.createdBy?.organizerName ||
    raw.createdBy?.name ||
    "Organizer";
  return {
    _id: raw._id,
    date: formatDate(raw.date),
    dateRaw: raw.date,
    time: raw.time || "",
    location: raw.location || "",
    category: raw.category || "Others",
    title: raw.title,
    description: raw.description,
    priceNum: Number(raw.price) || 0,
    organizer: organizerName,
    createdById: raw.createdBy?._id || "",
    totalSeats: raw.totalSeats ?? 0,
    availableSeats: raw.availableSeats ?? 0,
    status: getEventStatus(raw.date, raw.time),
    image: raw.image ? `${API_BASE}${raw.image}` : "/img/nepaltourism2024.jpg",
  };
}

export default function EventsPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOrganizer, setFilterOrganizer] = useState<{ id: string; name: string } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [organizerSearch, setOrganizerSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  const fetchEvents = useCallback(async () => {
    if (!checkedAuth) return;
    setLoading(true);
    const params: Record<string, string> = {};
    if (searchText) params.search = searchText;
    if (dateValue) params.date = dateValue;
    try {
      const [data] = await Promise.all([
        getAllEvents(params),
        new Promise<void>((r) => setTimeout(r, 1500)),
      ]);
      const mapped: EventData[] = (data.events || []).map(mapEvent);
      setAllEvents(mapped);
      const counts: Record<string, number> = {};
      mapped.forEach((e: EventData) => {
        counts[e.category] = (counts[e.category] || 0) + 1;
      });
      setCategoryCounts(counts);
    } catch {}
    setLoading(false);
  }, [checkedAuth, searchText, dateValue]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const events = allEvents
    .filter((e) => {
      if (filterOrganizer && e.createdById !== filterOrganizer.id) return false;
      if (organizerSearch && !e.organizer.toLowerCase().includes(organizerSearch.toLowerCase())) return false;
      if (locationSearch && !e.location.toLowerCase().includes(locationSearch.toLowerCase())) return false;
      if (categoryFilter && e.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const priority: Record<EventStatus, number> = { "Live now": 0, Upcoming: 1, Completed: 2 };
      return priority[a.status] - priority[b.status];
    });

  const handleOrganizerClick = (id: string, name: string) => {
    setFilterOrganizer((prev) =>
      prev?.id === id ? null : { id, name }
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setOrganizerSearch("");
    setLocationSearch("");
    setDateValue("");
    setCategoryFilter("");
    setFilterOrganizer(null);
  };

  if (!checkedAuth) return null;

  return (
    <div className="bg-[#0A0E1A] min-h-screen">
      <AuthenticatedNavbar />

      <div className="flex" style={{ minHeight: "calc(100vh - 90px)" }}>
        <aside className="w-[260px] shrink-0 bg-[#0D1223] border-r border-[rgba(255,255,255,0.07)] flex flex-col pt-7 pb-7 px-[22px] gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Search
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center pl-[36px] pr-3">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search events..."
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[#E8E4DA] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-none"
              />
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Date
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center px-3">
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[rgba(232,228,218,0.60)] focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Organizer
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center pl-[36px] pr-3">
              <input
                type="text"
                value={organizerSearch}
                onChange={(e) => setOrganizerSearch(e.target.value)}
                placeholder="Search organizer..."
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[#E8E4DA] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-none"
              />
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Location
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center pl-[36px] pr-3">
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search location..."
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[#E8E4DA] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-none"
              />
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-[DM_Sans] font-medium uppercase tracking-[1.20px] text-[rgba(232,228,218,0.35)]">
              Category
            </span>
            <div className="h-[38px] bg-[rgba(255,255,255,0.05)] rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center px-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 bg-transparent text-[13px] font-[DM_Sans] text-[#E8E4DA] focus:outline-none [color-scheme:dark]"
              >
                <option value="" className="bg-[#0D1223]">All Categories</option>
                {["Festival", "Concert", "Social", "Charity", "Others"].map((cat) => (
                <option key={cat} value={cat} className="bg-[#0D1223]">
                  {cat} {categoryCounts[cat] !== undefined ? `(${categoryCounts[cat]})` : ""}
                </option>
              ))}
              </select>
            </div>
          </div>

          <div className="h-[0.5px] bg-[rgba(255,255,255,0.06)]" />

          <button
            onClick={clearFilters}
            className="h-9 rounded-[9px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.10)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.03)] transition-all"
          >
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
              {loading
                ? "Fetching events..."
                : filterOrganizer
                  ? `Showing ${events.length} event${events.length !== 1 ? "s" : ""} by ${filterOrganizer.name}`
                  : searchText || dateValue || organizerSearch || locationSearch || categoryFilter
                    ? `Showing ${events.length} of ${allEvents.length} event${allEvents.length !== 1 ? "s" : ""}`
                    : `Showing ${allEvents.length} event${allEvents.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loading ? (
            <SkeletonEventCardGrid count={6} />
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">
                {filterOrganizer
                  ? `No events found by ${filterOrganizer.name}.`
                  : searchText || dateValue || organizerSearch || locationSearch || categoryFilter
                    ? "No events match your filters. Try adjusting them."
                    : "No events found. Create one to get started!"}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {events.map((event, i) => (
                <EventCard key={i} event={event} onOrganizerClick={handleOrganizerClick} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="pt-12"><Footer /></div>
    </div>
  );
}
