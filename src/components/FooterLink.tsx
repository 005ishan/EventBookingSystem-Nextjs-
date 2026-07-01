"use client";

export default function FooterLink({ text }: { text: string }) {
  return (
    <span className="text-[#E4BDBA] text-sm cursor-pointer hover:text-white">{text}</span>
  );
}
