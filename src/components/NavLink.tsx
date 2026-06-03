"use client";

import { useRouter } from "next/navigation";

export default function NavLink({ text, isActive, href }: any) {
  const router = useRouter();

  return (
    <div className="flex flex-col shrink-0 items-start py-[1px] px-[15px]">
      <span
        className={`text-sm ${isActive ? "text-[#4A7AFF]" : "text-[#E8E4DA]"} hover:text-[#4A7AFF] cursor-pointer`}
        onClick={() => href && router.push(href)}
      >
        {text}
      </span>
    </div>
  );
}
