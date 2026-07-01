"use client";

import { useState } from "react";
import FooterLink from "@/components/FooterLink";
import { useToast } from "@/components/Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  return (
    <footer className="bg-[#151B2B] pt-[81px]">
      <div className="flex items-center self-stretch px-16 mb-20 gap-12">
        <div className="flex flex-1 flex-col items-start pb-[15px] gap-6">
          <span className="text-[#FFB3AE] text-2xl font-bold">EBS</span>
          <p className="text-[#E4BDBA] text-sm whitespace-pre-line">
            {"Connecting enthusiasts with the world's\nmost premium and exciting experiences.\nFrom intimate workshops to global\nfestivals."}
          </p>
          <div className="flex items-center self-stretch gap-4">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/DTFWZiYh6s/xwthvtf6_expires_30_days.png" alt="" className="w-10 h-10 object-fill cursor-pointer hover:opacity-80" />
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/DTFWZiYh6s/uka464q1_expires_30_days.png" alt="" className="w-10 h-10 object-fill cursor-pointer hover:opacity-80" />
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/DTFWZiYh6s/188xzive_expires_30_days.png" alt="" className="w-10 h-10 object-fill cursor-pointer hover:opacity-80" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pb-[50px] gap-6">
          <h3 className="text-white text-base font-bold">Discover</h3>
          <div className="flex flex-col self-stretch gap-4">
            <FooterLink text="Popular Events" />
            <FooterLink text="Nearby Experiences" />
            <FooterLink text="Categories" />
            <FooterLink text="Pricing" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pb-[50px] gap-6">
          <h3 className="text-white text-base font-bold">Company</h3>
          <div className="flex flex-col self-stretch gap-4">
            <FooterLink text="About Us" />
            <FooterLink text="Our Team" />
            <FooterLink text="Careers" />
            <FooterLink text="Contact" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pb-4 gap-4">
          <h3 className="text-white text-base font-bold">Newsletter</h3>
          <p className="text-[#E4BDBA] text-sm w-[222px] whitespace-pre-line">
            {"Get the latest event updates right in\nyour inbox."}
          </p>
          <div className="flex flex-col self-stretch gap-3">
            <input placeholder="Email address" value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              className="self-stretch text-gray-500 bg-[#242A3A] text-sm py-3.5 px-[17px] rounded-xl border border-solid border-[#2F344580] focus:outline-none focus:border-[#4A7AFF]" />
            <button
              onClick={() => {
                if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  showToast("Please enter a valid email address", "error");
                  return;
                }
                showToast("Subscribed to newsletter! 🎉", "success");
                setEmail("");
              }}
              className="flex flex-col items-center self-stretch bg-[#FF4B4B] text-left py-3 rounded-xl border-0 hover:bg-[#E03B3B]"
            >
              <span className="text-white text-base font-bold">Subscribe</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start self-stretch pt-[33px] px-16 mb-12">
        <span className="text-[#E4BDBA] text-xs">&copy; 2026 EBS. All rights reserved.</span>
        <div className="flex shrink-0 items-center">
          <span className="text-[#E4BDBA] text-xs mr-[31px] cursor-pointer hover:text-white">Privacy Policy</span>
          <span className="text-[#E4BDBA] text-xs mr-8 cursor-pointer hover:text-white">Terms of Service</span>
          <span className="text-[#E4BDBA] text-xs cursor-pointer hover:text-white">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
