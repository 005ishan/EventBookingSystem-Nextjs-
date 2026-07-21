"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { SkeletonPublicPage } from "@/components/Skeleton";
import { isAuthenticated } from "@/services/authService";

const sections = [
  {
    title: "What Are Cookies",
    content: "Cookies are small text files stored on your device by your web browser. They help websites remember your preferences, login status, and browsing behavior. Cookies make your experience on EBS faster, smoother, and more personalized.",
  },
  {
    title: "How We Use Cookies",
    content: "We use cookies to keep you logged in, remember your preferences, analyze how you use our platform, and improve our services. Cookies also help us show you relevant events and prevent fraudulent activity on your account.",
  },
  {
    title: "Essential Cookies",
    content: "These cookies are necessary for the basic functioning of EBS. They enable core features like user authentication, session management, and secure payment processing. Without these cookies, certain parts of the platform may not function properly.",
  },
  {
    title: "Analytics Cookies",
    content: "We use analytics cookies to understand how visitors interact with our platform. This helps us improve the user experience by identifying popular features, tracking error rates, and optimizing page load times. We use this data in aggregate form.",
  },
  {
    title: "Preference Cookies",
    content: "Preference cookies remember your settings and choices on EBS, such as your preferred language, saved filters, and notification preferences. These cookies make your experience more convenient by remembering your choices between visits.",
  },
  {
    title: "Third-Party Cookies",
    content: "Some third-party services integrated with EBS, such as payment gateways and analytics providers, may place their own cookies on your device. We do not control these cookies. Please review the privacy policies of these third parties for more information.",
  },
  {
    title: "Managing Cookies",
    content: "You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies. However, please note that disabling certain cookies may affect the functionality of EBS and limit your ability to use all features.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we use cookies.",
  },
  {
    title: "Contact Us",
    content: "If you have any questions about our use of cookies, please contact us at support@ebs.com or visit our Contact page for more information.",
  },
];

export default function CookiesPage() {
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
                <span className="text-[#4A7AFF] text-xs font-medium tracking-wide">Cookies</span>
              </div>

              <div className="flex flex-col items-center max-w-[700px] pt-2">
                <h1 className="text-center text-[#E8E4DA] text-5xl md:text-6xl font-bold leading-[1.1]">
                  Cookie{" "}
                  <span className="text-[#4A7AFF]">
                    Policy
                  </span>
                </h1>
              </div>

              <div className="max-w-[540px] text-center">
                <p className="text-[#E4BDBA] text-base leading-7">
                  Last updated: July 2026. This policy explains how EBS uses cookies
                  and similar technologies to enhance your browsing experience.
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
