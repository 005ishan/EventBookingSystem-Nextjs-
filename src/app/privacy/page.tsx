"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { SkeletonPublicPage } from "@/components/Skeleton";
import { isAuthenticated } from "@/services/authService";

const sections = [
  {
    title: "Information We Collect",
    content: "When you use EBS, we collect information you provide directly such as your name, email address, phone number, and payment details when creating an account or booking events. We also collect event preferences, browsing activity, and device information to improve your experience.",
  },
  {
    title: "How We Use Your Information",
    content: "We use your information to process bookings, send event confirmations and reminders, personalize event recommendations, improve our platform, and communicate with you about updates, promotions, and support inquiries. We never sell your personal data to third parties.",
  },
  {
    title: "Payment Processing",
    content: "All payments are processed securely through third-party payment gateways like eSewa. We do not store your full payment card details on our servers. Payment transactions are encrypted using industry-standard SSL/TLS protocols.",
  },
  {
    title: "Data Sharing",
    content: "We may share your information with event organizers when you book their events so they can manage attendance and communicate event details. We may also share data with service providers who help us operate the platform, subject to strict confidentiality agreements.",
  },
  {
    title: "Data Retention",
    content: "We retain your account information for as long as your account is active. Booking records are retained for legal and tax purposes as required by applicable laws. You may request deletion of your account and associated data at any time.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data at any time through your account settings. You may also opt out of marketing communications and request a copy of the data we hold about you by contacting our support team.",
  },
  {
    title: "Security",
    content: "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, and regular security audits.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a notice on our platform. Continued use of EBS after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content: "If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@ebs.com or through our Contact page.",
  },
];

export default function PrivacyPage() {
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
                <span className="text-[#4A7AFF] text-xs font-medium tracking-wide">Privacy</span>
              </div>

              <div className="flex flex-col items-center max-w-[700px] pt-2">
                <h1 className="text-center text-[#E8E4DA] text-5xl md:text-6xl font-bold leading-[1.1]">
                  Privacy{" "}
                  <span className="text-[#4A7AFF]">
                    Policy
                  </span>
                </h1>
              </div>

              <div className="max-w-[540px] text-center">
                <p className="text-[#E4BDBA] text-base leading-7">
                  Last updated: July 2026. Your privacy matters to us. This policy
                  explains how we collect, use, and protect your personal information
                  when you use EBS.
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
