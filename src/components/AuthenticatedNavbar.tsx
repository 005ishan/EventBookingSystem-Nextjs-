"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";
import { getUser, logout } from "@/services/authService";

export default function AuthenticatedNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = getUser();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setShowDropdown(false);
    router.push("/");
  }

  return (
    <nav className="grid grid-cols-3 items-center self-stretch bg-[#050811] py-[27px] px-12 flex-shrink-0 border-b border-[#1A2040]">
      <span
        className="text-[#E8E4DA] text-xl font-bold justify-self-start cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Event
        <span className="bg-gradient-to-r from-[#4A7AFF] to-[#bcb6fc] bg-clip-text text-transparent">
          Booking
        </span>
        System
      </span>

      <div className="flex justify-center items-center gap-2">
        <NavLink text="Home" isActive={pathname === "/dashboard"} href="/dashboard" />        <NavLink text="Events" isActive={pathname.startsWith("/events")} href="/events" />
        <NavLink
          text="About us"
          isActive={pathname === "/about"}
          href="/about"
        />
        <NavLink
          text="Contact us"
          isActive={pathname === "/contact"}
          href="/contact"
        />
      </div>

      <div
        className="flex shrink-0 items-center gap-2.5 justify-self-end relative"
        ref={dropdownRef}
      >
        <button
          className="flex items-center gap-2.5 py-2 pl-3 pr-4 rounded-lg  transition-all"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {/* Avatar circle with initials */}   
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7AFF] to-[#bcb6fc] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <span className="text-[#E8E4DA] text-sm font-medium max-w-[100px] truncate">
            {user?.name || "User"}
          </span>
          {/* Dropdown chevron */}
          <svg
            className={`w-4 h-4 text-[#E8E4DA]/60 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-[#151B2B] rounded-xl border border-[#FFFFFF1A] shadow-2xl overflow-hidden z-50">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-[#FFFFFF0D]">
              <p className="text-[#E8E4DA] text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[#E4BDBA]/50 text-xs truncate mt-0.5">
                {user?.email || ""}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[#E8E4DA]/80 text-sm hover:bg-[#1A2040] transition-all text-left"
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/events/create");
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Create Events
              </button>
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[#E8E4DA]/80 text-sm hover:bg-[#1A2040] transition-all text-left"
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/tickets");
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-6.75-8.25h3m-3 3h3M9 6.75h.008v.008H9V6.75zm0 6h.008v.008H9V12.75zm0 3h.008v.008H9V15.75zM5.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3z"
                  />
                </svg>
                Your Tickets
              </button>
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[#E8E4DA]/80 text-sm hover:bg-[#1A2040] transition-all text-left"
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/profile");
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-[#FFFFFF0D] py-1">
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[#FF4B4B]/80 text-sm hover:bg-[#1A2040] hover:text-[#FF4B4B] transition-all text-left"
                onClick={handleLogout}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
