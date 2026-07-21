"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import FooterLink from "@/components/FooterLink";
import { useToast } from "@/components/Toast";
import api from "@/services/api";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  return (
    <footer className="bg-[#151B2B] pt-[81px]">
      <div className="flex items-center self-stretch px-16 mb-20 gap-12">
        <div className="flex flex-1 flex-col items-start pb-[15px] gap-6">
          <span className="text-[#FFB3AE] text-2xl font-bold cursor-pointer hover:opacity-80" onClick={() => router.push("/")}>EBS</span>
          <p className="text-[#E4BDBA] text-sm whitespace-pre-line">
            {"Connecting enthusiasts with the world's\nmost premium and exciting experiences.\nFrom intimate workshops to global\nfestivals."}
          </p>

        </div>
        <div className="flex flex-1 flex-col pb-[50px] gap-6">
          <h3 className="text-white text-base font-bold">Discover</h3>
          <div className="flex flex-col self-stretch gap-4">
            <FooterLink text="Popular Events" href="/events" />
            <FooterLink text="Nearby Experiences" href="/events" />
            <FooterLink text="Categories" href="/events" />
            <FooterLink text="Pricing" href="/events" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pb-[50px] gap-6">
          <h3 className="text-white text-base font-bold">Company</h3>
          <div className="flex flex-col self-stretch gap-4">
            <FooterLink text="About Us" href="/about" />
            <FooterLink text="Our Team" onClick={() => showToast("Our Team page coming soon!", "info")} />
            <FooterLink text="Careers" onClick={() => showToast("Careers page coming soon!", "info")} />
            <FooterLink text="Contact" href="/contact" />
          </div>
        </div>
        <div className="flex flex-1 flex-col pb-4 gap-4">
          <h3 className="text-white text-base font-bold">Newsletter</h3>
          <p className="text-[#E4BDBA] text-sm w-[222px] whitespace-pre-line">
            {"Get the latest event updates right in\nyour inbox."}
          </p>
          <div className="flex flex-col self-stretch gap-3">
            <input placeholder="Email address" value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="self-stretch text-gray-500 bg-[#242A3A] text-sm py-3.5 px-[17px] rounded-xl border border-solid border-[#2F344580] focus:outline-none focus:border-[#4A7AFF]" />
            <button
              onClick={async () => {
                if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  showToast("Please enter a valid email address", "error");
                  return;
                }
                setSubscribing(true);
                try {
                  const res = await api.post("/newsletter/subscribe", { email });
                  showToast(res.data.message || "Subscribed! 🎉", "success");
                  setEmail("");
                } catch (err: any) {
                  const msg = err.response?.data?.message || "Failed to subscribe. Try again.";
                  showToast(msg, "error");
                } finally {
                  setSubscribing(false);
                }
              }}
              disabled={subscribing}
              className="flex flex-col items-center self-stretch bg-[#FF4B4B] text-left py-3 rounded-xl border-0 hover:bg-[#E03B3B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white text-base font-bold">{subscribing ? "Subscribing..." : "Subscribe"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start self-stretch pt-[33px] px-16 mb-12">
        <span className="text-[#E4BDBA] text-xs">&copy; 2026 EBS. All rights reserved.</span>
        <div className="flex shrink-0 items-center">
          <span className="text-[#E4BDBA] text-xs mr-[31px] cursor-pointer hover:text-white" onClick={() => router.push("/privacy")}>Privacy Policy</span>
          <span className="text-[#E4BDBA] text-xs mr-8 cursor-pointer hover:text-white" onClick={() => router.push("/terms")}>Terms of Service</span>
          <span className="text-[#E4BDBA] text-xs cursor-pointer hover:text-white" onClick={() => router.push("/cookies")}>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
