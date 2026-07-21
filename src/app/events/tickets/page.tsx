"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Skeleton from "@/components/Skeleton";
import { isAuthenticated } from "@/services/authService";
import api from "@/services/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

type EventStatus = "Live now" | "Upcoming" | "Completed";

interface Ticket {
  id: string;
  eventName: string;
  eventCategory: string;
  ticketNumber: string;
  price: string;
  eventDate: string;
  eventTime: string;
  status: EventStatus;
  image: string;
  seats: number;
  bookingStatus: string;
}

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

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTicketId(id: string) {
  const short = id.slice(-6).toUpperCase();
  return `EBS-2026-${short}`;
}

const statusStyles: Record<string, string> = {
  "Live now": "bg-red-500/10 text-red-400 outline-red-500/25",
  Upcoming: "bg-blue-500/10 text-blue-400 outline-blue-500/25",
  Completed: "bg-green-500/10 text-green-400 outline-green-500/25",
};

const bookingStatusStyles: Record<string, string> = {
  confirmed: "bg-green-500/10 text-green-400 outline-green-500/25",
  cancelled: "bg-red-500/10 text-red-400 outline-red-500/25",
};

export default function TicketsPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const perPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setCheckedAuth(true);

    let mounted = true;
    const loadStart = Date.now();

    api
      .get("/bookings/my-bookings")
      .then((res) => {
        if (!mounted) return;
        const bookings = res.data.bookings || [];
        const mapped: Ticket[] = bookings.map((b: any) => {
          const event = b.event || {};
          const image = event.image
            ? `${API_BASE}${event.image}`
            : "https://placehold.co/36x36";
          return {
            id: b._id,
            eventName: event.title || "Unknown Event",
            eventCategory: event.category || "",
            ticketNumber: formatTicketId(b._id),
            price:
              event.price === 0
                ? "Free"
                : `Rs. ${(event.price * b.seats).toLocaleString()}`,
            eventDate: event.date ? formatDate(event.date) : "",
            eventTime: event.time || "",
            status: getEventStatus(event.date, event.time),
            image,
            seats: b.seats,
            bookingStatus: b.status,
          };
        });
        if (!mounted) return;
        setTickets(mapped);

        const elapsed = Date.now() - loadStart;
        const remaining = Math.max(0, 500 - elapsed);
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, remaining);
      })
      .catch(() => {
        if (!mounted) return;
        setTickets([]);

        const elapsed = Date.now() - loadStart;
        const remaining = Math.max(0, 500 - elapsed);
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, remaining);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All status" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTickets = filteredTickets.slice(
    (safePage - 1) * perPage,
    safePage * perPage
  );

  if (!checkedAuth || loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A]">
        <AuthenticatedNavbar />
        <div className="max-w-[1500px] mx-auto px-8 py-10">
          <Skeleton variant="text" lines={2} className="mb-6" />
          <div className="bg-[#151B2B] rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-700 px-5 py-3.5 gap-6">
              <Skeleton variant="rect" height="h-3" className="flex-1" />
              <Skeleton variant="rect" height="h-3" className="w-52" />
              <Skeleton variant="rect" height="h-3" className="w-28" />
              <Skeleton variant="rect" height="h-3" className="w-40" />
              <Skeleton variant="rect" height="h-3" className="w-16" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex border-b border-gray-800 px-5 py-4 gap-6">
                <div className="flex-1 flex items-center gap-3">
                  <Skeleton variant="rect" height="h-9 w-9 rounded-[10px]" />
                  <div className="flex-1 flex flex-col gap-1">
                    <Skeleton variant="rect" height="h-4 w-3/4" />
                    <Skeleton variant="rect" height="h-3" />
                  </div>
                </div>
                <Skeleton variant="rect" height="h-6 w-52" />
                <Skeleton variant="rect" height="h-4 w-28" />
                <Skeleton variant="rect" height="h-4 w-40" />
                <Skeleton variant="rect" height="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />
      <div>
        <div className="border-b border-gray-800 bg-[#0A0E1A]">
          <div className="max-w-[1500px] mx-auto px-8 pt-10 pb-6">
            <div className="mb-1">
              <span className="text-blue-400 text-sm mb-1">Your Tickets</span>
            </div>

            <h1 className="text-white text-4xl font-bold mb-1">
              My <span className="text-blue-500">Tickets</span>
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              View and manage all your purchased tickets
            </p>

            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="h-11 px-4 bg-white/5 rounded-lg border border-gray-700 flex items-center text-gray-400 text-sm hover:bg-white/10 transition-all"
                  >
                    {statusFilter}
                    <svg
                      className={`w-3.5 h-3.5 ml-2 text-gray-500 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full mt-1 right-0 w-36 bg-[#151B2B] rounded-lg border border-gray-700 shadow-2xl overflow-hidden z-50">
                      {["All status", "Live now", "Upcoming", "Completed"].map((status) => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-all ${
                            statusFilter === status ? "text-blue-400 bg-blue-500/10" : "text-gray-400"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="h-11 px-5 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-center text-blue-400 text-sm hover:bg-blue-500/20 transition-all">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-8 py-8">
          <div className="min-h-[400px]">
            <div className="w-full bg-[#151B2B] rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-700">
                <div className="flex-1 px-5 py-3.5">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Event name</span>
                </div>
                <div className="w-52 px-5 py-3.5">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Ticket number</span>
                </div>
                <div className="w-28 px-5 py-3.5">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Price</span>
                </div>
                <div className="w-40 px-5 py-3.5">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Event date</span>
                </div>
                <div className="ml-auto px-5 py-3.5">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Status</span>
                </div>
              </div>

              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
                  <div key={ticket.id} className="flex border-b border-gray-800 last:border-b-0 hover:bg-white/[0.02] transition-all">
                    <div className="flex-1 px-5 py-4 flex items-center gap-3">
                      <img className="w-9 h-9 rounded-[10px] object-cover flex-shrink-0" src={ticket.image} alt={ticket.eventName} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-white text-sm font-medium truncate">{ticket.eventName}</span>
                        <span className="text-gray-500 text-xs truncate">
                          {ticket.eventCategory}
                          {ticket.seats > 1 && ` · ${ticket.seats} seats`}
                        </span>
                      </div>
                    </div>
                    <div className="w-52 px-5 py-4 flex items-center">
                      <span className="px-2.5 py-[3px] bg-white/5 rounded-md border border-gray-700 text-gray-400 text-xs tracking-tight">{ticket.ticketNumber}</span>
                    </div>
                    <div className="w-28 px-5 py-4 flex items-center">
                      <span className={`text-sm font-medium ${ticket.price === "Free" ? "text-green-400" : "text-white"}`}>{ticket.price}</span>
                    </div>
                    <div className="w-40 px-5 py-4 flex flex-col justify-center gap-0.5">
                      <span className="text-gray-300 text-sm">{ticket.eventDate}</span>
                      <span className="text-gray-500 text-xs">{ticket.eventTime}</span>
                    </div>
                    <div className="ml-auto px-5 py-4 flex items-center gap-2">
                      {ticket.bookingStatus === "cancelled" && (
                        <span className={`px-2.5 py-1 rounded-[100px] border text-xs font-medium inline-flex items-center gap-1.5 ${bookingStatusStyles.cancelled}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          Cancelled
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-[100px] border text-xs font-medium inline-flex items-center gap-1.5 ${
                        statusStyles[ticket.status] || "bg-white/5 text-gray-500 border-gray-700"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-6.75-8.25h3m-3 3h3M9 6.75h.008v.008H9V6.75zm0 6h.008v.008H9V12.75zm0 3h.008v.008H9V15.75zM5.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3z" />
                    </svg>
                    <p className="text-gray-400 text-sm">No tickets found</p>
                    <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filter</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-[#0A0E1A] py-4 border-t border-gray-800">
          <div className="max-w-[1500px] mx-auto px-8">
            <div className="bg-[#151B2B] rounded-xl border border-gray-700">
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-gray-400 text-sm">
                  Showing {filteredTickets.length} of {tickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all ${
                        safePage === page
                          ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                          : "bg-white/5 border-gray-700 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs">{page}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
