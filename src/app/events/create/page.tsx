"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";

export default function CreateEventPage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ticketType, setTicketType] = useState("paid");
  const [ticketPrice, setTicketPrice] = useState("0.00");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    } else {
      setCheckedAuth(true);
    }
  }, []);

  function processFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB");
      return;
    }
    setEventImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handlePublish() {
    if (!eventName.trim()) {
      alert("Please enter an event name");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("Please set start and end date/time");
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      alert("Event published successfully!");
      router.push("/dashboard");
    }, 1500);
  }

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />

      <div className="max-w-[1500px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm mb-1">Create event</p>
          <h1 className="text-white text-4xl font-bold">
            Create your <span className="text-blue-500">event</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Fill in the details below and publish your event
          </p>
        </div>

        {/* Row 1 */}
        <div className="flex gap-6 mb-6">
          {/* Basic Info */}
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-5">Basic information</h2>

            <label className="text-gray-400 text-sm mb-1 block">Event name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Give your event a great name..."
              className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 mb-4"
            />

            <label className="text-gray-400 text-sm mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) setDescription(e.target.value);
              }}
              placeholder="Describe what attendees can expect..."
              rows={5}
              className="w-full px-4 py-3 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 resize-none mb-1"
            />
            <p className="text-right text-gray-500 text-xs">{description.length} / 500</p>
          </div>

          {/* Event Image */}
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-5">Event image</h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative h-48 rounded-lg border-2 border-dashed border-gray-600 bg-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm">Drag & drop your event image</p>
                  <p className="text-blue-400 text-xs">Click to browse · PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-6 mb-8">
          {/* Tickets & Pricing */}
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-5">Tickets & pricing</h2>

            <label className="text-gray-400 text-sm mb-2 block">Ticket type</label>
            <div className="flex mb-5">
              <button
                onClick={() => setTicketType("paid")}
                className={`w-24 h-9 text-xs rounded-l-lg border ${
                  ticketType === "paid"
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                    : "bg-white/5 border-gray-700 text-gray-400"
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setTicketType("free")}
                className={`w-24 h-9 text-xs border-t border-b ${
                  ticketType === "free"
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                    : "bg-white/5 border-gray-700 text-gray-400"
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setTicketType("donation")}
                className={`w-24 h-9 text-xs rounded-r-lg border ${
                  ticketType === "donation"
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                    : "bg-white/5 border-gray-700 text-gray-400"
                }`}
              >
                Donation
              </button>
            </div>

            {ticketType === "paid" && (
              <div className="mb-5">
                <label className="text-gray-400 text-sm mb-1 block">Ticket price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rs.</span>
                  <input
                    type="text"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <label className="text-gray-400 text-sm mb-1 block">Currency</label>
            <div className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 flex items-center text-white text-sm">
              Rs - Nepalese Rupees
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-5">Date & time</h2>

            <label className="text-gray-400 text-sm mb-1 block">Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 mb-2 [color-scheme:dark]"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 mb-5 [color-scheme:dark]"
            />

            <label className="text-gray-400 text-sm mb-1 block">End</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 mb-2 [color-scheme:dark]"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full h-11 px-4 bg-white/5 rounded-lg border border-gray-700 text-white text-sm outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Publish Button */}
        <div className="text-center">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-44 h-14 bg-blue-500 rounded-xl text-white text-base font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish event"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
