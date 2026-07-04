"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { isAuthenticated } from "@/services/authService";
import {
  getEventById,
  updateEvent,
  uploadEventImage,
} from "@/services/eventService";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Festival",
    date: "",
    time: "",
    location: "",
    price: "",
    totalSeats: "100",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    loadEvent();
  }, [params.id]);

  async function loadEvent() {
    try {
      const data = await getEventById(params.id as string);
      const e = data.event;
      const eventDate = e.date ? e.date.split("T")[0] : "";
      setForm({
        title: e.title || "",
        description: e.description || "",
        category: e.category || "Festival",
        date: eventDate,
        time: e.time || "",
        location: e.location || "",
        price: String(e.price || 0),
        totalSeats: String(e.totalSeats || 100),
      });
      if (e.image) {
        setExistingImage(`${API_BASE}${e.image}`);
      }
      setLoading(false);
    } catch {
      router.push("/events/my-events");
    }
  }

  function processFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB");
      return;
    }
    setNewImage(file);
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

  async function handleSave() {
    setError("");
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.date ||
      !form.time
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      let image = existingImage ? existingImage.replace(API_BASE, "") : "";
      if (newImage) {
        const uploadRes = await uploadEventImage(newImage);
        image = uploadRes.image;
      }
      await updateEvent(params.id as string, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        price: parseFloat(form.price) || 0,
        totalSeats: parseInt(form.totalSeats) || 100,
        image,
      });
      router.push("/events/my-events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    }
    setSaving(false);
  }

  if (!isAuthenticated()) return null;

  const inputClass =
    "w-full h-11 px-4 bg-[rgba(255,255,255,0.04)] rounded-lg outline outline-1 outline-[rgba(255,255,255,0.08)] text-[#E8E4DA] text-sm font-[DM_Sans] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-[rgba(74,122,255,0.5)] transition-all";
  const textareaClass =
    "w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] rounded-lg outline outline-1 outline-[rgba(255,255,255,0.08)] text-[#E8E4DA] text-sm font-[DM_Sans] placeholder:text-[rgba(232,228,218,0.22)] focus:outline-[rgba(74,122,255,0.5)] resize-none transition-all";
  const labelClass =
    "text-[rgba(232,228,218,0.40)] text-xs font-[DM_Sans] mb-1.5 block tracking-[0.3px]";
  const selectClass =
    "w-full h-11 px-4 bg-[rgba(255,255,255,0.04)] rounded-lg outline outline-1 outline-[rgba(255,255,255,0.08)] text-[#E8E4DA] text-sm font-[DM_Sans] focus:outline-[rgba(74,122,255,0.5)] transition-all [color-scheme:dark]";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A]">
        <AuthenticatedNavbar />
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 bg-[rgba(74,122,255,0.3)] rounded-full animate-pulse" />
              <div className="h-3 w-24 bg-[rgba(255,255,255,0.06)] rounded animate-pulse" />
            </div>
            <div className="h-9 w-48 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mt-2" />
            <div className="h-4 w-36 bg-[rgba(255,255,255,0.04)] rounded animate-pulse mt-2" />
          </div>

          <div className="bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] p-8 flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-2" />
                <div className="h-11 w-full bg-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
              </div>
            ))}
            <div>
              <div className="h-3 w-20 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-2" />
              <div className="h-24 w-full bg-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1">
                  <div className="h-3 w-16 bg-[rgba(255,255,255,0.06)] rounded animate-pulse mb-2" />
                  <div className="h-11 w-full bg-[rgba(255,255,255,0.04)] rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />

      {/* ── Header ── */}
      <div className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-[DM_Sans] uppercase tracking-[1.5px] text-[rgba(232,228,218,0.35)]">
              Edit Event
            </span>
          </div>

          <h1 className="text-[#E8E4DA] text-3xl font-['Playfair_Display'] font-semibold leading-tight">
            Edit <span className="text-[#4A7AFF]">Event</span>
          </h1>
          <p className="text-[rgba(232,228,218,0.30)] text-sm font-[DM_Sans] mt-1.5">
            Update your event details below
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-[#0D1223] rounded-xl outline outline-1 outline-[rgba(255,255,255,0.06)] p-8 flex flex-col gap-6">
          {/* Basic info section */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[rgba(232,228,218,0.20)] text-[10px] font-[DM_Sans] uppercase tracking-[1px]">
              Basic Information
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <div>
            <label className={labelClass}>Event name</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Give your event a great name..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe what attendees can expect..."
              rows={4}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Where is this event?"
              className={inputClass}
            />
          </div>

          {/* Details section */}
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[rgba(232,228,218,0.20)] text-[10px] font-[DM_Sans] uppercase tracking-[1px]">
              Details
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={selectClass}
              >
                {["Festival", "Concert", "Social", "Charity", "Others"].map(
                  (c) => (
                    <option key={c} value={c} className="bg-[#0D1223]">
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (Rs.)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total Seats</label>
              <input
                type="number"
                value={form.totalSeats}
                onChange={(e) =>
                  setForm({ ...form, totalSeats: e.target.value })
                }
                placeholder="100"
                min="1"
                className={inputClass}
              />
            </div>
          </div>

          {/* Date & time section */}
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[rgba(232,228,218,0.20)] text-[10px] font-[DM_Sans] uppercase tracking-[1px]">
              Date & Time
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Image section */}
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[rgba(232,228,218,0.20)] text-[10px] font-[DM_Sans] uppercase tracking-[1px]">
              Event Image
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative h-44 rounded-lg border-2 border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:border-[rgba(74,122,255,0.4)] transition-all overflow-hidden group"
            >
              {(imagePreview || existingImage) && !imagePreview ? (
                <img
                  src={existingImage}
                  alt="Current"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[rgba(74,122,255,0.08)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[rgba(74,122,255,0.5)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                      />
                    </svg>
                  </div>
                  <p className="text-[rgba(232,228,218,0.35)] text-sm font-[DM_Sans]">
                    Click or drag to change image
                  </p>
                  <p className="text-[rgba(232,228,218,0.15)] text-xs font-[DM_Sans]">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}

              {/* Image overlay on hover */}
              {(imagePreview || existingImage) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Status badge */}
              {(imagePreview || existingImage) && (
                <div className="absolute bottom-2 right-2 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-[rgba(255,255,255,0.7)] text-[10px] font-[DM_Sans] px-2 py-1 rounded-md">
                  {newImage ? "New image" : "Current"}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mt-5 flex items-center gap-3 bg-[rgba(255,75,75,0.08)] outline outline-1 outline-[rgba(255,75,75,0.20)] rounded-lg px-4 py-3">
            <svg
              className="w-4 h-4 text-[#FF4B4B] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <span className="text-[#FF4B4B] text-xs font-[DM_Sans]">
              {error}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="sticky bottom-0 bg-[#0D1223] border-t border-[rgba(255,255,255,0.08)] px-8 py-4 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/events/my-events")}
            className="px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.15)] text-white text-sm hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-500 rounded-xl text-white text-sm font-medium hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
