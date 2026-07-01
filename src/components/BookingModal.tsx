"use client";

import { useState } from "react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
  eventPrice: string;
  onConfirm: (qty: number) => void;
}

export default function BookingModal({ open, onClose, eventTitle, eventPrice, onConfirm }: BookingModalProps) {
  const [qty, setQty] = useState(1);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#151B2B] rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#E8E4DA] text-xl font-bold">Confirm Booking</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[#E4BDBA] text-sm mb-1">Event</p>
          <p className="text-white text-base font-medium">{eventTitle}</p>
        </div>

        <div className="mb-6">
          <p className="text-[#E4BDBA] text-sm mb-2">Number of tickets</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="w-10 h-10 rounded-lg bg-white/5 border border-gray-700 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="text-white text-2xl font-bold w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(10, qty + 1))}
              disabled={qty >= 10}
              className="w-10 h-10 rounded-lg bg-white/5 border border-gray-700 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Price per ticket</span>
            <span className="text-white text-sm">{eventPrice}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-gray-300 text-sm font-medium">Total</span>
            <span className="text-white text-lg font-bold">
              {eventPrice.includes("Rs.")
                ? `Rs. ${(parseInt(eventPrice.replace(/[^0-9]/g, "")) * qty).toLocaleString()}`
                : `${qty} × ${eventPrice}`}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(qty)}
            className="flex-1 h-12 bg-blue-500 rounded-xl text-white text-sm font-medium hover:bg-blue-600 transition-all"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
