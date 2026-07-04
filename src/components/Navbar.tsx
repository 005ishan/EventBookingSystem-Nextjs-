"use client";

import { useRouter, usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-3 items-center self-stretch bg-[#0D1223] py-[27px] px-12 flex-shrink-0 border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-50">
      <span className="text-[#E8E4DA] text-xl font-bold justify-self-start cursor-pointer" onClick={() => router.push("/")}>
        Event<span className="text-[#4A7AFF]">Booking</span>System
      </span>
      <div className="flex justify-center items-center gap-2">
        <NavLink text="Home" isActive={pathname === "/"} href="/" />
        <NavLink text="About us" isActive={pathname === "/about"} href="/about" />
        <NavLink text="Contact us" isActive={pathname === "/contact"} href="/contact" />
      </div>
      <div className="flex shrink-0 items-center gap-2.5 justify-self-end">
        <button className="flex flex-col shrink-0 items-start bg-transparent text-left py-2 px-5 rounded-lg border border-solid border-[#FFFFFF2E] hover:bg-white/5"
          onClick={() => router.push("/auth/login")}>
          <span className="text-[#E8E4DA] text-sm">Log in</span>
        </button>
        <button className="flex flex-col shrink-0 items-start bg-[#4A7AFF] text-left py-[7px] px-[21px] rounded-lg border-0 hover:bg-[#3A6AEF]"
          onClick={() => router.push("/auth/signup")}>
          <span className="text-white text-sm">Sign up</span>
        </button>
      </div>
    </nav>
  );
}
