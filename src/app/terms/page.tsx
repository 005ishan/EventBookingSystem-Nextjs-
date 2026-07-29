"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { SkeletonPublicPage } from "@/components/Skeleton";
import { isAuthenticated } from "@/services/authService";

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using EBS, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform. These terms apply to all visitors, users, and event organizers.",
  },
  {
    title: "Account Registration",
    content: "You must create an account to book events or list events as an organizer. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration.",
  },
  {
    title: "Event Bookings",
    content: "When you book an event through EBS, you enter into a direct agreement with the event organizer. EBS facilitates the transaction but is not responsible for the quality, cancellation, or content of the event. All ticket purchases are subject to the organizer's refund and cancellation policy.",
  },
  {
    title: "Organizer Obligations",
    content: "Event organizers agree to provide accurate event details, honor all confirmed bookings, and comply with all applicable laws. Organizers are responsible for any taxes, permits, or licenses required for their events. EBS reserves the right to remove listings that violate our policies.",
  },
  {
    title: "Payments and Fees",
    content: "EBS uses eSewa for payment processing. All payments are processed securely. Service fees may apply to ticket purchases and are clearly displayed before checkout. Refunds are handled according to each event organizer's policy.",
  },
  {
    title: "Prohibited Conduct",
    content: "You agree not to use EBS for any unlawful purpose, to impersonate any person or entity, to interfere with the platform's operation, to collect user information without consent, or to post false or misleading event listings. Violation may result in account suspension.",
  },
  {
    title: "Intellectual Property",
    content: "The EBS platform, including its design, logo, and content, is owned by EBS and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
  },
  {
    title: "Limitation of Liability",
    content: "EBS is provided 'as is' without warranties of any kind. To the maximum extent permitted by law, EBS shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including event cancellations or disputes with organizers.",
  },
  {
    title: "Termination",
    content: "We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason. You may delete your account at any time through your account settings. Upon termination, your right to use the platform ceases immediately.",
  },
  {
    title: "Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these terms shall be resolved in the courts of Kathmandu, Nepal.",
  },
  {
    title: "Changes to Terms",
    content: "We may modify these terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of EBS after changes constitutes acceptance of the new terms. We recommend reviewing these terms periodically.",
  },
];

export default function TermsPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SkeletonPublicPage />;

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-[#0A0E1A] border border-solid border-black flex flex-col min-h-screen"
        style={{ boxShadow: "0px 4px 4px #00000040" }}>
        {loggedIn ? <AuthenticatedNavbar /> : <Navbar />}

        <div className="flex-1 overflow-y-auto">
          <section className="self-stretch pb-10">
            <div className="flex flex-col items-center self-stretch max-w-[1150px] pt-20 pb-14 px-6 mx-auto gap-6">
              <div className="flex items-center bg-[#4A7AFF]/10 py-1 px-5 gap-2 rounded-full border border-[#4A7AFF]/30">
                <span className="text-[#4A7AFF] text-xs font-medium tracking-wide">Legal</span>
              </div>

              <div className="flex flex-col items-center max-w-[700px] pt-2">
                <h1 className="text-center text-[#E8E4DA] text-5xl md:text-6xl font-bold leading-[1.1]">
                  Terms of{" "}
                  <span className="text-[#4A7AFF]">
                    Service
                  </span>
                </h1>
              </div>

              <div className="max-w-[540px] text-center">
                <p className="text-[#E4BDBA] text-base leading-7">
                  Last updated: July 2026. Please read these terms carefully before
                  using EBS. By using our platform, you agree to these terms.
                </p>
              </div>
            </div>

            <div className="max-w-[800px] mx-auto px-6 pt-5 pb-16">
              <div className="bg-[#151B2B] rounded-2xl border border-white/10 p-8 md:p-12 flex flex-col gap-8">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-[#E8E4DA] text-xl font-bold mb-3 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#4A7AFF]/15 flex items-center justify-center text-[#4A7AFF] text-xs font-bold shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </h2>
                    <p className="text-[#E4BDBA]/70 text-sm leading-7 ml-10">
                      {section.content}
                    </p>
                    {i < sections.length - 1 && (
                      <div className="h-px bg-white/5 mt-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}
