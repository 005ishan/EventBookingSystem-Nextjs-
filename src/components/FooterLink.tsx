"use client";

import { useRouter } from "next/navigation";

export default function FooterLink({ text, href, onClick }: { text: string; href?: string; onClick?: () => void }) {
  const router = useRouter();

  function handleClick() {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  }

  return (
    <span className="text-[#E4BDBA] text-sm cursor-pointer hover:text-white" onClick={handleClick}>{text}</span>
  );
}
