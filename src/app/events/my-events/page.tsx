"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { isAuthenticated } from "@/services/authService";
import { getAllEvents, deleteEvent } from "@/services/eventService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

function getUserIdFromToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

type EventStatus = "Live now" | "Upcoming" | "Completed";

interface MyEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  dateRaw: string;
  time: string;
  location: string;
  price: number;
  totalSeats: number;
  image: string;
  status: EventStatus;
}

function getEventStatus(dateRaw: string): EventStatus {
  const now = new Date();
  const eventDate = new Date(dateRaw);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const diff = eventDay.getTime() - today.getTime();
  if (diff === 0) return "Live now";
  if (diff > 0) return "Upcoming";
  return "Completed";
}

const statusColors: Record<EventStatus, { dot: string; bg: string; text: string }> = {
  "Live now": { dot: "bg-[#FF4B4B]", bg: "bg-[rgba(255,75,75,0.12)]", text: "text-[#FF4B4B]" },
  Upcoming: { dot: "bg-[#4A7AFF]", bg: "bg-[rgba(74,122,255,0.12)]", text: "text-[#4A7AFF]" },
  Completed: { dot: "bg-[#3BA67C]", bg: "bg-[rgba(59,166,124,0.12)]", text: "text-[#3BA67C]" },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function MyEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | EventStatus>("All");
  const [showSearch, setShowSearch] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setCheckedAuth(true);
    loadEvents();
  }, [router]);

  async function loadEvents() {
    try {
      const userId = getUserIdFromToken();
      const data = await getAllEvents();
      const mapped: MyEvent[] = (data.events || [])
        .filter((e: any) => e.createdBy?._id === userId)
        .map((e: any) => ({
          _id: e._id,
          title: e.title,
          description: e.description,
          category: e.category,
          date: formatDate(e.date),
          dateRaw: e.date,
          time: e.time,
          location: e.location,
          price: Number(e.price) || 0,
          totalSeats: e.totalSeats,
          image: e.image ? `${API_BASE}${e.image}` : "/img/nepaltourism2024.jpg",
          status: getEventStatus(e.date),
        }));
      setEvents(mapped);
    } catch {}
    setLoading(false);
  }

  async function handleDelete(eventId: string) {
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete event");
    }
    setDeleting(false);
  }

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total", value: events.length, icon: "✦", color: "#4A7AFF" },
    { label: "Live", value: events.filter((e) => e.status === "Live now").length, icon: "●", color: "#FF4B4B" },
    { label: "Upcoming", value: events.filter((e) => e.status === "Upcoming").length, icon: "○", color: "#4A7AFF" },
    { label: "Done", value: events.filter((e) => e.status === "Completed").length, icon: "✓", color: "#3BA67C" },
  ];

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />

      {/* ── Header Section ── */}
      <div className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1278px] mx-auto px-6 md:px-12 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 bg-[#4A7AFF] rounded-full" />
            <span className="text-[11px] font-[DM_Sans] uppercase tracking-[1.5px] text-[rgba(232,228,218,0.35)]">
              Manage Events
            </span>
          </div>

          <h1 className="text-[#E8E4DA] text-3xl md:text-4xl font-['Playfair_Display'] font-semibold leading-tight">
            Your{" "}
            <span className="text-[#4A7AFF]">
              Events
            </span>
          </h1>
          <p className="text-[rgba(232,228,218,0.35)] text-sm mt-1.5 font-[DM_Sans]">
            {loading ? "Gathering your events..." : `${events.length} event${events.length !== 1 ? "s" : ""} created`}
          </p>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1278px] mx-auto px-6 md:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] px-4 py-3.5 flex items-center gap-3"
              >
                {s.color && s.label === "Total" ? (
                  <span className="text-lg font-bold leading-none" style={{ color: s.color }}>
                    {s.icon}
                  </span>
                ) : (
                  <span className="text-lg font-bold leading-none" style={{ color: s.color }}>
                    {s.icon}
                  </span>
                )}
                <div>
                  <p className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.35)] uppercase tracking-[0.8px]">
                    {s.label}
                  </p>
                  <p className="text-[#E8E4DA] text-lg font-semibold font-['Playfair_Display'] leading-tight mt-0.5">
                    {loading ? "—" : s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1278px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          {/* Search toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (!showSearch) setTimeout(() => searchRef.current?.focus(), 50);
                else setSearchQuery("");
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                showSearch
                  ? "bg-[rgba(74,122,255,0.15)] outline outline-1 outline-[rgba(74,122,255,0.3)]"
                  : "bg-[rgba(255,255,255,0.04)] outline outline-1 outline-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)]"
              }`}
              aria-label="Toggle search"
            >
              <svg className="w-4 h-4 text-[rgba(232,228,218,0.50)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {showSearch
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                }
              </svg>
            </button>

            {showSearch && (
              <div className="animate-[fadeIn_0.15s_ease-out]">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, location, or category..."
                  className="w-[280px] h-9 px-3 bg-[rgba(255,255,255,0.04)] rounded-lg outline outline-1 outline-[rgba(255,255,255,0.10)] text-[13px] font-[DM_Sans] text-[#E8E4DA] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-[rgba(74,122,255,0.5)] transition-all"
                />
              </div>
            )}

            {/* Status filter pills */}
            <div className="hidden md:flex items-center gap-1.5 ml-2">
              {(["All", "Live now", "Upcoming", "Completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-[DM_Sans] font-medium tracking-[0.3px] transition-all ${
                    statusFilter === status
                      ? status === "All"
                        ? "bg-[rgba(74,122,255,0.15)] text-[#7AAAFF] outline outline-1 outline-[rgba(74,122,255,0.3)]"
                        : `${statusColors[status].bg} ${statusColors[status].text} outline outline-1 outline-[rgba(255,255,255,0.08)]`
                      : "text-[rgba(232,228,218,0.30)] hover:text-[rgba(232,228,218,0.50)] hover:bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  {status === "All" ? "All Events" : status}
                </button>
              ))}
            </div>

            {/* Mobile status dropdown */}
            <div className="md:hidden relative" ref={dropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="h-9 px-3 bg-[rgba(255,255,255,0.04)] rounded-lg outline outline-1 outline-[rgba(255,255,255,0.08)] flex items-center text-[rgba(232,228,218,0.50)] text-xs gap-2"
              >
                {statusFilter === "All" ? "Status" : statusFilter}
                <svg className={`w-3 h-3 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.10)] shadow-2xl overflow-hidden z-50">
                  {(["All", "Live now", "Upcoming", "Completed"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
                      className={`w-full px-4 py-2.5 text-xs text-left hover:bg-[rgba(255,255,255,0.03)] transition-all ${
                        statusFilter === status ? "text-[#7AAAFF]" : "text-[rgba(232,228,218,0.40)]"
                      }`}
                    >
                      {status === "All" ? "All Events" : status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push("/events/create")}
            className="px-6 py-3 bg-[#4A7AFF] rounded-lg flex items-center text-white text-sm font-medium gap-2 hover:opacity-90 transition-all shadow-[0_0_12px_rgba(74,122,255,0.25)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Create
          </button>
        </div>
      </div>

      {/* ── Events Grid / Empty / Loading ── */}
      <div className="max-w-[1278px] mx-auto px-6 md:px-12 py-8">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] overflow-hidden flex flex-col md:flex-row animate-pulse"
              >
                <div className="w-full md:w-[220px] h-[140px] md:h-auto bg-[rgba(255,255,255,0.04)]" />
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-[rgba(255,255,255,0.06)] rounded" />
                  <div className="h-5 w-3/4 bg-[rgba(255,255,255,0.06)] rounded" />
                  <div className="h-3 w-1/2 bg-[rgba(255,255,255,0.04)] rounded" />
                  <div className="flex justify-between pt-2">
                    <div className="h-4 w-16 bg-[rgba(255,255,255,0.06)] rounded" />
                    <div className="flex gap-2">
                      <div className="h-7 w-14 bg-[rgba(255,255,255,0.06)] rounded" />
                      <div className="h-7 w-14 bg-[rgba(255,255,255,0.06)] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-[rgba(74,122,255,0.08)] flex items-center justify-center mb-4">
              <span className="text-2xl opacity-40">✦</span>
            </div>
            <p className="text-[rgba(232,228,218,0.40)] text-sm font-[DM_Sans]">
              {searchQuery || statusFilter !== "All"
                ? "No events match what you're looking for"
                : "You haven't created any events yet"}
            </p>
            <p className="text-[rgba(232,228,218,0.20)] text-xs mt-1.5 font-[DM_Sans]">
              {searchQuery || statusFilter !== "All"
                ? "Try a different search or filter"
                : "Your first event is just a click away"}
            </p>
            {!searchQuery && statusFilter === "All" && (
              <button
                onClick={() => router.push("/events/create")}
                className="mt-6 px-6 py-3 bg-[#4A7AFF] rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all shadow-[0_0_12px_rgba(74,122,255,0.25)]"
              >
                Create your first event
              </button>
            )}
          </div>
        ) : (
          /* ── Event Cards ── */
          <div className="flex flex-col gap-4">
            {filteredEvents.map((event) => {
              const sc = statusColors[event.status];
              return (
                <div
                  key={event._id}
                  className="group bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] hover:outline-[rgba(74,122,255,0.2)] overflow-hidden flex flex-col md:flex-row transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,122,255,0.06)]"
                >
                  {/* Image */}
                  <div
                    className="w-full md:w-[220px] h-[140px] md:h-auto bg-cover bg-center shrink-0 relative overflow-hidden"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute inset-0 bg-[#0D1223]/60" />

                    {/* Status badge on image (mobile) */}
                    <div className="absolute top-3 left-3 md:hidden">
                      <span className={`${sc.bg} ${sc.text} px-2 py-0.5 rounded-full text-[10px] font-[DM_Sans] font-medium flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Meta row */}
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.35)]">{event.date}</span>
                        <span className="w-1 h-1 rounded-full bg-[rgba(232,228,218,0.15)]" />
                        <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.35)]">{event.time}</span>
                        <span className="w-1 h-1 rounded-full bg-[rgba(232,228,218,0.15)]" />
                        <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.35)] truncate">{event.location}</span>

                        {/* Status badge on desktop */}
                        <span className={`${sc.bg} ${sc.text} hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-[DM_Sans] font-medium items-center gap-1.5 ml-auto`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {event.status}
                        </span>
                      </div>

                      <h3 className="text-[#E8E4DA] text-lg font-['Playfair_Display'] font-semibold leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-[rgba(232,228,218,0.30)] text-[12px] font-[DM_Sans] mt-1 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-3">
                        <span className="text-[rgba(232,228,218,0.50)] text-sm font-medium">
                          {event.price > 0 ? `Rs. ${event.price.toLocaleString()}` : "Free"}
                        </span>
                        <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.25)]">
                          {event.totalSeats} seats
                        </span>
                        <span className="px-2 py-0.5 bg-[rgba(255,255,255,0.04)] rounded text-[10px] font-[DM_Sans] text-[rgba(232,228,218,0.30)]">
                          {event.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/events/edit/${event._id}`)}
                          className="px-5 py-2.5 bg-[rgba(74,122,255,0.10)] hover:bg-[rgba(74,122,255,0.20)] rounded-lg text-xs font-[DM_Sans] font-medium text-[#7AAAFF] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event._id)}
                          className="px-5 py-2.5 bg-[rgba(255,75,75,0.08)] hover:bg-[rgba(255,75,75,0.18)] rounded-lg text-xs font-[DM_Sans] font-medium text-[#FF6B6B] transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Count bar ── */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.02)] rounded-full outline outline-1 outline-[rgba(255,255,255,0.06)]">
              <span className="text-[11px] font-[DM_Sans] text-[rgba(232,228,218,0.30)]">
                {filteredEvents.length === events.length
                  ? `Showing all ${events.length} event${events.length !== 1 ? "s" : ""}`
                  : `${filteredEvents.length} of ${events.length} event${events.length !== 1 ? "s" : ""}`}
              </span>
              {filteredEvents.length < events.length && (
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
                  className="text-[11px] font-[DM_Sans] text-[rgba(74,122,255,0.6)] hover:text-[#7AAAFF] transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteConfirm(null)}
        >
          <div
            className="w-[380px] bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.10)] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-[rgba(255,75,75,0.12)] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#FF4B4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#E8E4DA] text-base font-['Playfair_Display'] font-semibold">Delete Event</h3>
                <p className="text-[rgba(232,228,218,0.35)] text-xs font-[DM_Sans] mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-[rgba(232,228,218,0.50)] text-sm font-[DM_Sans] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this event and all its associated data?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.15)] text-white text-sm hover:bg-white/5 transition-all disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-8 py-3 bg-[#FF4B4B] rounded-xl text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Event"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
